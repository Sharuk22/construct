import { FaTasks } from 'react-icons/fa';
import { HiOutlineDocumentReport, HiOutlineClipboardList } from 'react-icons/hi';
import { MdTrendingUp, MdWorkOutline } from 'react-icons/md';
import { LuLayoutDashboard } from 'react-icons/lu'; 
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 w-56 h-screen bg-black shadow-lg flex flex-col items-center py-6 px-4 z-40">
      <motion.div
        className="w-20 h-20 mt-16 mb-10"
        whileHover={{
          scale: 1.15,
          rotate: 10,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
        }}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-full h-full object-contain drop-shadow-md cursor-pointer"
        />
      </motion.div>

     
      <nav className="flex flex-col gap-6 font-bold text-blue-500 w-full">
        <Link
          to="/Dashboard"
          className="flex items-center gap-3 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <LuLayoutDashboard /> Dashboard
        </Link>
        <Link
          to="/WorkPrograms"
          className="flex items-center gap-3 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <MdWorkOutline /> Work Programs
        </Link>
        <Link
          to="/Tasks"
          className="flex items-center gap-3 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <FaTasks /> Tasks
        </Link>
        <Link
          to="/TaskDetail"
          className="flex items-center gap-3 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <HiOutlineClipboardList /> Task Details
        </Link>
        <Link
          to="/Progress"
          className="flex items-center gap-3 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <MdTrendingUp /> Daily Progress
        </Link>
        <Link
          to="/Reports"
          className="flex items-center gap-3 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <HiOutlineDocumentReport /> Reports
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
