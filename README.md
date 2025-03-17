# Education Connection Backend

## 1. Description
This project, 'education-connection', is a backend service designed to help teachers perform administrative functions for their students. It's built using the NestJS framework, offering robust API endpoints for clients.

## 2. Features
- Teacher can register students.
- Teacher can retrieve a list of students common to a given list of teachers.
- Teacher can suspend a specified student.
- Teacher can retrieve a list of students who can receive a given notification.

## 3. Tech Stack
This project is built using a robust tech stack for optimal performance and scalability:

- **Backend Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Testing**: Jest
- **Code Formatting and Linting**: ESLint, Prettier

## 4. Server setup guide
### 4.1. Prerequisites
- Node.js v18.19.0
- Docker
- Postman

### 4.2. Installation
To install the project, follow these steps:

```bash
git clone https://github.com/FUnmthank02/education-be
cd education-be
```

### 4.3. Environment setup

To run this project, you will need to set up the following environment variables. You can do this by creating a `.env` file in folder `education-be`.
```plaintext
# MySQL Database
#===
MYSQL_PORT_EXPOSE=3307
MYSQL_ROOT_PASSWORD=Root@123
MYSQL_USER=admin
MYSQL_PASSWORD=Admin@123
MYSQL_DATABASE=education_connection

# Server
#===
SERVER_PORT=8080
DB_HOST_MYSQL=mysql-db
DB_PORT_MYSQL=3306
DB_USERNAME_MYSQL=admin
DB_PASSWORD_MYSQL=Admin@123
DB_NAME_MYSQL=education_connection
DB_LOGGING=DISABLED
```

### 4.4. Run docker compose
At folder `education-be`, to build, start and run services:
```bash
docker-compose up
```

### 4.5. Seeding

After the server is successfully up and running, you can proceed with running the seeding process.
```
docker exec -it education-connection-api npm run seed:run
```

### 4.6. Import Postman collection
Import the content of [Postman File](./education-be.postman_collection.json) to Postman following guide.
![Import postman guide](./images/import-postman-guide.png)


### 4.7. Call the first api
Call the first api to get response.
![Test the first api](./images/test-first-api.png)

## 5. Other commands

### 5.1. Database Migrations
To run migrations:
```bash
npm run migration:run
```

### 5.2. Seeding
To run for seeding:
```bash
npm run seed:run
```
### 5.3. Start application in development mode
```bash
npm run start
```
### 5.4. Build application for production
```bash
npm run build
```

### 5.5. Run test
To run tests:
```bash
npm run test
```

### 5.6. Running and checking coverage
```bash
npm run test:cov
```

## 6. Note
- Following the requirement, I didn't create the API for registering a specific teacher or a specific student. Please run the seeding first to generate data. 
- Attach the postman file: [Postman File](./education-connection.postman_collection.json)