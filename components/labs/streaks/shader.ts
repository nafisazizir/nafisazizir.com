/**
 * Streak field. A soft colour field (domain-warped fbm, a linear tilt and two
 * placeable "masses") is mapped through a 5-stop palette and motion-blurred
 * along streamlines. Streamlines are either parallel curves in a rotated frame
 * (x along, c across):
 *
 *   y = c·(1 + fan·x) + bend·x² + swirl·S(x)
 *
 * or, with `radial`, rays out of a focus point (x = distance, c = angle). Each
 * pixel solves for its own c and averages the field along its line, like a
 * long exposure.
 *
 * Detail that survives the blur lives in the streak frame, keyed on c so it
 * stays sharp across the streak:
 * - stretch squeezes the noise along the streak, so the field is already
 *   streaky before the blur and keeps its contrast across it;
 * - fibre: soft striations; fibreBreak lets them vary along the streak;
 * - strikes: sparse hairlines, broken into dashes by strikeBreak.
 * - hero: one placeable hairline, for the single deliberate strike.
 * Strikes can be confined to a soft zone and mixed light and dark.
 * `soften` spreads the samples across the streak too, so the exposure becomes
 * a 2D blur: soft photo-like shapes, and a blown-out core in radial mode.
 * An accent colour sits outside the palette ramp, in its own placeable blob
 * (optionally broken up by the field noise), and is streaked with everything
 * else: the second hue a single ramp can't reach.
 * The average is taken over both colour and palette coordinate; `blend` picks
 * between them (colour averages to grey between contrasting stops, the
 * coordinate passes through the stops in between). `knee` rolls the ramp's
 * ends off softly instead of clamping them flat. `chroma` disperses the whole
 * thing across the streak into a 5-tap spectrum: prism fringes on hard edges,
 * flipped when negative. No grain.
 *
 * Uniform contract (see renderer.ts): every numeric param in STREAK_PARAMS is
 * bound to `u_<key>` (degrees converted to radians), plus u_full, u_origin,
 * u_time, u_samples, u_dither, u_stops[5] and u_accent (linear RGB).
 */

export const STREAK_VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`

export const STREAK_FRAG = `#version 300 es
precision highp float;

uniform vec2  u_full, u_origin;
uniform float u_seed, u_time;
uniform float u_scale, u_noise, u_stretch, u_warp, u_hard, u_hardSkew, u_level, u_knee;
uniform float u_tilt, u_tiltAngle;
uniform float u_mass, u_massX, u_massY, u_massSize, u_massStretch, u_mass2Stretch;
uniform float u_massShape, u_massWarp;
uniform float u_dabs, u_dabDensity, u_dabSize, u_dabStretch, u_dabMix;
uniform float u_mass2, u_mass2X, u_mass2Y, u_mass2Size;
uniform float u_mass3, u_mass3X, u_mass3Y, u_mass3Size;
uniform float u_accentAmt, u_accentX, u_accentY, u_accentSize, u_accentNoise;
uniform float u_accentHard, u_accentStretch, u_accentPost;
uniform float u_accent2Amt, u_accent2X, u_accent2Y, u_accent2Size, u_accent2Noise;
uniform float u_band, u_bandC, u_bandWidth, u_bandX0, u_bandX1, u_bandWobble, u_bendC;
uniform float u_heroTint, u_heroPost, u_hero2X, u_hero2Len, u_clump, u_clumpScale, u_softenCone;
uniform float u_accentTone, u_accentToneWidth;
uniform float u_lum, u_lumX, u_lumY, u_lumSize;
uniform float u_edge, u_edgeX, u_edgeY, u_edgeAngle, u_edgeSoft, u_edgeSize;
uniform float u_band2, u_band2C;
uniform float u_petals, u_petalFreq, u_petalTip, u_petalJitter, u_petalWidth;
uniform float u_colTilt, u_colFreq;
uniform float u_fibreZone, u_lumPost;
uniform float u_mass2Angle, u_mass3Stretch, u_edgeBend, u_lumNoise;
uniform float u_accent2Tone, u_accent2ToneWidth, u_detailTint;
uniform float u_softenZone, u_softenX, u_softenY, u_dabZone, u_dabX, u_dabY;
uniform float u_angle, u_bend, u_fan, u_swirl, u_length, u_soften, u_detailSoften;
uniform float u_radial, u_focusX, u_focusY, u_zoom, u_polar, u_core;
uniform float u_strikes, u_strikeFreq, u_strikeWidth, u_strikeBreak, u_strikeDash;
uniform float u_strikeMix, u_strikeZone, u_strikeX, u_strikeY;
uniform float u_hero, u_heroOffset, u_heroWidth, u_heroX, u_heroLen;
uniform float u_hero2, u_hero2Offset;
uniform float u_fibre, u_fibreFreq, u_fibreBreak, u_fibreHard;
uniform float u_contrast, u_shift, u_blend, u_chroma, u_dither;
uniform int   u_samples;
uniform vec3  u_stops[5];
uniform vec3  u_accent, u_accent2, u_heroColor, u_detailColor;

