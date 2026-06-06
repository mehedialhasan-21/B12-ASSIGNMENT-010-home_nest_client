// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import AllProperties from "./pages/AllProperties";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import UpdateProperty from "./pages/UpdateProperty";
import MyRatings from "./pages/MyRatings";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/properties" element={<Layout><AllProperties /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        {/* Protected routes */}
        <Route
          path="/properties/:id"
          element={<Layout><PrivateRoute><PropertyDetails /></PrivateRoute></Layout>}
        />
        <Route
          path="/add-property"
          element={<Layout><PrivateRoute><AddProperty /></PrivateRoute></Layout>}
        />
        <Route
          path="/my-properties"
          element={<Layout><PrivateRoute><MyProperties /></PrivateRoute></Layout>}
        />
        <Route
          path="/update-property/:id"
          element={<Layout><PrivateRoute><UpdateProperty /></PrivateRoute></Layout>}
        />
        <Route
          path="/my-ratings"
          element={<Layout><PrivateRoute><MyRatings /></PrivateRoute></Layout>}
        />
        <Route
          path="/edit-profile"
          element={<Layout><PrivateRoute><EditProfile /></PrivateRoute></Layout>}
        />

        {/* 404 — no navbar/footer */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
