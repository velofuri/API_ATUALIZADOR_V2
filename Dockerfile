# Estágio 1: Build
FROM node:20-slim AS build
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
COPY . .

# Agora este comando já resolve o generate e o tsc
RUN npm run build

# Estágio 2: Runner
FROM node:20-slim AS runner
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Cria a pasta para o banco de dados
RUN mkdir -p /app/data /app/files
RUN chown -R node:node /app

USER node

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

RUN npm install --omit=dev

EXPOSE 3000

# O banco de dados persistente viverá em /app/data/dev.db
CMD ["npm", "run", "start"]