import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/card';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/cerpschema/report')
      .then((res) => {
        setReportData(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => console.error('Error fetching report:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = reportData;

    if (search) {
      filtered = filtered.filter((item) =>
        item.task_name.toLowerCase().includes(search)
      );
    }

    if (startDate) {
      filtered = filtered.filter((item) =>
        new Date(item.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter((item) =>
        new Date(item.date) <= new Date(endDate)
      );
    }

    setFilteredData(filtered);
  }, [search, startDate, endDate, reportData]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Project Progress Report', 14, 16);
    autoTable(doc, {
      head: [['Project', 'Work', 'Task', 'Planned (%)', 'Actual (%)', 'Date']],
      body: filteredData.map((r) => [
        r.project_name,
        r.work_name,
        r.task_name,
        r.percentage ?? '0',
        r.actual_progress ?? '0',
        r.date ? new Date(r.date).toLocaleDateString() : 'N/A',
      ]),
      startY: 24,
    });
    doc.save('progress_report.pdf');
  };

  const exportCSV = () => {
    window.open('http://localhost:3000/api/reports/progress/csv', '_blank');
  };

  const exportExcel = () => {
    window.open('http://localhost:3000/api/reports/progress/excel', '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Project Progress Reports</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder="Search by task..."
            className="border rounded px-3 py-1 shadow-sm focus:outline-none"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-1 shadow-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-1 shadow-sm"
          />
          <Button onClick={exportPDF} className="flex items-center gap-2">
            <Download size={16} /> PDF
          </Button>
          <Button onClick={exportCSV} className="flex items-center gap-2">
            <FileText size={16} /> CSV
          </Button>
          <Button onClick={exportExcel} className="flex items-center gap-2">
            <Download size={16} /> Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-4">
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : (
            <table className="w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border px-4 py-2">Project</th>
                  <th className="border px-4 py-2">Work</th>
                  <th className="border px-4 py-2">Task</th>
                  <th className="border px-4 py-2">Planned (%)</th>
                  <th className="border px-4 py-2">Actual (%)</th>
                  <th className="border px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.project_name}</td>
                    <td className="border px-4 py-2">{item.work_name}</td>
                    <td className="border px-4 py-2">{item.task_name}</td>
                    <td className="border px-4 py-2">{item.percentage ?? '0'}</td>
                    <td className="border px-4 py-2">{item.actual_progress ?? '0'}</td>
                    <td className="border px-4 py-2">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredData.length > 0 && (
                <tfoot>
                  <tr className="font-semibold bg-gray-100">
                    <td colSpan={3} className="border px-4 py-2 text-right">
                      Averages
                    </td>
                    <td className="border px-4 py-2">
                      {(
                        filteredData.reduce(
                          (sum, r) => sum + parseFloat(r.percentage || 0),
                          0
                        ) / filteredData.length
                      ).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {(
                        filteredData.reduce(
                          (sum, r) =>
                            sum + parseFloat(r.actual_progress || 0),
                          0
                        ) / filteredData.length
                      ).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
