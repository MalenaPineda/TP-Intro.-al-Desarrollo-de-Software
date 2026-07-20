run-front:
	cd app/src/frontend && npx http-server -p 8080

run-back:
<<<<<<< HEAD
	docker compose up -d
=======
	cd app/src/backend && docker compose up -d
>>>>>>> d822528838800fe9fefae368d9468efe047300a0

run: run-back run-front