import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaClock } from "react-icons/fa";

const Appointments = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // Keep loading state
  const [formData, setFormData] = useState({
    clientId: "",
    treatment: "",
    duration: "",
    startTime: "",
    paymentStatus: "Unpaid",
  });
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/clients`);
        setClients(response.data);
        setLoading(false); // Set loading false on success
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Failed to load clients.");
        setLoading(false); // Set loading false on error
      }
    };
    fetchClients();
  }, [API_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/appointments`, formData);
      alert("Appointment booked successfully!");
      setFormData({
        clientId: "",
        treatment: "",
        duration: "",
        startTime: "",
        paymentStatus: "Unpaid",
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">
        Book an Appointment
      </h1>
      <div
        className="bg-black bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl font-belleza"
        data-aos="fade-up"
      >
        {loading ? (
          <p className="text-white text-center">Loading clients...</p> // Use loading
        ) : error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white mb-2">Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Treatment</label>
              <input
                type="text"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-gold text-black py-2 rounded-lg hover:bg-white flex items-center justify-center space-x-2 transition duration-300 font-belleza"
            >
              <FaClock />
              <span>Book Appointment</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Appointments;