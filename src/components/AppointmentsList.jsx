import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      const sortedAppointments = response.data.sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isPastA = dateA < today;
        const isPastB = dateB < today;
        const isTodayA = dateA.toDateString() === today.toDateString();
        const isTodayB = dateB.toDateString() === today.toDateString();

        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;
        if (!isPastA && !isPastB) return dateA - dateB;
        if (isPastA && isPastB) return dateB - dateA;
        return isPastA ? 1 : -1;
      });
      setAppointments(sortedAppointments);
      setError(null);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    AOS.init({ duration: 700 });
    fetchAppointments();
  }, [fetchAppointments]);

  const handlePaymentUpdate = async (id, newPaymentStatus) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, { paymentStatus: newPaymentStatus });
      fetchAppointments();
    } catch (error) {
      alert("Failed to update payment status: " + (error.response?.data?.message || error.message));
    }
  };

  const getRowColor = (paymentStatus, startTime) => {
    const apptDate = new Date(startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (apptDate < today) {
      return "bg-gray-900 hover:bg-gray-800 text-gray-400"; // Past bookings in a muted gray tone
    }
    switch (paymentStatus) {
      case "Paid":
        return "bg-white hover:bg-gray-100 text-black"; // Clean white for paid
      case "Unpaid":
        return "bg-black hover:bg-gray-900 text-white"; // Black for unpaid with white text
      case "Pending":
        return "bg-[#FFD700] hover:bg-[#E5B80B] text-black"; // Gold for pending
      default:
        return "bg-white hover:bg-gray-100 text-black"; // Default white
    }
  };

  const isPastBooking = (startTime) => {
    const apptDate = new Date(startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return apptDate < today;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative z-10 font-belleza">
      <h1
        className="text-4xl font-bold mb-8 text-center text-[#FFD700] tracking-wide font-belleza"
        data-aos="fade-down"
      >
        Appointments List
      </h1>
      <div
        className="w-full max-w-6xl bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-2xl font-belleza overflow-x-auto border border-gray-700"
        data-aos="fade-up"
      >
        {loading ? (
          <p className="text-[#FFD700] text-center text-lg font-belleza">Loading appointments...</p>
        ) : error ? (
          <p className="text-red-400 text-center text-lg font-belleza">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-[#FFD700] text-center text-lg font-belleza">No appointments found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#FFD700] border-b border-gray-600">
                <th className="p-4 text-lg font-semibold font-belleza">Client Name</th>
                <th className="p-4 text-lg font-semibold font-belleza">Phone</th>
                <th className="p-4 text-lg font-semibold font-belleza">Date</th>
                <th className="p-4 text-lg font-semibold font-belleza">Time</th>
                <th className="p-4 text-lg font-semibold font-belleza">Treatment</th>
                <th className="p-4 text-lg font-semibold font-belleza">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt._id}
                  className={`${getRowColor(appt.paymentStatus, appt.startTime)} border-b border-gray-200 transition-colors duration-300`}
                >
                  <td
                    className="p-4 cursor-pointer hover:text-[#FFD700] transition-colors duration-200 font-belleza"
                    onClick={() => navigate(`/client-history/${appt.clientId._id}`)}
                  >
                    {appt.clientId.name}
                  </td>
                  <td className="p-4 font-belleza">{appt.clientId.phone || "N/A"}</td>
                  <td className="p-4 font-belleza">{new Date(appt.startTime).toLocaleDateString()}</td>
                  <td className="p-4 font-belleza">
                    {new Date(appt.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-4 font-belleza">{appt.treatment}</td>
                  <td className="p-4 font-belleza">
                    {isPastBooking(appt.startTime) ? (
                      <span className="p-2 font-medium font-belleza">{appt.paymentStatus}</span>
                    ) : (
                      <select
                        value={appt.paymentStatus}
                        onChange={(e) => handlePaymentUpdate(appt._id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all duration-200 font-belleza"
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                      </select>
                    )}
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
