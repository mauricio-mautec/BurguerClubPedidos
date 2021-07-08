FROM node as base

WORKDIR '/app'

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx

COPY --from=base /app/build /usr/share/nginx/html
