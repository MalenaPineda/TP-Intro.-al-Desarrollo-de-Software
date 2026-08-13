
CoLiving — Sistema de Gestión de Convivencia

Trabajo Práctico — Introducción al Desarrollo de Software

CoLiving es una aplicación web full-stack diseñada para facilitar la administración de gastos y tareas domésticas entre convivientes, incluyendo un sistema de ranking e insignias por participación.
Integrantes:

    María Fernanda Toyo
    Malena Aylen Pineda
    María Eugenia Brum
    Jesús David Guerra

Stack Tecnológico
Capa 	Tecnología
Frontend 	HTML5, CSS3 (Bulma), JavaScript Vanilla (ES6+), Chart.js
Backend 	Node.js (v22), Express.js (v5), ES Modules
Base de Datos 	PostgreSQL 18 (pg client)
Infraestructura 	Docker, Docker Compose
Arquitectura del Sistema

┌─────────────────────────────────────────────────────┐
│                     Frontend                        │
│                     :8080                           │
│          HTML + CSS + JavaScript vanilla            |
|                   http-server                       |
│              http-server :8080                       │
│         HTML + CSS + JavaScript vanilla              │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP / fetch() 
                       │ 
                       │ fetch() /api/v1/...
                       │ CORS localhost:8000
                       ▼
┌─────────────────────────────────────────────────────┐
│                   Backend API                        │
│                  Express :8000                       │
│ /api/v1/gastos | /api/v1/tareas | /api/v1/insignias  │
│               Express :8000                          │
│         /api/v1/gastos | /api/v1/tareas              │
└──────────────────────┬──────────────────────────────┘
                       │ pg.Pool
                       │ 
                       │ localhost:5432
                       ▼
┌─────────────────────────────────────────────────────┐
│                 PostgreSQL 18                        │
│                    9 tablas                          │
│              schemas.sql + seeds.sql                 │
│              schemas.sql + seeds.sql                  │
└─────────────────────────────────────────────────────┘

Ejecución Local
Opción 1: Con Docker y Makefile

# 1. Clonar el repositorio
git clone [https://github.com/MalenaPineda/TP-Intro.-al-Desarrollo-de-Software.git](https://github.com/MalenaPineda/TP-Intro.-al-Desarrollo-de-Software.git)
cd TP-Intro.-al-Desarrollo-de-Software

# 2. Configurar variables de entorno
# Copiar el archivo de ejemplo y renombrarlo a .env
cp .env.example .env

# 3. Levantar la aplicación completa o docker compose up -d --build
# 3. Levantar la aplicación completa
make run
Esto iniciará automáticamente:
Frontend en http://localhost:8080
Backend en http://localhost:8000
PostgreSQL en el puerto 5433.
docker compose down: Detiene los contenedores.

    Comandos útiles del Makefile: Para levantar solo el frontend: make run-front Para levantar el backend (junto con la base de datos): make run-back Para levantar toda la aplicación: make run

