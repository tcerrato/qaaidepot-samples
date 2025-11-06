import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

// In-memory data store
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  createdAt: string;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    description: "High-performance laptop",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mouse",
    price: 29.99,
    category: "Electronics",
    description: "Wireless mouse",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Keyboard",
    price: 79.99,
    category: "Electronics",
    description: "Mechanical keyboard",
    createdAt: new Date().toISOString(),
  },
];

let products: Product[] = [...defaultProducts];

// Auth endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Validation errors
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  // Success
  if (username === "admin" && password === "password123") {
    return res.json({ token: "mock-jwt-token", user: { username, role: "admin" } });
  }

  // Invalid credentials
  return res.status(401).json({ error: "Invalid username or password" });
});

// Products CRUD
app.get("/api/products", (req, res) => {
  const { page = "1", limit = "10", sort = "name", order = "asc", category, search } = req.query;

  let filtered = [...products];

  // Filter by category
  if (category && typeof category === "string") {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Search
  if (search && typeof search === "string") {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const aVal = a[sort as keyof Product];
    const bVal = b[sort as keyof Product];
    if (order === "desc") {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  });

  // Paginate
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  res.json({
    data: filtered.slice(start, end),
    total: filtered.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(filtered.length / limitNum),
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { name, price, category, description } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: "Name, price, and category are required" });
  }

  const newProduct: Product = {
    id: Date.now().toString(),
    name,
    price: parseFloat(price),
    category,
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { name, price, category, description } = req.body;
  products[index] = {
    ...products[index],
    ...(name && { name }),
    ...(price !== undefined && { price: parseFloat(price) }),
    ...(category && { category }),
    ...(description !== undefined && { description }),
  };

  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  products.splice(index, 1);
  res.json({ message: "Product deleted" });
});

app.post("/api/products/reset", (req, res) => {
  products = defaultProducts.map((p) => ({
    ...p,
    createdAt: new Date().toISOString(),
  }));
  res.json({ message: "Products reset to default", products });
});

// File upload
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.originalname,
    size: req.file.size,
  });
});

// Error endpoint
app.get("/api/error", (req, res) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: "This is a test error endpoint for AI testing",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

