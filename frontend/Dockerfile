FROM node:18.17.0

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

ARG DEBUG=false


CMD [ "sh", "-c", "if [ \"$DEBUG\" = 'true' ]; then npm start; else npm run build; fi" ]
