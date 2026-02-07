FROM php:8.2-fpm

# System packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        bcmath \
        gd \
        intl \
        zip

# Node.js (agar frontend build bo‘lsa)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy project
COPY . .

# PHP deps (prod-safe)
RUN composer install --no-dev --optimize-autoloader || composer install

# Laravel commands (Render’da env yo‘q payt yiqilmasin)
RUN php artisan key:generate || true
RUN php artisan storage:link || true

# Render PORT
EXPOSE 10000

# IMPORTANT: Render PORT’ni o‘qiydi
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-10000}
