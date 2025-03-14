FROM node:22.14.0 AS builder
WORKDIR /app
COPY ["package*.json", "tsconfig.json", "tsup.config.ts", "./"]
COPY prisma ./prisma
COPY docs ./docs
COPY src ./src

RUN npm install 
RUN npx prisma generate
RUN npm run docs:generate
RUN npm run build

FROM node:22.14.0-slim
WORKDIR /app

COPY ["package*.json", "./"]
COPY prisma ./prisma

ENV NODE_ENV=prod
ENV APP_PORT=3000
RUN npm install --omit=dev
RUN npx prisma generate
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/swagger.json ./src/swagger.json
USER node
EXPOSE 3000

CMD ["npm", "start"]
