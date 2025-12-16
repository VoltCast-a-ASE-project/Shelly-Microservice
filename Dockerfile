FROM node:20-alpine AS build

WORKDIR /app

RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  sqlite

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run swagger

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app ./

EXPOSE 8083

CMD ["node", "service.js"]