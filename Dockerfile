# Estágio 1: Build
FROM node:22-slim AS build
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Runner
FROM node:22-slim AS runner
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

RUN mkdir -p /app/data /app/files /app/node_modules

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/package*.json ./
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=node:node /app/prisma ./prisma

RUN chown -R node:node /app

USER node

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]