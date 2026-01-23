# Inventory Management System

A full-featured inventory management web application built with **Next.js 15**, **React 19**, **TypeScript**, **Prisma**, **SQLite**, and **Tailwind CSS**.

## 🚀 Features

### Core Features
- ✅ **Authentication & Authorization** - JWT-based auth with role-based access (Admin, Staff, Viewer)
- ✅ **Inventory Management** - Complete CRUD operations for items with SKU, categories, suppliers
- ✅ **Category & Supplier Management** - Organize items by categories and suppliers
- ✅ **Stock Movement Tracking** - Audit logs for all inventory transactions (IN/OUT/ADJUSTMENT)
- ✅ **Low-Stock Alerts** - Visual indicators and dedicated reports for items below reorder level
- ✅ **Advanced Search & Filters** - Search by name/SKU, filter by category/supplier, pagination
- ✅ **Dashboard with Charts** - Visual analytics using Recharts (category distribution, stock movement)
- ✅ **Barcode & QR Code Generation** - Generate barcodes and QR codes for items
- ✅ **Import/Export** - Bulk import/export items via Excel/CSV files
- ✅ **Dark Mode** - Full dark/light theme support with localStorage persistence
- ✅ **Mobile Responsive** - Works seamlessly on all device sizes
- ✅ **Reports** - Stock value reports, low stock reports, dashboard analytics

### Technical Features
- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** for type safety
- **Prisma ORM** with SQLite (easy to switch to PostgreSQL)
- **JWT Authentication** with httpOnly cookies
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **File upload** support for images
- **RESTful API** design

## 📁 Project Structure

```
inventory-management/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── items/           # Items CRUD + import/export
│   │   ├── categories/      # Categories CRUD
│   │   ├── suppliers/       # Suppliers CRUD
│   │   ├── transactions/    # Stock movements
│   │   └── reports/         # Dashboard & reports
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── items/          # Items list & detail pages
│   │   ├── categories/     # Categories management
│   │   ├── suppliers/      # Suppliers management
│   │   ├── transactions/   # Transaction history
│   │   └── reports/        # Reports page
│   ├── login/              # Login/Register page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
│   └── ThemeProvider.tsx   # Dark mode provider
├── hooks/                  # Custom React hooks
│   └── useAuth.ts         # Authentication hook
├── lib/                    # Utility functions
│   ├── db.ts              # Prisma client
│   └── auth.ts            # JWT utilities
├── prisma/                # Database schema & migrations
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Seed data script
├── public/                # Static files
├── .env.example          # Environment variables template
├── package.json          # Dependencies
└── README.md            # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd inventory-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update if needed (default values work for development):
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   JWT_REFRESH_SECRET="your-refresh-secret"
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed database with sample data**
   ```bash
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 👤 Test Accounts

After seeding the database, use these accounts to login:

| Role   | Email                   | Password  |
|--------|------------------------|-----------|
| Admin  | admin@inventory.com    | admin123  |
| Staff  | staff@inventory.com    | staff123  |
| Viewer | viewer@inventory.com   | viewer123 |

### Role Permissions

