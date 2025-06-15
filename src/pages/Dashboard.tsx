import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const [taskLabels, setTaskLabels] = useState<string[]>([]);
  const [plannedData, setPlannedData] = useState<number[]>([]);
  const [actualData, setActualData] = useState<number[]>([]);

  const [dateLabels, setDateLabels] = useState<string[]>([]);
  const [dailyProgress, setDailyProgress] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/cerpschema/task/task_details/boq_items/work_program')
      .then((res) => {
        const data = res.data;
        setTaskLabels(data.map((item: any) => item.task_name.length > 20 ? item.task_name.slice(0, 20) + '...' : item.task_name));
        setPlannedData(data.map((item: any) => item.planned_progress));
        setActualData(data.map((item: any) => item.actual_progress));
      })
      .catch((err) => {
        console.error('Error fetching task progress:', err);
      });
  }, []);

    useEffect(() => {
    axios
      .get('http://localhost:3000/api/cerpschema/daily_progress_monitoring/progress_by_date')
      .then((res) => {
        const data = res.data;
        setDateLabels(data.map((item: any) => item.date));
        setDailyProgress(data.map((item: any) => item.total_progress));
      })
      .catch((err) => {
        console.error('Error fetching daily progress:', err);
      });
  }, []);

  const taskProgressData = {
    labels: taskLabels,
    datasets: [
      {
        label: 'Planned (%)',
        data: plannedData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Actual (%)',
        data: actualData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
    ],
  };

   const dailyProgressData = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Total Daily Progress (%)',
        data: dailyProgress,
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-4 rounded shadow h-[400px]">
        <h3 className="text-lg  mb-2 font-bold">Task Progress</h3>
        <Bar data={taskProgressData} options={chartOptions} />
      </div>

      <div className="bg-white p-4 rounded shadow h-[400px]">
         <h3 className="text-lg font-bold mb-2">Daily Progress</h3>
         <Line data={dailyProgressData} options={chartOptions} />
       </div>
    </div>
  );
};

export default Dashboard;

