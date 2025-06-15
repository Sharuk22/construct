import React, { useState, useEffect } from 'react';
import axios from 'axios';

type ProgressEntry = {
  progress_id: number;
  task_id: number;
  // boq_item_id: string;
  quantity: string;
  date: string;
  remark: string;
  created_at: string;
  updated_at: string;
};

type Task = {
  task_id: number;
  task_name: string;
};

// type BOQItem = {
//   boq_item_id: string;
// };

const Progress = () => {
  const [progressList, setProgressList] = useState<ProgressEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  //const [boq_items, setBoqs] = useState<BOQItem[]>([]);

  const [formData, setFormData] = useState({
    task_id: 0,           
   // boq_item_id: '',
    quantity: '',
    date: '',
    remark: '',
    created_at: '',
    updated_at: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/cerpschema/daily_progress_monitoring')
      .then((res) => setProgressList(res.data))
      .catch((err) => console.error('Error fetching progress:', err));

    axios.get('http://localhost:3000/api/cerpschema/task')
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));

    // axios.get('http://localhost:3000/api/cerpschema/boq_items')
    //   .then((res) => setBoqs(res.data))
    //   .catch((err) => console.error('Error fetching BOQ items:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'task_id' ? Number(value) : value,
    }));
  };

  const clearForm = () => {
    setFormData({
      task_id: 0,
     // boq_item_id: '',
      quantity: '',
      date: '',
      remark: '',
      created_at: '',
      updated_at: '',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { ...formData };

    if (editingId !== null) {
      axios.put(`http://localhost:3000/api/cerpschema/daily_progress_monitoring/${editingId}`, payload)
        .then(() => {
          setProgressList((prev) =>
            prev.map((entry) =>
              entry.progress_id === editingId ? { ...entry, ...payload } : entry
            )
          );
          alert('Progress Updated!');
          clearForm();
          setShowForm(false);
        })
        .catch((error) => alert('Update failed: ' + error.message));
    } else {
      axios.post('http://localhost:3000/api/cerpschema/daily_progress_monitoring', payload)
        .then((res) => {
          setProgressList((prev) => [...prev, res.data]);
          alert('Progress Added!');
          clearForm();
          setShowForm(false);
        })
        .catch((error) => alert('Insert failed: ' + error.message));
    }
  };

  const handleEdit = (progress_id: number) => {
    const selected = progressList.find((entry) => entry.progress_id === progress_id);
    if (selected) {
      setFormData({
        task_id: selected.task_id,
      //  boq_item_id: selected.boq_item_id,
        quantity: selected.quantity,
        date: selected.date,
        remark: selected.remark,
        created_at: selected.created_at,
        updated_at: selected.updated_at,
      });
      setEditingId(progress_id);
      setShowForm(true);
    }
  };

  const handleDelete = (progress_id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      axios.delete(`http://localhost:3000/api/cerpschema/daily_progress_monitoring/${progress_id}`)
        .then(() => {
          setProgressList((prev) => prev.filter((entry) => entry.progress_id !== progress_id));
          alert('Progress Deleted!');
        })
        .catch((error) => alert('Delete failed: ' + error.message));
    }
  };

  const handleAddClick = () => {
    clearForm();
    setShowForm(true);
  };

  const handleCancel = () => {
    clearForm();
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Daily Progress</h2>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Progress
          </button>
        )}
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

            {/* <select
              name="boq_item_id"
              value={formData.boq_item_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select BOQ Item</option>
              {boq_items.map((boq) => (
                <option key={boq.boq_item_id} value={boq.boq_item_id}>
                  {boq.boq_item_id}
                </option>
              ))}
            </select> */}
          </div>

          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex flex-col w-full mb-4">
  <label htmlFor="date" className="mb-1 text-sm font-medium text-gray-700">
    Date
  </label>
  <input
    type="date"
    id="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  />
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
              {editingId ? 'Update Progress' : 'Add Progress'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
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
              <th>Progress ID</th>
              <th>Task Name</th>
              {/* <th>BOQ Item</th> */}
              <th>Quantity</th>
              <th>Date</th>
              <th>Remark</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {progressList.map((entry) => {
              const task = tasks.find(t => t.task_id === entry.task_id);
              return (
                <tr key={entry.progress_id} className="border-b">
                  <td>{entry.progress_id}</td>
                  <td>{task ? task.task_name : 'N/A'}</td>
                  {/* <td>{entry.boq_item_id}</td> */}
                  <td>{entry.quantity}</td>
                  <td>{entry.date}</td>
                  <td>{entry.remark}</td>
                  <td>{entry.created_at}</td>
                  <td>{entry.updated_at}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(entry.progress_id)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.progress_id)}
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

export default Progress;




