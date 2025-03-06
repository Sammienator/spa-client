import { useState, useEffect } from "react"; // Import useEffect along with useState
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserPlus } from "react-icons/fa";

const AddClient = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", areasOfConcern: "" });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/clients", formData);
      alert("Client added successfully!");
      navigate("/appointments");
    } catch (error) {
      alert("Failed to add client: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center" data-aos="fade-down">Add New Client</h1>
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl" data-aos="fade-up">
        <label className="block mt-2 text-black font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <label className="block mt-2 text-black font-semibold">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <label className="block mt-2 text-black font-semibold">Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
        />
        <label className="block mt-2 text-black font-semibold">Areas of Concern:</label>
        <textarea
          name="areasOfConcern"
          value={formData.areasOfConcern}
          onChange={handleChange}
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          rows="3"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-green-500 text-black py-2 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 transition duration-300"
        >
          <FaUserPlus />
          <span>Add Client</span>
        </button>
      </form>
    </div>
  );
};

export default AddClient;