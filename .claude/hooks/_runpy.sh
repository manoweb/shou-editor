#!/usr/bin/env bash
# Wrapper cross-platform: ejecuta un script Python con el primer interprete
# Python 3 disponible (python3, python, o py). Pasa stdin/argumentos tal cual.
#
# Uso: bash _runpy.sh /ruta/script.py [args...]
SCRIPT="$1"
shift
# Probar cada comando con --version para descartar stubs (ej: el alias de Microsoft
# Store en Windows que pretende ser python3 pero solo abre la tienda).
for cmd in python3 python py; do
    if command -v "$cmd" >/dev/null 2>&1 && "$cmd" --version >/dev/null 2>&1; then
        exec "$cmd" "$SCRIPT" "$@"
    fi
done
echo "ERROR: no se encontro Python ejecutable (probado: python3, python, py)" >&2
# Exit 0 para no romper la sesion Claude si los hooks no pueden ejecutar
exit 0
