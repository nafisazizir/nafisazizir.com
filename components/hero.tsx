"use client";

import { GradientShader } from "@/components/shaders/gradient-shader";

export function Hero() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-background">
      <GradientShader className="absolute inset-0" />
    </section>
  );
}
