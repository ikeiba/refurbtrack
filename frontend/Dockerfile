# ETAPA 1: Base y Dependencias
FROM node:20-alpine AS base

# Instalamos dependencias del sistema y pnpm
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Instalamos dependencias según el gestor disponible
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else echo "❌ No lockfile found" && exit 1; \
    fi

# ETAPA 2: Construcción
FROM base AS builder
WORKDIR /app

# Copiamos node_modules y código fuente
COPY --from=base /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build (opcionales)
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Desactivamos telemetría y construimos
ENV NEXT_TELEMETRY_DISABLED=1
RUN if [ -f pnpm-lock.yaml ]; then pnpm run build; \
    else npm run build; \
    fi

# ETAPA 3: Producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

# Configuración de entorno
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# Usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiamos archivos estáticos públicos
COPY --from=builder /app/public ./public

# Copiamos build standalone (servidor optimizado)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Healthcheck para contenedores
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://127.0.0.1:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]