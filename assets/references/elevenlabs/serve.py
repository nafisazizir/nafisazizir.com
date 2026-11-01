"""Serve this reference library and persist gallery picks to picks.json.

    python3 -I serve.py   ->  http://127.0.0.1:8411
"""
import http.server, json, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
PICKS = ROOT / "picks.json"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def do_PUT(self):
        if self.path != "/picks.json":
            return self.send_error(404)
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        try:
            json.loads(body)
        except ValueError:
            return self.send_error(400, "not json")
        tmp = PICKS.with_suffix(".tmp")
        tmp.write_bytes(body)
        os.replace(tmp, PICKS)
        self.send_response(204)
        self.end_headers()

    def log_message(self, fmt, *args):
        if self.command == "PUT":
            super().log_message(fmt, *args)


if __name__ == "__main__":
    print("references → http://127.0.0.1:8411")
    http.server.ThreadingHTTPServer(("127.0.0.1", 8411), Handler).serve_forever()
