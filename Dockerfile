FROM node:16-alpine3.15
WORKDIR /front
COPY . .
RUN npm install
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "4000"]