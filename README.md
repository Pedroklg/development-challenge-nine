# Development Challenge Nine

This project is a full-stack web application with a Vite-based frontend using React, Material UI, and TypeScript, and an Express-based backend with Node.js,and postgreSQL. The application is containerized using Docker and Docker Compose.

## Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Clone the Repository

`git clone https://github.com/Pedroklg/development-challenge-nine.git`

`cd development-challenge-nine`

### Build and Run with Docker Compose
To build and run the application using Docker Compose, execute the following command in the root of the project:

`docker-compose up --build`

### This will build and start the following services:

backend: The Express server running on port 5000

frontend: The Vite server running on port 4173

db: The PostgreSQL database server running on port 5432


### Accessing the Application

Frontend: Open your browser and go to http://localhost:4173

Backend: The API is accessible at http://localhost:5000

### Stopping the Application
To stop the Docker containers, run:

`docker-compose down`

To remove volumes as well:

`docker-compose down -v`

## Without docker and docker compose

 You can run each aplication separately without docker, for this, create a .env file on the \backend for your postgres db url, start the db, for `\frontend`,first install dependencies with `npm install`, build the project with `npm run build` and then run it with `npm run preview`, for `\backend` first install dependencies with `npm install`, and then start the application with `npm start`

### How it looks: 
![design](https://github.com/user-attachments/assets/979cdded-59fc-41e4-8f6f-401e00db17f2)
