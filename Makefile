.PHONY: build up down restart shell node-shell composer-install npm-install build-js test test-php test-js lint format clean

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart: down up

shell:
	docker compose exec app sh

node-shell:
	docker compose exec node sh

composer-install:
	docker compose exec app composer install

npm-install:
	docker compose exec node npm install

build-js:
	docker compose exec node npm run build

test: test-php test-js

test-php:
	docker compose exec app ./vendor/bin/phpunit

test-js:
	docker compose exec node npm run test

lint:
	docker compose exec node npm run lint

format:
	docker compose exec node npm run format

demo:
	docker compose exec app ./vendor/bin/testbench serve --host=0.0.0.0 --port=8000

