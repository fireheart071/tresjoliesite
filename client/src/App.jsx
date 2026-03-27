import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Clothing } from "./pages/Clothing";
import { Jewelery } from "./pages/Jewelery";
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
          <Route path="/clothing" element={<Clothing />} />
          <Route path="/jewelery" element={<Jewelery />} />
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
