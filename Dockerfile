FROM node:16-alpine3.15
WORKDIR /front
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]