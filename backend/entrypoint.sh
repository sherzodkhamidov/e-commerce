#!/bin/bash
set -e

# Setup .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Install Composer dependencies if vendor doesn't exist
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install
fi

# Install NPM dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing NPM dependencies..."
    npm install
fi

# Generate App Key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    echo "Generating Application Key..."
    php artisan key:generate
fi

# Run Migrations with retry logic
echo "Running Migrations..."
max_retries=30
count=0
until php artisan migrate --force; do
    count=$((count + 1))
    if [ $count -ge $max_retries ]; then
        echo "Migration failed after $max_retries attempts. Exiting."
        exit 1
    fi
    echo "Migration failed, retrying in 2 seconds... (Attempt $count/$max_retries)"
    sleep 2
done

# Execute the CMD
exec "$@"
