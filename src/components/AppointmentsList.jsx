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
      // Sort appointments: today first, then future, then past
      const sortedAppointments = response.data.sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isPastA = dateA < today;
        const isPastB = dateB < today;
        const isTodayA = dateA.toDateString() === today.toDateString();
        const isTodayB = dateB.toDateString() === today.toDateString();

        // Today’s bookings first
        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;
        // Future bookings next (earliest first)
        if (!isPastA && !isPastB) return dateA - dateB;
        // Past bookings last (most recent first)
        if (isPastA && isPastB) return dateB - dateA;
        // Past vs non-past
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
      return "bg-gray-800 hover:bg-gray-700 text-white"; // Past bookings
    }
    switch (paymentStatus) {
      case "Paid":
        return "bg-[#00FF00] hover:bg-[#00CC00] text-black"; // Green
      case "Unpaid":
        return "bg-[#FFCCCC] hover:bg-[#FF9999] text-black"; // Light Red
      case "Pending":
        return "bg-[#FFFF00] hover:bg-[#CCCC00] text-black"; // Yellow
      default:
        return "bg-white hover:bg-[#E5B80B] text-black"; // Default with gold hover
    }
  };

  const isPastBooking = (startTime) => {
    const apptDate = new Date(startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return apptDate < today;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[#E5B80B] relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">
        Appointments List
      </h1>
      <div
        className="w-full max-w-5xl sm:max-w-6xl md:max-w-7xl bg-black bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza overflow-x-auto"
        data-aos="fade-up"
      >
        {loading ? (
          <p className="text-[#E5B80B] text-center">Loading appointments...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : appointments.length === 0 ? (
          <p className="text-[#E5B80B] text-center">No appointments found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#E5B80B]">
                <th className="p-3">Client Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Treatment</th>
                <th className="p-3">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt._id}
                  className={`${getRowColor(appt.paymentStatus, appt.startTime)} border-b`}
                >
                  <td
                    className="p-3 cursor-pointer hover:underline"
                    onClick={() => navigate(`/client-history/${appt.clientId._id}`)}
                  >
                    {appt.clientId.name}
                  </td>
                  <td className="p-3">{appt.clientId.phone || "N/A"}</td>
                  <td className="p-3">{new Date(appt.startTime).toLocaleDateString()}</td>
                  <td className="p-3">
                    {new Date(appt.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3">{appt.treatment}</td>
                  <td className="p-3">
                    {isPastBooking(appt.startTime) ? (
                      <span className="p-2">{appt.paymentStatus}</span>
                    ) : (
                      <select
                        value={appt.paymentStatus}
                        onChange={(e) => handlePaymentUpdate(appt._id, e.target.value)}
                        className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#E5B80B] font-belleza"
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