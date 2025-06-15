import React, { useState, useEffect } from 'react';
import axios from 'axios';

type WorkProgram = {
  work_program_id: number;
  project_id: number;
  boq_id: number;
  work_name: string;
  start_date: string;
  end_date: string;
  remarks: string;
  created_at: string;
  updated_at: string;
};

type Project = {
  project_id: number;
  project_name: string;
  start_date: string;
  end_date: string;
};

type Boq = {
  boq_id: number;
  title: string;
};

const WorkPrograms = () => {
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [boqs, setBoqs] = useState<Boq[]>([]);

  const [formData, setFormData] = useState<Omit<WorkProgram, 'work_program_id'> & { work_program_id?: number }>({
    project_id: 0,
    boq_id: 0,
    work_name: '',
    start_date: '',
    end_date: '',
    remarks: '',
    created_at: '',
    updated_at: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/cerpschema/work_program')
      .then((res) => setWorkPrograms(res.data))
      .catch((err) => console.error('Error fetching work programs:', err));

    axios.get('http://localhost:3000/api/cerpschema/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error('Error fetching projects:', err));

    axios.get('http://localhost:3000/api/cerpschema/boqs')
      .then((res) => setBoqs(res.data))
      .catch((err) => console.error('Error fetching BOQs:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'project_id' || name === 'boq_id') {
      const id = Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: id,
        ...(name === 'project_id'
          ? (() => {
              const selected = projects.find(p => p.project_id === id);
              return selected
                ? { start_date: selected.start_date, end_date: selected.end_date }
                : { start_date: '', end_date: '' };
            })()
          : {})
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearForm = () => {
    setFormData({
      project_id: 0,
      boq_id: 0,
      work_name: '',
      start_date: '',
      end_date: '',
      remarks: '',
      created_at: '',
      updated_at: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      axios.put(`http://localhost:3000/api/cerpschema/work_program/${editingId}`, formData)
        .then(() => {
          setWorkPrograms((prev) =>
            prev.map((wp) => wp.work_program_id === editingId ? { ...wp, ...formData } : wp)
          );
          alert('Data Successfully Updated!');
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.error('Error updating:', err));
    } else {
      axios.post('http://localhost:3000/api/cerpschema/work_program', formData)
        .then((res) => {
          setWorkPrograms((prev) => [...prev, res.data]);
          alert('Data Successfully Inserted!');
          clearForm();
          setShowForm(false);
        })
        .catch((err) => console.error('Error inserting:', err));
    }
  };

  const handleEdit = (id: number) => {
    const selected = workPrograms.find((wp) => wp.work_program_id === id);
    if (selected) {
      setFormData({
        project_id: selected.project_id,
        boq_id: selected.boq_id,
        work_name: selected.work_name,
        start_date: selected.start_date,
        end_date: selected.end_date,
        remarks: selected.remarks,
        created_at: selected.created_at,
        updated_at: selected.updated_at
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:3000/api/cerpschema/work_program/${id}`)
      .then(() => {
        setWorkPrograms((prev) => prev.filter((wp) => wp.work_program_id !== id));
        alert('Data Successfully Deleted!');
      })
      .catch((err) => console.error('Error deleting:', err));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Work Programs</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
        >
          + Add Work Program
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
          

          <div className="flex gap-4">
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_name}
                </option>
              ))}
            </select>

            <select
              name="boq_id"
              value={formData.boq_id}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            >
              <option value="">Select BOQ</option>
              {boqs.map((b) => (
                <option key={b.boq_id} value={b.boq_id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          

          <input
            name="work_name"
            value={formData.work_name}
            onChange={handleChange}
            placeholder="Work Name"
            className="border px-3 py-2 w-full rounded"
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
         

          <input
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="border px-3 py-2 w-full rounded"
          />

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update Work Program' : 'Add Work Program'}
            </button>
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => {
                clearForm();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Work ID</th>
              <th>Project Name</th>
              <th>Title</th>
              <th>Work Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Remarks</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workPrograms.map((wp) => (
              <tr key={wp.work_program_id} className="border-b">
                <td>{wp.work_program_id}</td>
                <td>{projects.find(p => p.project_id === wp.project_id)?.project_name || wp.project_id}</td>
                <td >
                  {boqs.find(b => b.boq_id === wp.boq_id)?.title || wp.boq_id}
                </td>
                <td>{wp.work_name}</td>
                <td>{wp.start_date}</td>
                <td>{wp.end_date}</td>
                <td>{wp.remarks}</td>
                <td>{wp.created_at}</td>
                <td>{wp.updated_at}</td>
                <td>
                  <button
                    onClick={() => handleEdit(wp.work_program_id)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(wp.work_program_id)}
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

export default WorkPrograms;
