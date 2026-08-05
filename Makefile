run-front:
	docker compose up -d frontend

run-back:
	docker compose up -d convivencia-api db

run:
	docker compose up --build