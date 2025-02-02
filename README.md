# NestJS Job Offers API

This is a **NestJS** backend application that fetches job offers from multiple APIs, transforms the data, stores it in a **PostgreSQL** database using **Prisma ORM**, and provides an API for retrieval and filtering.

## 🚀 Getting Started

### **1. Prerequisites**
Ensure you have the following installed:
- **Node.js** (v16 or later)
- **npm** or **yarn**
- **Docker** (for PostgreSQL database, optional but recommended)

### **2. Clone the Repository**
```sh
git clone https://github.com/your-repository/nestjs-job-offers.git
cd nestjs-job-offers
```

### **3. Install Dependencies**
```sh
npm install
```

### **4. Set Up Environment Variables**
Create a `.env` file in the project root and configure your database connection:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/job_offers
PORT=3000
CRON_EXPRESSION=* * * * * # Runs every minute
```

### **5. Start the Database** (If using Docker)
```sh
docker-compose up -d
```

### **6. Apply Database Migrations**
```sh
npx prisma migrate dev --name init
```

### **7. Start the Application**
```sh
npm run start
```
The API will be available at: **[http://localhost:3000](http://localhost:3000)**

### **8. Open API Documentation (Swagger)**
```sh
http://localhost:3000/api/docs
```

## 🛠 Running Tests

### **Unit & Integration Tests**
```sh
npm run test
```

### **Watch Mode (Auto-rerun on changes)**
```sh
npm run test:watch
```

### **Test Coverage Report**
```sh
npm run test:cov
```

## 📊 Monitoring the Database
You can view and interact with your database using **Prisma Studio**:
```sh
npx prisma studio
```

## 📜 API Endpoints
### **1. Fetch Job Offers**
- **Endpoint:** `GET /api/job-offers`
- **Filters:** `title, city, state, minSalary, maxSalary, page, limit`
- **Example:**
```sh
curl "http://localhost:3000/api/job-offers?title=Backend&page=1&limit=5"
```

## 🛠 Technologies Used
- **NestJS** - Backend framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Axios** - API fetching
- **Swagger** - API documentation
- **Jest** - Testing framework

---

### 🤝 Contributing
Feel free to fork the repository and submit pull requests!

### 📜 License
MIT License. See `LICENSE` file for details.

