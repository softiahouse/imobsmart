FROM node:20-alpine

# Dependências nativas para better-sqlite3 e Baileys
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# Instalar dependências primeiro (cache de layers)
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY src/ ./src/

# Criar directórios de dados persistentes
RUN mkdir -p /app/data/whatsapp

# Porta exposta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

# Arranque
CMD ["node", "src/index.js"]
