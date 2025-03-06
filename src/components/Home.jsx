import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserPlus, FaClock, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS with 1-second duration, animate once
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black relative z-10">
      {/* Centered Title */}
      <h1 className="text-4xl font-bold mb-8 text-center" data-aos="fade-up">
        Welcome to SpaSync
      </h1>

      {/* Action Icons with Links */}
      <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8" data-aos="fade-up" data-aos-delay="300">
        <Link to="/add-client" className="flex flex-col items-center text-center text-lg hover:text-gray-600 transition-colors">
          <FaUserPlus className="text-4xl mb-2" />
          <span>Add Client</span>
        </Link>
        <Link to="/appointments" className="flex flex-col items-center text-center text-lg hover:text-gray-600 transition-colors">
          <FaClock className="text-4xl mb-2" />
          <span>Make Appointment</span>
        </Link>
        <Link to="/appointments-list" className="flex flex-col items-center text-center text-lg hover:text-gray-600 transition-colors">
          <FaEye className="text-4xl mb-2" />
          <span>View Appointments</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;