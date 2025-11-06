import { useState, useEffect } from "react";
import "./Products.css";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  createdAt: string;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  const categories = ["Electronics", "Clothing", "Food", "Books"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sort: sortBy,
        order: sortOrder,
        ...(categoryFilter && { category: categoryFilter }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.data);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, sortOrder, categoryFilter, search]);

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
        setShowDialog(false);
        setProductToDelete(null);
      }
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({ name: "", price: "", category: "", description: "" });
        fetchProducts();
      }
    } catch (err) {
      setError("Failed to add product");
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch("/api/products/reset", {
        method: "POST",
      });

      if (response.ok) {
        fetchProducts();
        setShowResetDialog(false);
      }
    } catch (err) {
      setError("Failed to reset products");
    }
  };

  return (
    <div className="products-container" role="main">
      <div className="products-header">
        <h1>Products</h1>
        <div className="header-actions">
          <button
            className="reset-button"
            onClick={() => setShowResetDialog(true)}
            aria-label="Reset to default products"
          >
            🔄 Reset Data
          </button>
          <button
            className="add-button"
            onClick={() => setShowAddForm(true)}
            aria-label="Add new product"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="filters" role="search">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
          aria-label="Search products"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="filter-select"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field as keyof Product);
            setSortOrder(order as "asc" | "desc");
            setPage(1);
          }}
          className="sort-select"
          aria-label="Sort products"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low-High)</option>
          <option value="price-desc">Price (High-Low)</option>
          <option value="category-asc">Category (A-Z)</option>
        </select>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-grid" role="list">
            {products.map((product) => (
              <div key={product.id} className="product-card" role="listitem">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-description">{product.description}</p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                  aria-label={`Delete ${product.name}`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="pagination" role="navigation" aria-label="Pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showDialog && (
        <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <div className="dialog">
            <h2 id="dialog-title">Confirm Delete</h2>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button onClick={() => setShowDialog(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-button">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="add-dialog-title">
          <div className="dialog">
            <h2 id="add-dialog-title">Add New Product</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="dialog-actions">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="confirm-button">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetDialog && (
        <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title">
          <div className="dialog">
            <h2 id="reset-dialog-title">Reset Products</h2>
            <p>Are you sure you want to reset all products to the default set? This will remove all custom products and restore the original 3 products.</p>
            <div className="dialog-actions">
              <button onClick={() => setShowResetDialog(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleReset} className="confirm-button">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;