out vec4 o;

const mat2 R = mat2(0.8, -0.6, 0.6, 0.8);

// Set once in main.
bool g_radial, g_polar;
// The noise at the last field() read (for lumNoise), and the local soften.
float g_f, g_soften;
// Blur radius in noise units, for prefiltering the fbm under soften.
float g_lp;
mat2 g_back;
vec2 g_focus;
float g_phi0;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float hash1(float n) { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }

float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i), f), dot(hash2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
    mix(dot(hash2(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash2(i + vec2(1, 1)), f - vec2(1, 1)), u.x),
    u.y);
}

// Under soften each octave is attenuated by a gaussian blur's response at its
// frequency, so the sparse across-taps never see detail they would alias.
float fbm(vec2 p, int oct) {
  float s = 0.0, a = 0.5, fr = 1.0;
  for (int i = 0; i < 5; i++) {
    if (i >= oct) break;
    float lp = g_lp > 0.0 ? exp(-19.74 * g_lp * g_lp * fr * fr) : 1.0;
    s += a * lp * gnoise(p);
    p = R * p * 2.03 + vec2(3.1, 1.7);
    a *= 0.5;
    fr *= 2.03;
  }
  return s;
}

vec2 seedOff() { return vec2(fract(u_seed * 0.1373) * 97.0, fract(u_seed * 0.0719) * 89.0); }

float swirlS(float x) { return u_swirl * gnoise(vec2(x * 0.9 + seedOff().x, 4.2)); }

// Parallel: the line's offset across. Radial: the ray's angle.
// bendC curves the lines on one side more than the other.
float lineY(float x, float c) { return c * (1.0 + u_fan * x + u_bendC * x * x) + u_bend * x * x + swirlS(x); }
float rayA(float x, float c) { return g_phi0 + c * (1.0 + u_bendC * x) + u_bend * x + swirlS(x); }

// The world point at (x along, c across). The noise is read at the same point
// with x squeezed by stretch, which elongates its features along the streak.
vec2 at(float x, float c, float squeeze) {
  if (g_radial) {
    float a = rayA(x, c);
    return g_focus + x * squeeze * vec2(cos(a), sin(a));
  }
  return g_back * vec2(x * squeeze, lineY(x, c));
}

// Radial only: everything keyed on the angle converges at the focus into a
// hairy star. Inside the core radius it fades out to the plain field.
float coreFade(float x) {
  return g_radial && u_core > 0.0 ? smoothstep(0.0, u_core, x) : 1.0;
}

// Where the noise is read. Polar (radial only) reads it in (angle, distance),
// so features keep a constant angular width: wedges and petals that widen
// outward, stretched along the rays.
vec2 noiseAt(float x, float c) {
  if (g_polar) return vec2(c * 0.5 * coreFade(x), x / u_stretch);
  return at(x, c, 1.0 / u_stretch);
}

