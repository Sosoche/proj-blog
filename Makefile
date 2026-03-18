.PHONY: start stop build logs restart clean

start:
	docker compose up -d

stop:
	docker compose down

build:
	docker compose build

restart:
	docker compose down && docker compose up -d

logs:
	docker compose logs -f

clean:
	docker compose down -v --rmi all --remove-orphans
