# Test App - AI Demo Target Application

A React + Vite web application with an Express API backend, designed as a target application for AI testing demos. This app includes various UI scenarios and patterns that AI agents can interact with.

## Features

### Frontend (React + Vite)
- **Login Page** (`/login`) - Form validation, error handling, success states
- **Products CRUD** (`/products`) - Full CRUD operations with filter, sort, and pagination
- **Complex Form** (`/form`) - Radio buttons, checkboxes, selects, date picker, async validation
- **File Upload** (`/upload`) - File input with server-side validation
- **Iframe Demo** (`/iframe`) - Embedded iframe content for testing iframe interactions
- **Error Page** (`/error`) - 500 error endpoint for testing error assertions

### Backend (Express API)
- RESTful API on port 3001
- Products CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE /api/products`)
- Login endpoint with validation (`POST /api/login`)
- File upload endpoint (`POST /api/upload`)
- Error endpoint (`GET /api/error`)

## Setup

1. Install dependencies (from root):
   ```bash
   pnpm install
   ```

2. No environment variables needed - the app runs with default settings.

## Running

### Development Mode

From the root directory:
```bash
pnpm --filter @qaai-demos/test-app dev
```

Or from this directory:
```bash
pnpm dev
```

This starts both:
- Frontend: http://localhost:3002
- Backend API: http://localhost:3003

### Production Build

```bash
pnpm build
pnpm start
```

## Test Credentials

**Login:**
- Username: `admin`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/login` - Login with username/password

### Products
- `GET /api/products` - List products (supports `page`, `limit`, `sort`, `order`, `category`, `search` query params)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Other
- `POST /api/upload` - Upload file
- `GET /api/error` - Returns 500 error
- `GET /api/health` - Health check

## Test Scenarios Included

1. **Auth/Login** - Validation errors, success states, invalid credentials
2. **CRUD List** - Filter, sort, pagination, add, edit, delete with confirmation dialog
3. **Form Complexity** - Radio buttons, checkboxes, selects, date picker, async email validation
4. **File Uploads** - File input with server validation
5. **Dialog/Toast** - Confirmation dialog on delete, toast on form submit
6. **Iframe** - Embedded iframe content for testing iframe interactions
7. **Error States** - 500 error page with error message assertions
8. **Accessibility** - Proper ARIA labels, roles, and semantic HTML

## Project Structure

```
test-app/
├── src/
│   ├── pages/          # React page components
│   │   ├── Login.tsx
│   │   ├── Products.tsx
│   │   ├── Form.tsx
│   │   ├── Upload.tsx
│   │   ├── Iframe.tsx
│   │   └── Error.tsx
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── server/
│   └── index.ts        # Express API server
├── public/
│   └── iframe-content.html  # Content for iframe demo
└── package.json
```

## Usage for AI Testing

This app is designed to be a target for AI testing agents. AI agents can:

- Test login flows with various validation scenarios
- Perform CRUD operations on products
- Fill out complex forms with various input types
- Upload files and verify responses
- Interact with dialogs and toasts
- Test iframe interactions
- Assert on error messages and states
- Test accessibility features

The app includes proper ARIA labels and semantic HTML to make it easier for AI agents to interact with elements.