// Which way the streaks run at p, for stretching the masses along them.
vec2 streakDir(vec2 p) {
  if (g_radial) {
    vec2 d = p - g_focus;
    return dot(d, d) > 1e-6 ? normalize(d) : vec2(1.0, 0.0);
  }
  return g_back * vec2(1.0, 0.0);
}

// A gaussian stretched along the streaks. massShape > 2 flattens its top
// toward a rounded box, massWarp bends its outline with low-frequency noise.
// axis (a unit vector) overrides the streak direction when non-zero.
float blobAx(vec2 p, vec2 centre, float size, float stretch, vec2 axis) {
  if (u_massWarp > 0.0) {
    vec2 o = seedOff();
    p += u_massWarp * 0.25 * vec2(gnoise(p * 2.5 + o), gnoise(p * 2.5 - o.yx + 5.2));
  }
  vec2 m = p - centre;
  vec2 d = dot(axis, axis) > 0.0 ? axis : streakDir(centre);
  float a = dot(m, d) / stretch;
  float b = dot(m, vec2(-d.y, d.x));
  size = max(size, 0.03);
  if (u_massShape == 2.0) return exp(-(a * a + b * b) / (size * size));
  float k = u_massShape;
  return exp(-(pow(abs(a), k) + pow(abs(b), k)) / pow(size, k));
}
float blob(vec2 p, vec2 centre, float size, float stretch) {
  return blobAx(p, centre, size, stretch, vec2(0.0));
}

// Where the accent sits (0..1): its blob, optionally hardened into a solid
// core and broken up by the field noise f.
float accentShape(vec2 p, float f) {
  float b = blob(p, vec2(u_accentX, u_accentY), u_accentSize, u_accentStretch);
  b = mix(b, smoothstep(0.2, 0.6, b), u_accentHard);
  return b * mix(1.0, smoothstep(-0.25, 0.25, sign(u_accentNoise) * f), abs(u_accentNoise));
}
// The second accent shares hardness and stretch; it reads the noise flipped,
// so the two break up in different places.
float accent2Shape(vec2 p, float f) {
  float b = blob(p, vec2(u_accent2X, u_accent2Y), u_accent2Size, u_accentStretch);
  b = mix(b, smoothstep(0.2, 0.6, b), u_accentHard);
  return b * mix(1.0, smoothstep(-0.25, 0.25, -sign(u_accent2Noise) * f), abs(u_accent2Noise));
}

// Accent mixing happens in Oklab, so half a dark accent looks half dark and
// blue over orange doesn't pass through grey.
vec3 toOk(vec3 c) {
  vec3 l = vec3(0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b,
                0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b,
                0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b);
  l = pow(max(l, 0.0), vec3(1.0 / 3.0));
  return vec3(0.2104542553 * l.x + 0.7936177850 * l.y - 0.0040720468 * l.z,
              1.9779984951 * l.x - 2.4285922050 * l.y + 0.4505937099 * l.z,
              0.0259040371 * l.x + 0.7827717662 * l.y - 0.8086757660 * l.z);
}
vec3 fromOk(vec3 c) {
  vec3 l = vec3(c.x + 0.3963377774 * c.y + 0.2158037573 * c.z,
                c.x - 0.1055613458 * c.y - 0.0638541728 * c.z,
                c.x - 0.0894841775 * c.y - 1.2914855480 * c.z);
  l = l * l * l;
  return vec3(4.0767416621 * l.x - 3.3077115913 * l.y + 0.2309699292 * l.z,
             -1.2684380046 * l.x + 2.6097574011 * l.y - 0.3413193965 * l.z,
             -0.0041960863 * l.x - 0.7034186147 * l.y + 1.7076147010 * l.z);
}
vec3 okMix(vec3 a, vec3 b, float t) {
  if (t <= 0.0) return a;
  return max(fromOk(mix(toOk(a), toOk(b), clamp(t, 0.0, 1.0))), 0.0);
}
vec3 accents(vec3 c, vec2 a) { return okMix(okMix(c, u_accent, a.x), u_accent2, a.y); }

