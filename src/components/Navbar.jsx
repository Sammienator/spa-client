import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gold p-4 text-black font-belleza fixed top-0 w-full z-20 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-white transition-colors">
          Shunem Therapy
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/add-client" className="hover:text-white transition-colors">
            Add Client
          </Link>
          <Link to="/appointments" className="hover:text-white transition-colors">
            Make Appointment
          </Link>
          <Link to="/appointments-list" className="hover:text-white transition-colors">
            View Appointments
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;