import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import About from './pages/About.tsx';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import WorkPrograms from './pages/WorkPrograms';
import TaskDetail from './pages/TaskDetail';
import Home from './pages/Home.tsx';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="ml-56 mt-16 p-6 w-full bg-gray-100 min-h-screen overflow-y-auto">
         
          <Routes>
            <Route path="/About" element={<About/>} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Progress" element={<Progress/>} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/Tasks" element={<Tasks />} />
            <Route path="/TaskDetail" element={<TaskDetail />} />
            <Route path="/WorkPrograms" element={<WorkPrograms/>} />
            <Route path="/Home" element={<Home/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;




 
  
