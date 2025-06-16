import React, { useState, useEffect } from 'react';
import axios from 'axios';

type TaskDetailType = {
  task_detail_id: number;
  task_id: number;
  percentage: string;
  created_at: string;
  updated_at: string;
};

type TaskType = {
  task_id: number;
  task_name: string;
};

const TaskDetail = () => {
  const [taskDetails, setTaskDetails] = useState<TaskDetailType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [formData, setFormData] = useState({
    task_id: 0,
    percentage: '',
    created_at: '',
    updated_at: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cerpschema/task_details`)
      .then((res) => setTaskDetails(res.data))
      .catch((err) => console.error('Error fetching task details:', err));

    axios
      .get(`${API_URL}/api/cerpschema/task`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, [API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'task_id' ? Number(value) : value,
    }));
  };

  const clearForm = () => {
    setFormData({
      task_id: 0,
      percentage: '',
      created_at: '',
      updated_at: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };

    if (editingId !== null) {
      axios
        .put(`${API_URL}/api/cerpschema/task_details/${editingId}`, payload)
        .then(() => {
          setTaskDetails((prev) =>
            prev.map((td) =>
              td.task_detail_id === editingId ? { ...td, ...payload } : td
            )
          );
          alert('Data Successfully Updated!');
          clearForm();
          setShowForm(false);
        })
        .catch((err) => alert('Update failed: ' + err.message));
    } else {
      axios
        .post(`${API_URL}/api/cerpschema/task_details`, payload)
        .then((res) => {
          setTaskDetails((prev) => [...prev, res.data]);
          alert('Data Successfully Inserted!');
          clearForm();
          setShowForm(false);
        })
        .catch((err) => alert('Insert failed: ' + err.message));
    }
  };

  const handleEdit = (id: number) => {
    const selected = taskDetails.find((td) => td.task_detail_id === id);
    if (selected) {
      setFormData({
        task_id: selected.task_id,
        percentage: selected.percentage,
        created_at: selected.created_at,
        updated_at: selected.updated_at,
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${API_URL}/api/cerpschema/task_details/${id}`)
      .then(() => {
        setTaskDetails((prev) =>
          prev.filter((td) => td.task_detail_id !== id)
        );
        alert('Data Successfully Deleted!');
      })
      .catch((err) => alert('Delete failed: ' + err.message));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Task Details</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
        >
          + Add Task Detail
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          <div className="flex gap-4">
            <select
              name="task_id"
              value={formData.task_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value={0}>Select Task</option>
              {tasks.map((task) => (
                <option key={task.task_id} value={task.task_id}>
                  {task.task_name}
                </option>
              ))}
            </select>
          </div>

          <input
            name="percentage"
            placeholder="Percentage"
            value={formData.percentage}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
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
              {editingId ? 'Update Task Detail' : 'Add Task Detail'}
            </button>
            <button
              type="button"
              onClick={() => {
                clearForm();
                setShowForm(false);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Task Detail ID</th>
              <th>Task Name</th>
              <th>Percentage</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskDetails.map((td) => {
              const task = tasks.find((t) => t.task_id === td.task_id);
              return (
                <tr key={td.task_detail_id} className="border-b">
                  <td>{td.task_detail_id}</td>
                  <td>{task ? task.task_name : 'N/A'}</td>
                  <td>{td.percentage}</td>
                  <td>{td.created_at}</td>
                  <td>{td.updated_at}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(td.task_detail_id)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(td.task_detail_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskDetail;