// The domain-warped noise, read at np.
float noiseF(vec2 np) {
  float t = u_time;
  vec2 q = np * u_scale + seedOff();
  vec2 w = vec2(fbm(q * 0.6 + vec2(1.7, 9.2) + 0.07 * t, 3),
                fbm(q * 0.6 + vec2(8.3, 2.8) - 0.05 * t, 3));
  q += u_warp * 2.2 * w;
  return fbm(q, 4) * 2.2;
}

// The colour field, before blur. Returns a palette coordinate (~0..1), and
// in acc how much of each accent colour sits here.
// p places the composition (tilt, masses), np reads the noise.
float field(vec2 p, vec2 np, out vec2 acc) {
  float f = noiseF(np);
  g_f = f;
  float n = u_noise * f + 0.5 + u_level;
  n += u_tilt * dot(p, vec2(cos(u_tiltAngle), sin(u_tiltAngle)));
  n += u_mass * blob(p, vec2(u_massX, u_massY), u_massSize, u_massStretch);
  // Masses 2–3 can take a fixed axis (mass2Angle ≠ 0) instead of the streaks'.
  vec2 ax = u_mass2Angle != 0.0 ? vec2(cos(u_mass2Angle), sin(u_mass2Angle)) : vec2(0.0);
  n += u_mass2 * blobAx(p, vec2(u_mass2X, u_mass2Y), u_mass2Size, u_mass2Stretch, ax);
  n += u_mass3 * blobAx(p, vec2(u_mass3X, u_mass3Y), u_mass3Size,
                        u_mass3Stretch > 0.0 ? u_mass3Stretch : u_mass2Stretch, ax);
  if (u_edge != 0.0) {
    // A placed silhouette: a half-plane through (edgeX, edgeY), rising toward
    // edgeAngle, with its own softness.
    vec2 nrm = vec2(cos(u_edgeAngle), sin(u_edgeAngle));
    vec2 e = p - vec2(u_edgeX, u_edgeY);
    // edgeSize > 0 bounds it to a soft disc, to trim one side of one shape.
    float env = u_edgeSize > 0.0 ? exp(-dot(e, e) / (u_edgeSize * u_edgeSize)) : 1.0;
    // edgeBend curves the line (quadratic along it).
    float along = dot(e, vec2(-nrm.y, nrm.x));
    n += u_edge * env * smoothstep(-u_edgeSoft, u_edgeSoft, dot(e, nrm) + u_edgeBend * along * along);
  }
  acc = vec2(u_accentAmt > 0.0 ? u_accentAmt * accentShape(p, f) : 0.0,
             u_accent2Amt > 0.0 ? u_accent2Amt * accent2Shape(p, f) : 0.0);
  // Skew makes an edge sharp on one side and a slow roll-off on the other.
  float h = mix(0.5, 0.03, u_hard);
  return mix(n, smoothstep(0.5 - h * (1.0 - u_hardSkew), 0.5 + h * (1.0 + u_hardSkew), n), u_hard);
}

vec3 palette(float t) {
  t = (t - 0.5) * u_contrast + 0.5 + u_shift;
  if (u_knee > 0.0) {
    // Exponential roll-off into each end: matches the ramp's slope where it
    // starts, so overshoot keeps its detail instead of going flat.
    float k = 0.3 * u_knee;
    if (t > 1.0 - k) t = 1.0 - k * exp(-(t - 1.0 + k) / k);
    else if (t < k) t = k * exp((t - k) / k);
  }
  t = clamp(t, 0.0, 1.0) * 4.0;
  int i = int(min(floor(t), 3.0));
  float f = t - float(i);
  f = mix(f, smoothstep(0.0, 1.0, f), 0.5);
  return mix(u_stops[i], u_stops[i + 1], f);
}

// Clump: a low-frequency envelope that gathers fibre and strikes into a few
// bands instead of spreading them evenly.
float clumpEnv(float x, float c) {
  if (u_clump <= 0.0) return 1.0;
  float g = gnoise(vec2(x * 0.3 + seedOff().y, c * u_clumpScale + 2.7));
  return mix(1.0, smoothstep(-0.2, 0.3, g), u_clump);
}

