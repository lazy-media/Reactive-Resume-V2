# syntax=docker/dockerfile:1

# ---------- Dependencies Layer ----------
FROM node:24-slim AS dependencies

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir -p /tmp/dev /tmp/prod

COPY package.json pnpm-lock.yaml /tmp/dev/
COPY package.json pnpm-lock.yaml /tmp/prod/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    cd /tmp/dev && pnpm install --frozen-lockfile

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    cd /tmp/prod && pnpm install --frozen-lockfile --prod

# ---------- Builder Layer ----------
FROM node:24-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=dependencies /tmp/dev/node_modules ./node_modules
COPY . .

RUN pnpm run build

# ---------- Runtime Layer ----------
FROM node:24-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/migrations ./migrations
COPY --from=dependencies /tmp/prod/node_modules ./node_modules

EXPOSE 3000/tcp

ENTRYPOINT ["node", "-r", "reflect-metadata", ".output/server/index.mjs"]
