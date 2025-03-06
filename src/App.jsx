import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import AddClient from "./components/AddClient";
import Appointments from "./components/Appointments";
import AppointmentsList from "./components/AppointmentsList";
import ClientHistory from "./components/ClientHistory"; // New component
import Navbar from "./components/Navbar";

const BackgroundWrapper = ({ children }) => {
  const location = useLocation();
  const backgrounds = {
    "/": "/images/spa1.jpg", // Home
    "/add-client": "/images/spa2.jpg", // Add Client
    "/appointments": "/images/spa3.jpg", // Appointments
    "/appointments-list": "/images/spa4.jpg", // Appointments List
    "/client-history/:clientId": "/images/spa5.jpg", // Client History (using the same image as Home for consistency, or use a new one)
  };

  const backgroundImage = backgrounds[location.pathname] || "/images/spa1.jpg";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative font-belleza" // Apply font-belleza here as a fallback
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="relative z-10">
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Belleza&display=swap');`}
        </style>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <BackgroundWrapper>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-client" element={<AddClient />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments-list" element={<AppointmentsList />} />
          <Route path="/client-history/:clientId" element={<ClientHistory />} /> {/* New route */}
        </Routes>
      </BackgroundWrapper>
    </Router>
  );
};

export default App;