// Striations: two scales of noise across the streak, varying along it.
float fibre(float x, float c) {
  if (u_fibre <= 0.0) return 0.0;
  vec2 o = seedOff().yx;
  float k = 1.0 + 8.0 * u_fibreBreak;
  float a = gnoise(vec2(x * 0.5 * k + o.x, c * u_fibreFreq));
  float b = gnoise(vec2(x * 0.8 * k - o.y, c * u_fibreFreq * 3.1));
  float v = a + 0.45 * b;
  // Hard fibre: distinct petals with gaps between them.
  if (u_fibreHard > 0.0) v = mix(v, smoothstep(-0.12, 0.12, v) - 0.5, u_fibreHard);
  return u_fibre * v;
}

// Hairlines: at most one per band across, at a random offset, width and
// strength (most bands stay empty), cut into dashes along the streak. A
// share of them (strikeMix) flips sign, and strikeZone confines them to a
// soft disc around (strikeX, strikeY). p is the world point.
float zoneAt(vec2 p) {
  if (u_strikeZone <= 0.0) return 1.0;
  vec2 d = p - vec2(u_strikeX, u_strikeY);
  return exp(-dot(d, d) / (u_strikeZone * u_strikeZone));
}

float strike(float x, float c, vec2 p) {
  if (u_strikes == 0.0) return 0.0;
  float zone = zoneAt(p);
  float v = c * u_strikeFreq + seedOff().x;
  float i = floor(v);
  float h1 = hash1(i), h2 = hash1(i + 17.3), h3 = hash1(i + 41.9);
  float sgn = hash1(i + 73.1) < u_strikeMix ? -1.0 : 1.0;
  float d = (fract(v) - (0.15 + 0.7 * h1)) / u_strikeFreq;
  float w = u_strikeWidth * (0.4 + 1.6 * h3 * h3);
  // A crisp core in a soft halo: feathered, not a drawn line.
  float prof = mix(exp(-d * d / (w * w)), exp(-d * d / (16.0 * w * w)), 0.4);
  float strength = smoothstep(0.25, 1.0, h2);
  float n = gnoise(vec2(x * (0.4 + 5.0 * u_strikeDash) + h1 * 31.0, i * 0.731));
  float seg = smoothstep(-0.1, 0.15, n + 0.45 - 0.75 * u_strikeBreak);
  return u_strikes * sgn * zone * strength * prof * seg;
}

// Dabs: scattered soft flecks, at most one per cell of a grid in the streak
// frame (cells dabStretch times longer along), present with probability
// dabDensity, a share (dabMix) dark. They share the strikes' zone.
float dabs(float x, float c, vec2 p) {
  if (u_dabs == 0.0) return 0.0;
  vec2 g = vec2(x / (u_dabSize * u_dabStretch), (g_radial ? 0.5 * c : c) / u_dabSize);
  vec2 id = floor(g), f = fract(g);
  float s = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = id + vec2(i, j);
      float pr = hash1(dot(cell, vec2(7.13, 3.71)) + u_seed * 1.37);
      if (pr > u_dabDensity) continue;
      vec2 h = 0.5 + 0.5 * hash2(cell + seedOff());
      vec2 d = f - vec2(i, j) - h;
      float r = 0.18 + 0.3 * fract(pr * 13.7);
      float sgn = fract(pr * 31.3) < u_dabMix ? -1.0 : 1.0;
      s += sgn * exp(-dot(d, d) / (r * r));
    }
  }
  float zone = zoneAt(p);
  if (u_dabZone > 0.0) {
    vec2 dz = p - vec2(u_dabX, u_dabY);
    zone = exp(-dot(dz, dz) / (u_dabZone * u_dabZone));
  }
  return u_dabs * zone * s;
}

