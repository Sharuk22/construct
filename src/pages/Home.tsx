import aImage from '../assets/bg.jpg';
export default function Home() {
  return (
    <div>
       
    <div className="relative h-screen w-full overflow-hidden">
    <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${aImage})` }}
      />
       <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <h1 className="text-5xl font-bold mb-4 gap-6 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"> Construction Planning & Monitoring </h1>
        <p className="text-lg mb-8 text-center max-w-2xl hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
          Welcome to the Construction Planning and Monitoring system. Create and manage work programs, schedule
          tasks, associate BOQ items, and track daily progress to ensure your construction projects
          succeed.
        </p>
        
      </div>
    </div>
  
    </div>
  )
}
