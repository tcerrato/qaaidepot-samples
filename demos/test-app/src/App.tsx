import { Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Form from "./pages/Form";
import Upload from "./pages/Upload";
import Iframe from "./pages/Iframe";
import Error from "./pages/Error";
import "./App.css";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app">
      {!isLoginPage && (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
          <div className="nav-container">
            <h1 className="nav-title">Test App</h1>
            <ul className="nav-links">
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/form">Form</Link>
              </li>
              <li>
                <Link to="/upload">Upload</Link>
              </li>
              <li>
                <Link to="/iframe">Iframe</Link>
              </li>
              <li>
                <Link to="/error">Error</Link>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <main className="main-content" role="main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/form" element={<Form />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/iframe" element={<Iframe />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

