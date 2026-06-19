import { useState } from 'react';
import { createTask, updateTask, getProjects } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.jsx';
import toast from 'react-hot-toast';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const empty = { name: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', projectId: '' };

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = 'Task name is required';
  return e;
}

export default function TaskForm({ projectId, initial, onSaved, onCancel }) {
  const editing = !!initial?.id;
  const needsProject = !projectId && !editing;
  const { data: projects } = useFetch(getProjects, []);

  const [form, setForm] = useState(initial ? {
    name: initial.name || '', description: initial.description || '',
    priority: initial.priority || 'Medium', status: initial.status || 'Pending',
    dueDate: initial.dueDate || '', projectId: initial.projectId || '',
  } : { ...empty, projectId: projectId || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (needsProject && !form.projectId) errs.projectId = 'Project is required';
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      const payload = { ...form, projectId: projectId || form.projectId };
      editing ? await updateTask(initial.id, payload) : await createTask(payload);
      toast.success(editing ? 'Task updated' : 'Task created');
      onSaved();
    } catch (err) {
      toast.error(err.errors?.[0]?.message || err.error || 'Save failed');
    } finally { setLoading(false); }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h3>{editing ? 'Edit Task' : 'New Task'}</h3>
      {needsProject && (
        <div className="field">
          <label>Project *</label>
          <select name="projectId" value={form.projectId} onChange={change}>
            <option value="">Select a project</option>
            {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.projectId && <span className="field-error">{errors.projectId}</span>}
        </div>
      )}
      <div className="field">
        <label>Name *</label>
        <input name="name" value={form.name} onChange={change} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="field">
        <label>Description</label>
        <textarea name="description" rows={2} value={form.description} onChange={change} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={change}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={change}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Due Date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
      </div>
    </form>
  );
}
