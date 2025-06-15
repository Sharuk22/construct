import React from 'react';
import bgImage from '../assets/bg.jpg';

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm brightness-75"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="relative z-10 max-w-5xl text-white text-center p-6">
          <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Purpose</h2>
          <p className="text-lg font-medium">
            This module is designed to plan and monitor construction projects effectively by managing work programs, scheduling tasks, associating BOQ items with tasks, and recording daily progress. It ensures the project execution aligns with planned schedules and tracks actual vs. planned progress.
          </p>
        </section>

        <footer className="mt-32 text-sm text-gray-300">
          © 2025 Planning and Monitoring System.
        </footer>
      </div>
    </div>
  );
};

export default About;
