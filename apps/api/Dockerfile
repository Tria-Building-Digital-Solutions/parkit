FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx -w api prisma generate && \
    npm run build -w api

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/tsconfig.prod.json ./apps/api/tsconfig.prod.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

USER nodejs

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "-r", "tsconfig-paths/register", "apps/api/dist/server.js"]
