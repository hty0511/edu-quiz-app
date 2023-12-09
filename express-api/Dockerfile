FROM node:18-slim

LABEL maintainer="devonchoucs@gmail.com"

ARG NODE_ENV=production

WORKDIR /app

COPY package.json .

RUN if [ "${NODE_ENV}" = "development" ]; then npm install; else npm install --only=production; fi

COPY . .

RUN useradd -m nodeuser && \
    chown -R nodeuser:nodeuser /app && \
    chmod -R 755 /app

VOLUME ["/app/public/static"]

USER nodeuser

EXPOSE 3000

CMD [ "node", "src/index.js" ]
