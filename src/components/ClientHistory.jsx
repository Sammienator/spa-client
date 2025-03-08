import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";

const ClientHistory = () => {
  const { clientId } = useParams();
  const [clientHistory, setClientHistory] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConcern, setNewConcern] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const fetchClientHistory = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch client details
      const clientResponse = await axios.get(`${API_URL}/clients/${clientId}`);
      setClient(clientResponse.data);

      // Fetch appointments for this client
      const apptResponse = await axios.get(`${API_URL}/appointments`, {
        params: { clientId },
      });
      setClientHistory(apptResponse.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching client history:", error.response?.data || error.message);
      setError("Failed to load client history. Check server connection or client ID.");
    } finally {
      setLoading(false);
    }
  }, [clientId, API_URL]);

  useEffect(() => {
    AOS.init({ duration: 700 });
    fetchClientHistory();
  }, [fetchClientHistory]);

  const handleBack = () => {
    navigate("/appointments-list");
  };

  const handleDeleteConcern = async () => {
    try {
      await axios.put(`${API_URL}/clients/${clientId}`, { areasOfConcern: "" });
      setClient({ ...client, areasOfConcern: "" });
      alert("Areas of Concern deleted.");
    } catch (error) {
      alert("Failed to delete: " + error.response?.data?.message || error.message);
    }
  };

  const handleAddConcern = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/clients/${clientId}`, { areasOfConcern: newConcern });
      setClient({ ...client, areasOfConcern: newConcern });
      setNewConcern("");
      alert("Areas of Concern updated.");
    } catch (error) {
      alert("Failed to update: " + error.response?.data?.message || error.message);
    }
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
        return "bg-white hover:bg-gold text-black"; // Pending or unspecified
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">
        Client History
      </h1>
      <div
        className="w-full max-w-4xl sm:max-w-5xl md:max-w-6xl bg-black bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza"
        data-aos="fade-up"
      >
        {loading ? (
          <p className="text-white text-center">Loading client history...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : !client ? (
          <p className="text-white text-center">Client not found.</p>
        ) : (
          <>
            {/* Client Info Section */}
            <div className="mb-6">
              <h2 className="text-xl text-gold font-semibold">Client: {client.name}</h2>
              <p className="text-white">Email: {client.email}</p>
              <p className="text-white">Phone: {client.phone || "N/A"}</p>
              <div className="mt-2">
                <h3 className="text-lg text-gold font-semibold">Areas of Concern:</h3>
                <p className="text-white">{client.areasOfConcern || "None specified"}</p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleDeleteConcern}
                    className="bg-gold text-black p-2 rounded hover:bg-white flex items-center space-x-1 transition duration-300"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
                <form onSubmit={handleAddConcern} className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    value={newConcern}
                    onChange={(e) => setNewConcern(e.target.value)}
                    placeholder="Add new concern..."
                    className="p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    className="bg-gold text-black p-2 rounded hover:bg-white flex items-center space-x-1 transition duration-300"
                  >
                    <FaEdit />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
            {/* History Section */}
            {clientHistory.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gold">
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Treatment</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientHistory.map((history) => (
                    <tr
                      key={history._id}
                      className={`${getRowColor(history.paymentStatus, history.startTime)} border-b`}
                    >
                      <td className="p-3">{new Date(history.startTime).toLocaleDateString()}</td>
                      <td className="p-3">
                        {new Date(history.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-3">{history.treatment}</td>
                      <td className="p-3">{history.duration} mins</td>
                      <td className="p-3">{history.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-white text-center">No appointment history to display.</p>
            )}
            <button
              onClick={handleBack}
              className="mt-4 w-full sm:w-auto px-6 py-2 bg-gold text-black rounded-lg hover:bg-white transition duration-300 font-belleza"
            >
              Back to Appointment List
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientHistory;