import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CategoryPage } from "./pages/CategoryPage";
import { ALL_CATEGORIES } from "./constants/categories";
import { Admin } from "./admin/Admin";
import { Login } from "./admin/Login";
import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Visitor Pages with Site Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {ALL_CATEGORIES.map(cat => (
            <Route key={cat.path} path={cat.path} element={<CategoryPage />} />
          ))}
        </Route>

        {/* Admin Pages with Different Layout (Directly added here or using a new AdminLayout) */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