// A band: a light or dark line of the field placed in the streak frame (so it
// follows fan and bend), from bandX0 to bandX1 along with soft ends.
// Band 2 sits at band2C and shares width, wobble and extent.
float band(float x, float c) {
  if (u_band == 0.0 && u_band2 == 0.0) return 0.0;
  float wob = u_bandWobble * gnoise(vec2(x * 0.7 + seedOff().x, 3.3));
  float d1 = (c - u_bandC - wob) / u_bandWidth, d2 = (c - u_band2C + wob) / u_bandWidth;
  return (u_band * exp(-d1 * d1) + u_band2 * exp(-d2 * d2))
       * smoothstep(u_bandX0 - 0.2, u_bandX0 + 0.2, x)
       * (1.0 - smoothstep(u_bandX1 - 0.2, u_bandX1 + 0.2, x));
}

// Petals: one lobe per lane across (petalFreq lanes per unit), running along
// the streak and ending in a rounded tip near petalTip (jittered per lane).
// Flames, tongues, the dabs of a burst.
float petals(float x, float c) {
  if (u_petals == 0.0) return 0.0;
  float v = c * u_petalFreq + seedOff().y;
  float i = floor(v);
  float h1 = hash1(i + 5.3), h2 = hash1(i + 29.1), h3 = hash1(i + 61.7);
  float w = 0.5 * u_petalWidth * (0.6 + 0.8 * h3) / u_petalFreq;
  float d = (fract(v) - 0.5 - 0.25 * (h1 - 0.5)) / u_petalFreq;
  float tip = u_petalTip + u_petalJitter * (h2 - 0.5) * 2.0;
  float e = x - (tip - w);
  float dist = e < 0.0 ? abs(d) : length(vec2(e, d));
  return u_petals * (0.55 + 0.45 * h2) * smoothstep(w, 0.45 * w, dist);
}

// The heroes: up to two long hairlines at chosen offsets across, in long
// segments, or (len > 0) tapered wisps centred at X along. Hero 2 has its own
// X and length when hero2Len > 0, otherwise it shares hero 1's.
float heroLine(float x, float c, float off, float at, float len) {
  float d = c - off, w = u_heroWidth;
  float prof = mix(exp(-d * d / (w * w)), exp(-d * d / (25.0 * w * w)), 0.35);
  float seg = smoothstep(-0.35, 0.05, gnoise(vec2(x * 0.9 + seedOff().y + off * 13.0, 7.3)) + 0.2);
  if (len > 0.0) seg = smoothstep(len, 0.0, abs(x - at));
  return prof * seg;
}
// Returns the shift in the palette coordinate, and in w the heroes' weight
// (for tinting toward heroColor).
float hero(float x, float c, out float w) {
  float h = 0.0;
  w = 0.0;
  if (u_hero != 0.0) {
    float l = heroLine(x, c, u_heroOffset, u_heroX, u_heroLen);
    h += u_hero * l;
    w += abs(u_hero) * l;
  }
  if (u_hero2 != 0.0) {
    bool own = u_hero2Len > 0.0;
    float l = heroLine(x, c, u_hero2Offset, own ? u_hero2X : u_heroX, own ? u_hero2Len : u_heroLen);
    h += u_hero2 * l;
    w += abs(u_hero2) * l;
  }
  return h;
}

