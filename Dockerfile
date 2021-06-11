FROM alpine
LABEL version="2021.06.10"
RUN apk add --update nodejs nodejs-npm
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
