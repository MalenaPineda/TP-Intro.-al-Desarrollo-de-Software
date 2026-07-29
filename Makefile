run-front:
	mkdir -p ./data
	cd app/src/frontend && npx http-server -p 8080

run-back:
	docker compose up -d
<<<<<<< HEAD

=======
	
>>>>>>> release
run: run-back run-front