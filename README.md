# BookShop - Simple Full-Stack .NET & React Application

This is a complete, beginner-friendly full-stack application built with ASP.NET Core Web API and React (Vite).

## Tech Stack
- **Backend**: ASP.NET Core 8 Web API
- **Database**: SQLite (configured via Entity Framework Core)
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Communication**: Axios (REST API)

## Project Structure
```
BookShop/
├── Backend/
│   └── BookShopApi/       # .NET Web API project
├── Frontend/
│   └── bookshop-client/   # React + Vite project
└── README.md
```

## Setup Instructions

### 1. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd Backend/BookShopApi
   ```
2. Restore dependencies (if needed):
   ```bash
   dotnet restore
   ```
3. Create the Database using EF Core Migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
   *Note: If `dotnet ef` fails, ensure you have the tool installed: `dotnet tool install --global dotnet-ef`.*

4. Run the API:
   ```bash
   dotnet run
   ```
   The API should start on `http://localhost:5000` (or similar). Check the console output.
   - Swagger UI: `http://localhost:5000/swagger`
   - Data Source: `bookshop.db` file will be created in the folder.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd Frontend/bookshop-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

## API Endpoints
- `GET /api/books`: List all books
- `GET /api/books/{id}`: Get details of a book
- `POST /api/books`: Add a new book
- `PUT /api/books/{id}`: Update a book
- `DELETE /api/books/{id}`: Remove a book

## Troubleshooting
- **CORS Errors**: If the frontend says "Network Error", ensure the Backend is running. The backend is configured to allow requests from `http://localhost:5173`.
- **Database Errors**: If the app crashes on start regarding the database, make sure you ran `dotnet ef database update`.
- **Tailwind Styles Missing**: Ensure you are running the frontend via `npm run dev` which builds the CSS styles.
