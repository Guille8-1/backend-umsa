FROM node:22

WORKDIR /app

COPY . .

RUN npm install

#script para iniciar

CMD ["npm", "run", "start:dev"]

