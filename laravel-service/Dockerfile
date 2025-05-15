FROM composer:2.7 as build
WORKDIR /app
COPY . .
RUN composer install

FROM php:8.2-apache
COPY --from=build /app /var/www/html
RUN docker-php-ext-install pdo pdo_mysql
EXPOSE 8000
