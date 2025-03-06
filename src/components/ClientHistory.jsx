import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { useParams, useNavigate } from "react-router-dom";

const ClientHistory = () => {
  const { clientId } = useParams();
  const [clientHistory, setClientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  const fetchClientHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/client/${clientId}`);
      setClientHistory(response.data);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">Client History</h1>
      <div className="w-full max-w-4xl sm:max-w-5xl md:max-w-6xl bg-white bg-opacity-90 p-6 rounded-lg shadow-lg font-belleza" data-aos="fade-up">
        {error ? (
          <p className="text-black text-center">{error}</p>
        ) : loading ? (
          <p className="text-black text-center">Loading...</p>
        ) : clientHistory.length > 0 ? (
          <ul className="list-disc pl-5">
            {clientHistory.map((history) => (
              <li key={history._id} className="mb-2">
                {new Date(history.startTime).toLocaleString()} - {history.treatment} ({history.duration} mins) - Status: {history.status || "N/A"}, Payment: {history.paymentStatus}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-black text-center">No data to display.</p>
        )}
        <button
          onClick={handleBack}
          className="mt-4 w-full sm:w-auto px-6 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-700 transition duration-300 font-belleza"
        >
          Back to Appointment List
        </button>
      </div>
    </div>
  );
};

export default ClientHistory;