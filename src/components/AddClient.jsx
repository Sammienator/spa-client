import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserPlus } from "react-icons/fa";

const AddClient = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", areasOfConcern: "" });
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:10000";

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/clients`, formData);
      alert("Client added successfully!");
      navigate("/appointments");
    } catch (error) {
      const message = error.response?.status === 400 && error.response?.data?.message === "Email already exists"
        ? "Email already exists. Please use a different email."
        : "Failed to add client: " + (error.response?.data?.message || error.message);
      alert(message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <h1 className="text-3xl font-bold mb-6 text-center font-belleza" data-aos="fade-down">
        Add New Client
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-black bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl font-belleza"
        data-aos="fade-up"
      >
        <label className="block mt-2 text-white font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <label className="block mt-2 text-white font-semibold">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <label className="block mt-2 text-white font-semibold">Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <label className="block mt-2 text-white font-semibold">Areas of Concern:</label>
        <textarea
          name="areasOfConcern"
          value={formData.areasOfConcern}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-gold"
          rows="3"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-gold text-black py-2 rounded-lg hover:bg-white flex items-center justify-center space-x-2 transition duration-300 font-belleza"
        >
          <FaUserPlus />
          <span>Add Client</span>
        </button>
      </form>
    </div>
  );
};

export default AddClient;