import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaClock } from "react-icons/fa";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    clientId: "",
    treatment: "",
    duration: "",
    startTime: "",
    paymentStatus: "Unpaid",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const treatments = ["Hot Stone Massage", "Deep Tissue Massage", "Aromatherapy Massage", "Facial"];
  const durations = [30, 60, 90, 120];

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/clients`, { params: { search: searchQuery } });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    }
  }, [searchQuery, API_URL]);

  const fetchAppointments = useCallback(async () => {
    try {
      const start = new Date(selectedDate).setHours(0, 0, 0, 0);
      const end = new Date(selectedDate).setHours(23, 59, 59, 999);
      const response = await axios.get(`${API_URL}/appointments`, {
        params: { startDate: new Date(start).toISOString(), endDate: new Date(end).toISOString() },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, API_URL]);

  useEffect(() => {
    AOS.init({ duration: 700 });
    fetchClients();
    fetchAppointments();
  }, [selectedDate, fetchClients, fetchAppointments]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const checkTimeConflict = async () => {
    const startTime = new Date(`${selectedDate}T${formData.startTime}:00`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + parseInt(formData.duration) * 60000).toISOString();

    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        params: {
          startDate: `${selectedDate}T00:00:00`,
          endDate: `${selectedDate}T23:59:59`,
        },
      });
      const existingAppointments = response.data;

      const conflict = existingAppointments.find((appt) => {
        const apptStart = new Date(appt.startTime).toISOString();
        const apptEnd = new Date(new Date(apptStart).getTime() + appt.duration * 60000).toISOString();
        return startTime < apptEnd && endTime > apptStart && appt.status !== "Cancelled";
      });

      return !!conflict;
    } catch (error) {
      console.error("Error checking time conflict:", error);
      return true; // Assume conflict on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasConflict = await checkTimeConflict();
    if (hasConflict) {
      alert("This time slot is unavailable due to an existing appointment.");
      return;
    }

    try {
      const startTime = new Date(`${selectedDate}T${formData.startTime}:00`).toISOString();
      await axios.post(`${API_URL}/appointments`, {
        clientId: formData.clientId,
        treatment: formData.treatment,
        duration: parseInt(formData.duration),
        startTime,
        paymentStatus: formData.paymentStatus,
      });
      alert("Appointment booked!");
      fetchAppointments();
      setFormData({ clientId: "", treatment: "", duration: "", startTime: "", paymentStatus: "Unpaid" });
    } catch (error) {
      alert("Failed to book: " + error.response?.data?.message || error.message);
    }
  };

  const workingHours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  const getAvailableTimeSlots = () => {
    const bookedSlots = new Set();
    appointments.forEach((appt) => {
      const start = new Date(appt.startTime);
      const time = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`;
      bookedSlots.add(time);
    });

    return workingHours.filter((time) => !bookedSlots.has(time));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <h1 className="text-3xl font-bold mb-4 text-center font-belleza" data-aos="fade-down">
        Spa Appointments
      </h1>
      <div className="mb-6 w-full max-w-md sm:max-w-lg md:max-w-xl font-belleza" data-aos="fade-up">
        <label className="block text-white font-semibold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
        />
      </div>
      <h2 className="text-xl mb-6 text-center font-belleza" data-aos="fade-up">
        {new Date(selectedDate).toLocaleDateString()}
      </h2>
      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-black bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl font-belleza"
          data-aos="fade-up"
        >
          <label className="block mt-2 text-white font-semibold">Search Client:</label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
          />
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
          <label className="block mt-2 text-white font-semibold">Treatment:</label>
          <select
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
          >
            <option value="">Select Treatment</option>
            {treatments.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <label className="block mt-2 text-white font-semibold">Duration (mins):</label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
          >
            <option value="">Select Duration</option>
            {durations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <label className="block mt-2 text-white font-semibold">Start Time:</label>
          <select
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
          >
            <option value="">Select Time</option>
            {getAvailableTimeSlots().map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <label className="block mt-2 text-white font-semibold">Payment Status:</label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold font-belleza"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
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
  );
};

export default Appointments;