FROM node as frontend

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build



FROM nginx

WORKDIR /usr/share/nginx/html

COPY --from=frontend /app/build ./

EXPOSE 80 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]