// Average along the streamline through (x, c): colour in rgb, palette
// coordinate in a; the accent's average weight in acc.
vec4 streak(float x, float c, out vec2 acc) {
  vec3 cs = vec3(0.0);
  vec2 aacc = vec2(0.0);
  float tacc = 0.0, wsum = 0.0;
  float n = float(max(u_samples, 2) - 1);
  for (int i = 0; i < 64; i++) {
    if (i >= u_samples) break;
    float k = float(i) / n - 0.5;
    // Zoom (radial): the span grows with distance, like a zoom-burst photo,
    // so the core stays the field itself instead of a pinpoint.
    float xi = x + u_length * k * (g_radial ? mix(1.0, x, u_zoom) : 1.0);
    if (g_radial) xi = max(xi, 0.0);
    // Soften: a near-gaussian offset across (three decorrelated low-discrepancy
    // sequences, summed), turning the line average into a 2D blur. Radial
    // offsets are arcs, capped at 60°, so they widen toward the focus and
    // blow out the core.
    float ci = c;
    if (g_soften > 0.0) {
      float fi = float(i);
      float j = fract(fi * 0.6180339 + 0.5) + fract(fi * 0.7548777 + 0.3)
              + fract(fi * 0.5698403 + 0.1) - 1.5;
      // Cone: the spread grows with the offset along, so the sides go soft
      // and the streak keeps its direction.
      float dc = 1.1547 * g_soften * j * mix(1.0, 2.0 * abs(k), u_softenCone);
      ci += g_radial ? clamp(dc / max(xi, 0.04), -1.047, 1.047) : dc;
    }
    // The field drifts under the streaks, along them.
    float xd = xi - 0.04 * u_time;
    vec2 p = at(xd, ci, 1.0);
    vec2 a;
    // Detail can keep (part of) its crispness under soften.
    float cd = mix(c, ci, u_detailSoften);
    float cf = coreFade(xi), hw;
    float ce = clumpEnv(xi, cd);
    float sd = ce * strike(xi, cd, p) + dabs(xi, cd, p);
    float t = field(p, noiseAt(xd, ci), a) + band(xi, ci) + petals(xi, ci)
            + cf * (ce * fibre(xi, cd) * mix(1.0, zoneAt(p), u_fibreZone) + sd
                    + (1.0 - u_heroPost) * hero(xi, cd, hw));
    // Column tilt: each lane across gets its own gradient along the streak
    // (dark tops, light feet, or the reverse).
    if (u_colTilt != 0.0) t += u_colTilt * xi * gnoise(vec2(ci * u_colFreq + seedOff().x, 5.1));
    // Flat middle, tapered ends: reads as a long exposure, not a box.
    float w = 0.25 + 0.75 * smoothstep(0.5, 0.2, abs(k));
    // Tone: the first accent only where the field sits near accentTone, so it
    // tints one side of an edge rather than a blob.
    if (u_accentToneWidth > 0.0) {
      float d = (t - u_accentTone) / u_accentToneWidth;
      a.x *= exp(-d * d);
    }
    if (u_accent2ToneWidth > 0.0) {
      float d = (t - u_accent2Tone) / u_accent2ToneWidth;
      a.y *= exp(-d * d);
    }
    vec3 col = accents(palette(t), a);
    // Lum: brightness after the palette, so a dark or light spot can go past
    // the ramp's ends.
    if (u_lum != 0.0 && u_lumPost < 1.0)
      col *= max(1.0 + (1.0 - u_lumPost) * u_lum * blob(p, vec2(u_lumX, u_lumY), u_lumSize, u_massStretch), 0.0);
    // Mottle: brightness from the field noise, after the palette, so clamped
    // or softened areas keep some life.
    if (u_lumNoise != 0.0) col *= max(1.0 + u_lumNoise * g_f, 0.0);
    if (u_heroTint > 0.0) col = okMix(col, u_heroColor, cf * clamp(hw * u_heroTint, 0.0, 1.0));
    // Strikes and dabs can carry their own colour too.
    if (u_detailTint > 0.0) col = okMix(col, u_detailColor, cf * clamp(abs(sd) * u_detailTint, 0.0, 1.0));
    cs += w * col;
    tacc += w * t;
    aacc += w * a;
    wsum += w;
  }
  acc = aacc / wsum;
  return vec4(cs, tacc) / wsum;
}

vec3 resolve(vec4 s, vec2 a) {
  return max(mix(s.rgb, accents(palette(s.a), a), u_blend), 0.0);
}

