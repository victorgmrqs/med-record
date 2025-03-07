# Etapa de build
FROM node:22.14.0 AS builder
WORKDIR /app
COPY ["package*.json","tsconfig.json", "tsup.config.ts","./"]

COPY src ./src
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# ENV NODE_ENV=prod
# ENV APP_PORT='3000'
RUN npm install
RUN npm run build
# RUN npm run doc:generate-build

# Etapa de produção
FROM node:22.14.0-slim
WORKDIR /app

# COPY --from=builder /app/package*.json ./
COPY ["package*.json","./"]
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0


# ENV NODE_ENV=prod
# ENV APP_PORT='3000'
RUN npm install
COPY --from=builder /app/build ./build

USER node

EXPOSE 3000

CMD ["npm", "start"]
