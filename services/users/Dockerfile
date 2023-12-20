FROM node:20.10.0-alpine3.19 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build-production

FROM node:20.10.0-alpine3.19 as production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