vec3 toSrgb(vec3 c) {
  return mix(12.92 * c, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  vec2 px = gl_FragCoord.xy + u_origin;
  vec2 p = (px - 0.5 * u_full) / u_full.y;

  float ca = cos(u_angle), sa = sin(u_angle);
  mat2 fwd = mat2(ca, -sa, sa, ca);   // world -> streak frame
  g_back = mat2(ca, sa, -sa, ca);     // streak frame -> world
  g_radial = u_radial > 0.5;
  g_polar = g_radial && u_polar > 0.5;
  // softenZone > 0 confines the soften to a soft disc.
  g_soften = u_soften;
  if (u_softenZone > 0.0) {
    vec2 sz = p - vec2(u_softenX, u_softenY);
    g_soften *= exp(-dot(sz, sz) / (u_softenZone * u_softenZone));
  }
  g_lp = 0.577 * g_soften * u_scale;
  g_focus = vec2(u_focusX, u_focusY);
  // Radial angles are measured from the direction toward the frame's centre,
  // so the ±π wrap (a hard seam in everything keyed on c) falls behind the
  // focus, off-canvas whenever the focus is.
  vec2 r = dot(g_focus, g_focus) > 1e-8 ? normalize(-g_focus) : vec2(1.0, 0.0);
  g_phi0 = atan(r.y, r.x);

  float x, c;
  if (g_radial) {
    vec2 d = p - g_focus;
    x = length(d);
    c = (atan(r.x * d.y - r.y * d.x, dot(r, d)) - u_bend * x - swirlS(x)) / max(1.0 + u_bendC * x, 0.15);
  } else {
    vec2 s = fwd * p;
    x = s.x;
    c = (s.y - u_bend * x * x - swirlS(x)) / max(1.0 + u_fan * x + u_bendC * x * x, 0.15);
  }

  vec2 am;
  vec4 mid = streak(x, c, am);
  vec3 col;
  if (u_chroma != 0.0) {
    // Three real samples across the streak, a quadratic through them, and
    // five spectral taps along it: blue on one side of an edge, red on the
    // other, the rainbow in between. A negative chroma swaps the sides.
    vec2 al, ah;
    vec4 lo = streak(x, c - u_chroma, al);
    vec4 hi = streak(x, c + u_chroma, ah);
    vec3 spec[5] = vec3[5](
      vec3(0.0, 0.0, 1.0), vec3(0.0, 0.6, 1.0), vec3(0.1, 1.0, 0.1),
      vec3(1.0, 0.7, 0.0), vec3(1.0, 0.0, 0.0));
    vec3 sum = vec3(0.0), wsum = vec3(0.0);
    for (int k = 0; k < 5; k++) {
      float u = float(k) * 0.5 - 1.0;
      vec4 f = mid + 0.5 * u * (hi - lo) + 0.5 * u * u * (hi + lo - 2.0 * mid);
      vec2 fa = am + 0.5 * u * (ah - al) + 0.5 * u * u * (ah + al - 2.0 * am);
      sum += spec[k] * resolve(f, clamp(fa, 0.0, 1.0));
      wsum += spec[k];
    }
    col = sum / wsum;
  } else {
    col = resolve(mid, am);
  }

  if (u_lum != 0.0 && u_lumPost > 0.0) {
    // That share of the light applied after the exposure: a round, unsmeared
    // blob, even in radial mode.
    col *= max(1.0 + u_lumPost * u_lum * blob(p, vec2(u_lumX, u_lumY), u_lumSize, u_massStretch), 0.0);
  }
  if (u_heroPost > 0.0) {
    // Heroes laid over after the exposure, in heroColor: a wisp shorter than
    // the blur stays at full strength instead of being averaged away.
    float hw;
    hero(x, c, hw);
    col = okMix(col, u_heroColor, u_heroPost * coreFade(x) * clamp(hw, 0.0, 1.0));
  }
  if (u_accentPost > 0.0) {
    // Accent laid over after the exposure, unsmeared, at this pixel.
    col = okMix(col, u_accent, u_accentPost * accentShape(p, noiseF(p)));
  }

  col = toSrgb(col);
  // 1-LSB dither so the smooth ramps don't band. Not grain.
  float d = fract(52.9829189 * fract(dot(px, vec2(0.06711056, 0.00583715))));
  col += u_dither * (d - 0.5) / 255.0;
  o = vec4(col, 1.0);
}`
