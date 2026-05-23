#!/bin/sh
set -e

for var in $(env | grep -o '^VITE_[^=]*'); do
  placeholder="__${var}__"
  value=$(printenv "$var")
  if [ -n "$value" ]; then
    escaped_value=$(printf '%s\n' "$value" | sed -e 's/[&|\\]/\\&/g')
    find /app/dist -type f \( -name '*.js' -o -name '*.html' -o -name '*.css' \) \
      -exec sed -i "s|${placeholder}|${escaped_value}|g" {} +
  fi
done

exec "$@"
