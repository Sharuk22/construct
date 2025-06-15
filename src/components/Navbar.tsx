import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle } from 'react-icons/fa'; 

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black shadow-md flex items-center justify-between px-6 z-50">
      
      <div className="flex items-center">
        <div className="text-2xl font-bold text-blue-500 hover:text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
          PROJECT PLAN & MONITOR
        </div>
      </div>

   
      <div className="hidden md:flex gap-6 text-blue-500 font-bold">
        <Link
          to="/Home"
          className="flex items-center gap-2 hover:text-white transition-all duration-300 transform hover:scale-110"
        >
          <FaHome /> HOME
        </Link>
        <Link
          to="/About"
          className="flex items-center gap-2 hover:text-white transition-all duration-300 transform hover:scale-110"
        >
          <FaInfoCircle /> ABOUT
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
