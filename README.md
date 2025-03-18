# Education Backend

## 1. Description
This project, 'education-be', is a backend service designed to help teachers perform administrative functions for their students. It's built using the NestJS framework, offering robust API endpoints for clients.

## 2. Features
- Teacher can register students.
- Teacher can retrieve a list of students common to a given list of teachers.
- Teacher can suspend a specified student.
- Teacher can retrieve a list of students who can receive a given notification.

## 3. Tech Stack
This project is built using a robust tech stack for optimal performance and scalability:

- **Backend Framework**: NestJS
- **Database**: MySQL with Prisma
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
DATABASE_URL="mysql://root:root@mysql:3306/education_db"
PORT=8888
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=education_db
MYSQL_USER=admin
MYSQL_PASSWORD=admin
```

### 4.4. Run docker compose
At folder `education-be`, to build, start and run services:
```bash
docker-compose up --build
```

### 4.5. Import Postman collection
Import the content of [Postman File](./education-be.postman_collection.json) to Postman following guide.
![Import postman guide](./images/import-postman-guide.png)

## 5. Other commands

### 5.0. Database Migrations
To run generate prisma:
```bash
npm run generate
```

### 5.1. Database Migrations
To run migrations:
```bash
npm run migrate
```

### 5.2. Seeding
To run for seeding:
```bash
npm run seed
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
- Attach the postman file: [Postman File](./education-be.postman_collection.json)