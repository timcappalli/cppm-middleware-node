FROM alpine
LABEL version="2021.02.15"
RUN apk add --update nodejs nodejs-npm
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
