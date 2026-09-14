import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import CustomerGallery from "./pages/CustomerGallery";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/team"
          element={<TeamDashboard />}
        />

        <Route
          path="/gallery/:shareToken"
          element={<CustomerGallery />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;