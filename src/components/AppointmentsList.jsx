import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaFilter } from "react-icons/fa";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    clientName: "",
    paymentStatus: "",
    treatment: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const fetchAppointments = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${API_URL}/appointments`, { params: filters });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false); // Stop loading
    }
  }, [API_URL, filters]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchAppointments();
  }, [fetchAppointments]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const getRowColor = (paymentStatus, startTime) => {
    const apptDate = new Date(startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (apptDate < today) {
      return "bg-gray-800 hover:bg-gray-700 text-white";
    }
    switch (paymentStatus) {
      case "Paid":
        return "bg-gold hover:bg-white text-black";
      case "Unpaid":
        return "bg-black hover:bg-gray-800 text-white";
      default:
        return "bg-white hover:bg-gold text-black";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">
        Appointments List
      </h1>
      <button
        onClick={toggleFilters}
        className="mb-6 px-6 py-2 bg-gold text-black rounded-lg hover:bg-white transition duration-300 font-belleza flex items-center space-x-2"
        data-aos="fade-up"
      >
        <FaFilter />
        <span>Toggle Filters</span>
      </button>
      {showFilters && (
        <div
          className="bg-black bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md mb-6 font-belleza"
          data-aos="fade-up"
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-white mb-2">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={filters.clientName}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Payment Status</label>
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Treatment</label>
            <input
              type="text"
              name="treatment"
              value={filters.treatment}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>
      )}
      <div
        className="w-full max-w-4xl sm:max-w-5xl md:max-w-6xl bg-black bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza"
        data-aos="fade-up"
      >
        {loading ? (
          <p className="text-white text-center">Loading appointments...</p> // Show loading
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : appointments.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="text-gold">
                <th className="p-2">Client</th>
                <th className="p-2">Treatment</th>
                <th className="p-2">Date & Time</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt._id}
                  className={`${getRowColor(appt.paymentStatus, appt.startTime)} transition duration-300`}
                >
                  <td className="p-2">{appt.clientId.name}</td>
                  <td className="p-2">{appt.treatment}</td>
                  <td className="p-2">{new Date(appt.startTime).toLocaleString()}</td>
                  <td className="p-2">{appt.duration} mins</td>
                  <td className="p-2">{appt.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-white text-center">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;