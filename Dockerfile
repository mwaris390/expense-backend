FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000
ENV SECRET_KEY="gtl6837"
ENV ISSUER="waris"
ENV SENDER_EMAIL="m.waris390@gmail.com"
ENV SENDER_PASS="ygks feyo jpxk qzac"
ENV DATABASE_URL="postgresql://postgres.bhmvpcabgbupwvptfwzb:waris390@tech@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

RUN npx prisma generate

EXPOSE 3000

CMD npm start
