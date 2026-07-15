FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL=__VITE_API_URL__
ARG GIT_SHA=unknown
RUN VITE_API_URL=$VITE_API_URL GIT_SHA=$GIT_SHA bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["bun", "x", "serve", "dist", "-l", "8080", "--no-clipboard", "--single"]
