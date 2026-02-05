# BookShop -  Full-Stack E-commerce Platform

This is a comprehensive, production-ready full-stack e-commerce application built with ASP.NET Core Web API and React (Vite), featuring user authentication, shopping cart, order management, and secure payment processing.

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT-based authentication
- **ORM**: Entity Framework Core 8
- **API Documentation**: Swagger/Swashbuckle
- **Security**: BCrypt password hashing

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Features
- **User Management**: Registration, login, profile management
- **Product Catalog**: Browse, search, and filter books
- **Shopping Cart**: Add, remove, and update items
- **Order Processing**: Complete checkout flow
- **Payment Methods**: Cash on delivery, card payments, bank transfers
- **File Uploads**: Payment slip upload for bank transfers

## Project Structure
```
BookShop/
├── Backend/
│   └── BookShopApi/           # .NET Web API project
│       ├── Controllers/       # API controllers (Auth, Books, Cart, Orders)
│       ├── Data/              # Database context and seed data
│       ├── Migrations/        # EF Core migration files
│       ├── Models/            # Data models and DTOs
│       ├── Services/          # Business logic services
│       ├── BookShopApi.csproj # Project configuration
│       ├── Program.cs         # Startup configuration
│       └── appsettings.json   # Application settings
├── Frontend/
│   └── bookshop-client/       # React + Vite project
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── context/       # Global state contexts
│       │   ├── pages/         # Page components
│       │   ├── api.js         # API client configuration
│       │   ├── App.jsx        # Main application component
│       │   └── main.jsx       # Application entry point
│       ├── public/
│       ├── package.json
│       └── vite.config.js
├── .gitignore
└── README.md
```

## Features Overview

### Authentication System
- Secure JWT-based authentication
- User registration with validation
- Login/logout functionality
- Protected routes and API endpoints
- Profile management

### Shopping Experience
- Browse products with filtering and search
- Add/remove items from shopping cart
- Real-time cart updates
- Product details view

### Order Management
- Complete checkout process
- Multiple payment methods (COD, Card, Bank Transfer)
- Order history tracking
- Payment slip upload for bank transfers

### Admin Capabilities
- Product management (CRUD operations)
- Order status management
- Customer information access

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

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate user and return JWT token
- `GET /api/auth/profile`: Get authenticated user profile
- `PUT /api/auth/profile`: Update user profile

### Books
- `GET /api/books`: List all books
- `GET /api/books/{id}`: Get details of a book
- `POST /api/books`: Add a new book (Admin only)
- `PUT /api/books/{id}`: Update a book (Admin only)
- `DELETE /api/books/{id}`: Remove a book (Admin only)

### Cart
- `GET /api/cart`: Get user's cart
- `POST /api/cart/items`: Add item to cart
- `PUT /api/cart/items/{id}`: Update cart item quantity
- `DELETE /api/cart/items/{id}`: Remove item from cart

### Orders
- `GET /api/orders`: Get user's order history
- `GET /api/orders/{id}`: Get specific order details
- `POST /api/orders/checkout`: Process checkout and create order
- `POST /api/orders/upload-slip`: Upload payment slip for bank transfers

### Additional Endpoints
- Swagger UI: `http://localhost:5000/swagger` - Interactive API documentation

## Development Workflow

### Running the Application
1. **Start Backend**: Navigate to `/Backend/BookShopApi` and run `dotnet run`
2. **Start Frontend**: In a new terminal, navigate to `/Frontend/bookshop-client` and run `npm run dev`
3. **Access Application**: Open `http://localhost:5173` in your browser
4. **API Documentation**: Access Swagger UI at `http://localhost:5000/swagger`

### Database Management
- **Migrations**: Use `dotnet ef migrations add [Name]` to create new migrations
- **Update Database**: Use `dotnet ef database update` to apply migrations
- **Seeding**: Sample data is automatically seeded on application startup

### File Upload Handling
- **Payment Slips**: Uploaded files are stored in `wwwroot/uploads/slips/`
- **File Naming**: Files are renamed with GUIDs to prevent conflicts
- **Storage**: Files are stored locally (in production, consider cloud storage)

## Troubleshooting

### Common Backend Issues
- **CORS Errors**: Ensure backend is running and configured to allow `http://localhost:5173`
- **Database Errors**: Verify you've run `dotnet ef database update`
- **Migration Issues**: If getting migration errors, try deleting the `__EFMigrationsHistory` table and re-running updates
- **Authentication Failures**: Check that JWT token is properly set in frontend requests

### Common Frontend Issues
- **Tailwind Styles Missing**: Run `npm run dev` to ensure Tailwind CSS is compiled
- **API Connection Issues**: Verify backend is running on `http://localhost:5000`
- **JWT Token Expiry**: Log out and log back in to refresh your token
- **File Upload Failures**: Check that payment slip files are under size limits

### Database and File Management
- **Uploaded Files**: Images in `wwwroot/uploads/` are excluded from Git (see `.gitignore`)
- **Database Location**: SQLite database is stored as `bookshop.db` in the backend directory
- **Data Persistence**: Database changes persist between application restarts

### Performance Tips
- **Hot Reload**: Both frontend and backend support hot reloading during development
- **Caching**: Consider implementing caching for improved performance
- **Optimization**: Optimize images before uploading to reduce load times

## Security Considerations

### Authentication & Authorization
- JWT tokens are used for secure session management
- Passwords are securely hashed using BCrypt
- All sensitive endpoints are protected with authorization
- Token expiration helps mitigate security risks

### File Upload Security
- Uploaded files are stored in a separate directory
- File names are randomized using GUIDs to prevent enumeration
- File type validation should be implemented in production
- Size limits prevent large file attacks

### Data Protection
- Personal data is stored securely in the database
- Sensitive information like payment details are handled appropriately
- Database connections are secured

## Contributing

We welcome contributions to improve this project! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new functionality
- Document any significant changes

## Deployment

### Production Deployment
1. Update connection strings for production database
2. Configure environment variables for production
3. Set up SSL certificates for secure connections
4. Configure reverse proxy (nginx/Apache) if needed
5. Set up automated backups for the database

### Cloud Deployment Options
- Azure App Service with Azure SQL Database
- AWS Elastic Beanstalk with RDS
- Google Cloud Run with Cloud SQL
- Docker containers for microservices deployment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
