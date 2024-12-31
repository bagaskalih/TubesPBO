# Survey Application

A comprehensive survey management system built with Spring Boot and React that allows creating, managing, and analyzing surveys. Made for the Object-Oriented Programming course at Telkom University.

## Contributors

- Bagas Kalih Putra (1303220149)
- Farell Kresnanda (1303220118)
- ⁠Muhammad Zikra Fadly (1303223073)
- ⁠Ragil Deantika Rohmaniar (1303223052)

## Technologies Used

### Backend

- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL 8.0
- Lombok
- JWT Authentication

### Frontend

- React 18 with TypeScript
- Material UI 5
- Recharts for analytics
- Axios for API calls
- React Router v6

## Features

### Admin Features

- Create, edit and delete surveys
- Set survey duration
- View survey responses
- User management
- Analytics dashboard
- Category management

### User Features

- Take surveys
- View survey history
- Track completion status
- View rankings
- Personal dashboard

## Project Structure

### Backend
```
survey-backend/
├── src/main/java/com/kelompok2/survey_backend/
│ ├── config/
│ ├── controllers/
│ ├── dto/
│ ├── exceptions/
│ ├── mapper/
│ ├── model/
│ ├── repositories/
│ └── services/
```
### Frontend
```
survey-frontend/
├── src/
│ ├── api/
│ ├── components/
│ │ ├── admin/
│ │ ├── auth/
│ │ ├── common/
│ │ ├── user/
│ │ └── Layout/
│ ├── context/
│ ├── types/
```
## Getting Started

1. Database Setup

```sql
CREATE DATABASE survey;
```

2. Backend

```bash
cd survey-backend
./mvnw spring-boot:run
```

3. Frontend

```bash
cd survey-frontend
npm install
npm run dev
```

## API Documentation

Default base URL: `http://localhost:8081/api`

### Authentication

- POST `/auth/register` - Register
- POST `/auth/login` - Login

### Surveys

- GET `/surveys` - List surveys
- POST `/surveys` - Create survey
- GET `/surveys/{id}` - Get survey
- PUT `/surveys/{id}` - Update survey
- DELETE `/surveys/{id}` - Delete survey

### Survey Responses

- POST `/surveys/{id}/submit` - Submit response
- GET `/surveys/responses/user/{id}` - Get user responses

### Analytics

- GET `/analytics/rankings` - Get rankings
- GET `/analytics/categories` - Get category stats
- GET `/analytics/surveys/{id}/stats` - Get survey stats
