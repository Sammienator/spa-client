import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa"; // Add icons for delete/edit

const ClientHistory = () => {
  const { clientId } = useParams();
  const [clientHistory, setClientHistory] = useState([]);
  const [client, setClient] = useState(null); // Store client data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConcern, setNewConcern] = useState(""); // For adding new concern
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const fetchClientHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/client/${clientId}`);
      setClientHistory(response.data);
      // Assuming the first appointment has the populated client data
      if (response.data.length > 0) {
        setClient(response.data[0].clientId); // Extract client info
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching client history:", error);
      setError("Failed to load client history. Check server connection.");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">Client History</h1>
      <div className="w-full max-w-4xl sm:max-w-5xl md:max-w-6xl bg-black bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza" data-aos="fade-up">
        {error ? (
          <p className="text-white text-center">{error}</p>
        ) : loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <>
            {/* Client Info Section */}
            {client && (
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
                      className="bg-gold text-black p-2 rounded hover:bg-white flex items-center space-x-1"
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
                      className="bg-gold text-black p-2 rounded hover:bg-white flex items-center space-x-1"
                    >
                      <FaEdit />
                      <span>Add</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
            {/* History Section */}
            {clientHistory.length > 0 ? (
              <ul className="list-disc pl-5 text-white">
                {clientHistory.map((history) => (
                  <li key={history._id} className="mb-2">
                    {new Date(history.startTime).toLocaleString()} - {history.treatment} ({history.duration} mins) - 
                    Status: {history.status || "N/A"}, Payment: {history.paymentStatus}
                  </li>
                ))}
              </ul>
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