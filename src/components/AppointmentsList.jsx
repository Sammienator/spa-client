import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCalendarAlt, FaUser, FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // Toggle for filters visibility
  const [date, setDate] = useState(""); // Not used, but kept for consistency
  const [paymentStatus, setPaymentStatus] = useState(""); // Filter by payment status (Paid, Unpaid, Pending)
  const [clientName, setClientName] = useState(""); // Filter by client name
  const [phoneNumber, setPhoneNumber] = useState(""); // Removed as per request
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    try {
      const params = {};
      if (clientName) params.clientName = clientName; // Filter by client name
      if (paymentStatus) params.paymentStatus = paymentStatus; // Filter by payment status
      console.log("Fetching appointments with params:", params);
      const response = await axios.get("http://localhost:5000/api/appointments", { params });
      console.log("Appointments received:", response.data);
      setAppointments(response.data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      setError("Failed to load appointments. Check server connection or filters.");
      setLoading(false);
    }
  }, [clientName, paymentStatus]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value); // No longer used, but kept for consistency
  };

  const handlePaymentUpdate = async (id, newPaymentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { paymentStatus: newPaymentStatus });
      fetchAppointments(); // Refresh the appointments list after update
    } catch (error) {
      alert("Failed to update payment status: " + error.response?.data?.message || error.message);
    }
  };

  const getRowColor = (paymentStatus, startTime) => {
    const apptDate = new Date(startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (apptDate < today) {
      return "bg-gray-100 hover:bg-gray-200"; // Past bookings in grey
    }
    switch (paymentStatus) {
      case "Paid":
        return "bg-green-100 hover:bg-green-200";
      case "Unpaid":
        return "bg-red-100 hover:bg-red-200";
      default:
        return "bg-yellow-100 hover:bg-yellow-200";
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    fetchAppointments();
    setShowFilters(false); // Hide filters after applying
  };

  useEffect(() => {
    AOS.init({ duration: 700 });
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">Appointments List</h1>

      {/* Show Filters Button */}
      <button
        onClick={toggleFilters}
        className="mb-6 px-6 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-700 transition duration-300 font-belleza"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filters (Hidden by default, shown when toggled) */}
      {showFilters && (
        <div className="w-full max-w-5xl mb-6 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza" data-aos="fade-up">
          <h2 className="text-xl font-semibold mb-4 text-black text-center">Filter Appointments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FaUser className="text-purple-500" />
              <div>
                <label className="block text-black font-semibold">Client Name:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={handleClientNameChange}
                  placeholder="Search by name..."
                  className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-black font-belleza"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaDollarSign className="text-green-500" />
              <div>
                <label className="block text-black font-semibold">Payment Status:</label>
                <select
                  value={paymentStatus}
                  onChange={handlePaymentStatusChange}
                  className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black font-belleza"
                >
                  <option value="">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 w-full sm:w-auto px-6 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition duration-300 font-belleza"
          >
            <FaCalendarAlt />
            <span>Apply Filters</span>
          </button>
        </div>
      )}

      {/* Appointments Table */}
      <div className="w-full max-w-5xl sm:max-w-6xl md:max-w-7xl bg-white bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza" data-aos="fade-up">
        {error ? (
          <p className="text-black text-center">{error}</p>
        ) : loading ? (
          <p className="text-black text-center">Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-black text-center">No appointments found for the selected filters.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Client Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Treatment</th>
                <th className="p-3">Duration (mins)</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className={`${getRowColor(appt.paymentStatus, appt.startTime)} border-b hover:bg-opacity-80`}>
                  <td className="p-3 text-black cursor-pointer" onClick={() => navigate(`/client-history/${appt.clientId._id}`)}>
                    {appt.clientId.name}
                  </td>
                  <td className="p-3 text-black">{appt.clientId.email}</td>
                  <td className="p-3 text-black">{appt.clientId.phone || "N/A"}</td>
                  <td className="p-3 text-black">{appt.treatment}</td>
                  <td className="p-3 text-black">{appt.duration}</td>
                  <td className="p-3 text-black">{new Date(appt.startTime).toLocaleDateString()}</td>
                  <td className="p-3 text-black">{new Date(appt.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="p-3 text-black">{appt.status}</td>
                  <td className="p-3 text-black">
                    <select
                      value={appt.paymentStatus}
                      onChange={(e) => handlePaymentUpdate(appt._id, e.target.value)}
                      className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black font-belleza"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;