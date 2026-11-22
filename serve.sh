#!/bin/sh
# Service workers and "Add to Home Screen" require http(s), not a file:// URL.
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "FA Hub is at http://127.0.0.1:${PORT}/"
echo "Open that address on this computer, or on your phone if it can reach this machine."
exec python3 -m http.server "$PORT" --bind 127.0.0.1
