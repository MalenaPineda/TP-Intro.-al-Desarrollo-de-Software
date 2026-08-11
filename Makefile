run-front:
	docker compose up -d frontend

run-back:
<<<<<<< HEAD
	docker compose up -d
<<<<<<< HEAD

=======
	
>>>>>>> release
run: run-back run-front
=======
	docker compose up -d convivencia-api db

run:
	docker compose up --build
>>>>>>> development
