FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000
ENV SECRET_KEY=""
ENV ISSUER=""
ENV SENDER_EMAIL=""
ENV SENDER_PASS=""
ENV DATABASE_URL=""

RUN npx prisma generate

EXPOSE 3000

CMD npm start
