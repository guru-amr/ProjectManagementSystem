import { useState } from 'react';
import { getTasks, deleteTask } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from './TaskForm.jsx';
import Spinner from '../components/Spinner.jsx';
import toast from 'react-hot-toast';

const STATUSES = ['', 'Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['', 'Low', 'Medium', 'High'];

export default function TasksList() {
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });
  const [query, setQuery] = useState({});

  const { data: tasks, loading, error, reload } = useFetch(() => getTasks(query), [JSON.stringify(query)]);

  const applyFilters = () => setQuery({
    search: filters.search || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(id); toast.success('Task deleted'); reload(); }
    catch (err) { toast.error(err.error || 'Delete failed'); }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>All Tasks</h1>
        <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowForm(true); }}>+ New Task</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <TaskForm
              initial={editTask}
              onSaved={() => { setShowForm(false); setEditTask(null); reload(); }}
              onCancel={() => { setShowForm(false); setEditTask(null); }}
            />
          </div>
        </div>
      )}

      <div className="filters">
        <input placeholder="Search tasks…" value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && applyFilters()} />
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
          {PRIORITIES.map(p => <option key={p} value={p}>{p || 'All Priorities'}</option>)}
        </select>
        <button className="btn" onClick={applyFilters}>Filter</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="error-text">{error}</p>}
      {!loading && tasks?.length === 0 && <p>No tasks found.</p>}
      <div className="cards-grid">
        {tasks?.map(t => (
          <TaskCard key={t.id} task={t}
            onEdit={(task) => { setEditTask(task); setShowForm(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
