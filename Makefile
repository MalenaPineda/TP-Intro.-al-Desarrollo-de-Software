run-front:
	cd app/src/frontend && npx http-server -p 8080

run-back:
	docker compose up -d

run: run-back run-front