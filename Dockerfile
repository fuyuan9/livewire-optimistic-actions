FROM php:8.3-cli-alpine

# docker-php-extension-installer を使って PHP 拡張をインストール
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions \
    bcmath \
    curl \
    dom \
    intl \
    mbstring \
    pcntl \
    pdo_mysql \
    pdo_sqlite \
    sqlite3 \
    xml \
    zip \
    xdebug

# Composer のインストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 開発用ディレクトリの設定
WORKDIR /var/www/html

# 開発用ユーザーの設定（パーミッション競合防止）
RUN addgroup -g 1000 -S developer && \
    adduser -u 1000 -S developer -G developer

USER developer
