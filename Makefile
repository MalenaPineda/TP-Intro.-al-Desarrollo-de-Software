run-front:
	mkdir -p ./data
	cd app/src/frontend && npx http-server -p 8080

run-back:
	cd app/src/backend && docker compose up -d

run: run-back run-front