FROM node:10.15.0
WORKDIR /api
ADD package.json package-lock.json ./
RUN npm install
ADD . .
RUN npm run frontend:build
CMD [ "node_modules/.bin/pm2-runtime", "api/server.js" ]
EXPOSE 4000
EXPOSE 80
