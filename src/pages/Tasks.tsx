import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Task = {
  task_id: number;
  work_program_id: number; 
  task_name: string;
  start_date: string;
  end_date: string;
  remark: string;
  created_at: string;
  updated_at: string;
};

type WorkProgram = {
  work_program_id: number;
  work_name: string;
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    work_program_id: 0,
    task_name: '',
    start_date: '',
    end_date: '',
    remark: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/cerpschema/task')
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));

    axios.get('http://localhost:3000/api/cerpschema/work_program')
      .then((res) => setWorkPrograms(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'work_program_id' ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      work_program_id: 0,
      task_name: '',
      start_date: '',
      end_date: '',
      remark: '',
      created_at: '',
      updated_at: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      axios.put(`http://localhost:3000/api/cerpschema/task/${editingId}`, formData)
        .then(() => {
          setTasks((prev) =>
            prev.map((t) => (t.task_id === editingId ? { ...t, ...formData } : t))
          );
          alert('Task updated successfully');
          resetForm();
        })
        .catch(err => alert('Update failed: ' + err.message));
    } else {
      axios.post('http://localhost:3000/api/cerpschema/task', formData)
        .then((res) => {
          setTasks((prev) => [...prev, res.data]);
          alert('Task added successfully');
          resetForm();
        })
        .catch(err => alert('Add failed: ' + err.message));
    }
  };

  const handleEdit = (id: number) => {
    const t = tasks.find((t) => t.task_id === id);
    if (t) {
      setFormData({ ...t });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:3000/api/cerpschema/task/${id}`)
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.task_id !== id));
        alert('Task deleted successfully');
      })
      .catch(err => alert('Delete failed: ' + err.message));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tasks</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          <select
            name="work_program_id"  
            value={formData.work_program_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value={0}>Select Work Program</option>
            {workPrograms.map((wp) => (
              <option key={wp.work_program_id} value={wp.work_program_id}>
                {wp.work_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="task_name"
            placeholder="Task Name"
            value={formData.task_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex gap-4">

  <div className="flex flex-col w-full">
    <label htmlFor="start_date" className="mb-1 text-sm font-medium text-gray-700">
      Start Date
    </label>
    <input
      type="date"
      id="start_date"
      name="start_date"
      value={formData.start_date}
      onChange={handleChange}
      className="border px-3 py-2 w-full rounded"
      required
    />
  </div>

 
  <div className="flex flex-col w-full">
    <label htmlFor="end_date" className="mb-1 text-sm font-medium text-gray-700">
      End Date
    </label>
    <input
      type="date"
      id="end_date"
      name="end_date"
      value={formData.end_date}
      onChange={handleChange}
      className="border px-3 py-2 w-full rounded"
      required
    />
  </div>
</div>


          <input
            type="text"
            name="remark"
            placeholder="Remark"
            value={formData.remark}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
             <label htmlFor="created_at" className="mb-1 text-sm font-medium text-gray-700">
              Created At
             </label>
              <input
              type="datetime-local"
               id="created_at"
               name="created_at"
               value={formData.created_at}
               onChange={handleChange}
               className="w-full border p-2 rounded"
                required
               />
            </div>

 
            <div className="flex flex-col w-full">
                <label htmlFor="updated_at" className="mb-1 text-sm font-medium text-gray-700">
                    Updated At
                </label>
               <input
                 type="datetime-local"
                 id="updated_at"
                name="updated_at"
                value={formData.updated_at}
                    onChange={handleChange}
                className="w-full border p-2 rounded"
               required
                 />
             </div>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Task ID</th>
              <th>Work Program</th>
              <th>Task Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Remark</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.task_id} className="border-b">
                <td>{task.task_id}</td>
                <td>
                  {workPrograms.find((wp) => wp.work_program_id === task.work_program_id)?.work_name || 'N/A'}
                </td>
                <td>{task.task_name}</td>
                <td>{task.start_date}</td>
                <td>{task.end_date}</td>
                <td>{task.remark}</td>
                <td>{task.created_at}</td>
                <td>{task.updated_at}</td>
                <td>
                  <button
                    onClick={() => handleEdit(task.task_id)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.task_id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;

