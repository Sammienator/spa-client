import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-black font-belleza">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">SpaSync</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <Link to="/add-client" className="hover:text-gray-600 transition-colors">Add Client</Link>
          <Link to="/appointments" className="hover:text-gray-600 transition-colors">Make Appointment</Link>
          <Link to="/appointments-list" className="hover:text-gray-600 transition-colors">View Appointments</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;