- **Admin**: Full access - can manage users, delete items, all CRUD operations
- **Staff**: Can create/update items, categories, suppliers, transactions
- **Viewer**: Read-only access to all data

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "VIEWER"  // Optional: ADMIN, STAFF, VIEWER
}
```

#### POST /api/auth/login
Login with email and password.
```json
{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

#### POST /api/auth/logout
Logout (clears cookies).

#### POST /api/auth/refresh
Refresh access token using refresh token.

#### GET /api/auth/me
Get current authenticated user.

### Items Endpoints

#### GET /api/items
Get paginated list of items with search and filters.

Query Parameters:
- `search` - Search by name or SKU
- `categoryId` - Filter by category
- `supplierId` - Filter by supplier
- `lowStock` - Filter low stock items (true/false)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (asc/desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### POST /api/items
Create new item (Admin/Staff only).
```json
{
  "sku": "ITEM-001",
  "name": "Product Name",
  "description": "Product description",
  "categoryId": "category-id",
  "supplierId": "supplier-id",
  "quantity": 100,
  "reorderLevel": 20,
  "costPrice": 50.00,
  "sellPrice": 75.00,
  "location": "Warehouse A"
}
```

#### GET /api/items/:id
Get single item with details and recent transactions.

#### PUT /api/items/:id
Update item (Admin/Staff only).

#### DELETE /api/items/:id
Delete item (Admin only).

#### GET /api/items/:id/barcode
Generate and download barcode image for item.

#### GET /api/items/:id/qrcode
Generate and download QR code for item.

#### GET /api/items/export
Export all items to Excel file.

#### POST /api/items/import
Import items from Excel/CSV file.
- Form data with `file` field
- Creates new items or updates existing ones by SKU
- Auto-creates categories and suppliers if they don't exist

### Categories Endpoints

#### GET /api/categories
Get all categories with item counts.

#### POST /api/categories
Create new category (Admin/Staff only).
```json
{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

#### PUT /api/categories/:id
Update category (Admin/Staff only).

#### DELETE /api/categories/:id
Delete category (Admin only).

### Suppliers Endpoints

#### GET /api/suppliers
Get all suppliers with item counts.

#### POST /api/suppliers
Create new supplier (Admin/Staff only).
```json
{
  "name": "Supplier Name",
  "contactEmail": "contact@supplier.com",
  "contactPhone": "+1-555-0123",
  "address": "123 Main St"
}
```

#### PUT /api/suppliers/:id
Update supplier (Admin/Staff only).

#### DELETE /api/suppliers/:id
Delete supplier (Admin only).

### Transactions Endpoints

#### GET /api/transactions
Get transaction history.

Query Parameters:
- `itemId` - Filter by specific item

#### POST /api/transactions
Create stock movement transaction (Admin/Staff only).
```json
{
  "itemId": "item-id",
  "change": 10,
  "type": "IN",  // IN, OUT, or ADJUSTMENT
  "reason": "Restocking"
}
```

### Reports Endpoints

#### GET /api/reports/dashboard
Get dashboard overview data with charts.

#### GET /api/reports/low-stock
Get list of items at or below reorder level.

#### GET /api/reports/stock-value
Get total stock value calculation.

## 🧪 Testing

### Run Backend Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Replit

1. Create a new Replit project
2. Upload all files
3. Set environment variables in Replit Secrets:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Run in Replit:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run build
   npm start
   ```

### Deploy to Vercel

```bash
npx vercel
```

Note: For production, consider switching from SQLite to PostgreSQL.

## 📊 Database Schema

### User
- id, name, email, passwordHash, role (ADMIN/STAFF/VIEWER), timestamps

### Category
- id, name, description, timestamps

### Supplier
- id, name, contactEmail, contactPhone, address, timestamps

### Item
- id, sku, name, description
- categoryId, supplierId
- quantity, reorderLevel
- costPrice, sellPrice
- location, barcode, qrCode, imagePath
- timestamps

### Transaction
- id, itemId, userId
- change, type (IN/OUT/ADJUSTMENT)
- reason, balanceAfter
- timestamp

## 🔧 Database Management

### Generate Prisma Client
```bash
npm run db:generate
```

### Create Migration
```bash
npm run db:migrate
```

### Push Schema to Database
```bash
npm run db:push
```

### Open Prisma Studio (Database GUI)
```bash
npm run db:studio
```

### Seed Database
```bash
npm run db:seed
```

## 🎨 Features Walkthrough

### Dashboard
- Overview cards showing total items, low stock count, stock value, categories
- Pie chart for category distribution
- Bar chart for items per category
- Line chart for stock movement over time

### Items Management
- List view with search, filter, pagination
- Add/edit items with image upload
- Generate barcodes and QR codes
- View transaction history per item
- Low stock indicators
- Bulk import from Excel/CSV
- Export all items to Excel

### Categories & Suppliers
- CRUD operations
- View item counts per category/supplier
- Prevent deletion if items are assigned

### Transactions
- Record stock in/out movements
- View transaction history
- Filter by item
- Automatic quantity updates
- Audit trail with user tracking

### Reports
- Dashboard with visualizations
- Low stock report
- Stock value calculation
- Export capabilities

## 🔐 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- SQL injection protection via Prisma

## 🌙 Dark Mode

Click the moon/sun icon in the top right corner to toggle between light and dark themes. The preference is saved in localStorage.

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### Port Already in Use
```bash
# Change port in package.json or use:
PORT=3001 npm run dev
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Support

For issues or questions, please check the code comments or create an issue in the repository.

## 🎉 Happy Inventory Management!
