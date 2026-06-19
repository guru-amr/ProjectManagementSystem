import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, updateProject } from '../api/index.js';
import toast from 'react-hot-toast';

const STATUSES = ['Not Started', 'In Progress', 'Completed'];
const empty = { name: '', description: '', status: 'Not Started', startDate: '', endDate: '' };

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = 'Name is required';
  if (f.startDate && f.endDate && f.endDate < f.startDate) e.endDate = 'End date must be after start date';
  return e;
}

export default function ProjectForm({ initial }) {
  const navigate = useNavigate();
  const editing = !!initial?.id;
  const [form, setForm] = useState(initial ? {
    name: initial.name || '', description: initial.description || '',
    status: initial.status || 'Not Started', startDate: initial.startDate || '', endDate: initial.endDate || '',
  } : empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      editing ? await updateProject(initial.id, form) : await createProject(form);
      toast.success(editing ? 'Project updated' : 'Project created');
      navigate('/projects');
    } catch (err) {
      toast.error(err.errors?.[0]?.message || err.error || 'Save failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1>{editing ? 'Edit Project' : 'New Project'}</h1>
      <form className="form" onSubmit={submit}>
        <div className="field">
          <label>Name *</label>
          <input name="name" value={form.name} onChange={change} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={change} />
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={change}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={change} />
          </div>
          <div className="field">
            <label>End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={change} />
            {errors.endDate && <span className="field-error">{errors.endDate}</span>}
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/projects')}>Cancel</button>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
