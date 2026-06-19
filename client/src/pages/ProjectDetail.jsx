import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject, getTasks, deleteTask } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from './TaskForm.jsx';
import toast from 'react-hot-toast';

const STATUSES = ['', 'Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['', 'Low', 'Medium', 'High'];

export default function ProjectDetail() {
  const { id } = useParams();
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });
  const [query, setQuery] = useState({ projectId: id });

  const { data: project, loading: pLoading, error: pError } = useFetch(() => getProject(id), [id]);
  const { data: tasks, loading: tLoading, error: tError, reload } = useFetch(
    () => getTasks(query), [JSON.stringify(query)]
  );

  const applyFilters = () => setQuery({
    projectId: id,
    search: filters.search || undefined,
    status: filters.status || undefined,
    priority: filters.priority || undefined,
  });

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(taskId); toast.success('Task deleted'); reload(); }
    catch (err) { toast.error(err.error || 'Delete failed'); }
  };

  if (pLoading) return <Spinner />;
  if (pError) return <p className="error-text">{pError}</p>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link to="/projects" style={{ fontSize: 14, color: '#6366f1' }}>← Projects</Link>
          <h1 style={{ margin: '4px 0' }}>{project?.name}</h1>
          {project?.description && <p style={{ color: '#6b7280' }}>{project.description}</p>}
          <StatusBadge value={project?.status} />
        </div>
        <Link to={`/projects/${id}/edit`} className="btn">Edit Project</Link>
      </div>

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Tasks</h2>
        <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowForm(true); }}>+ New Task</button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <TaskForm
              projectId={id}
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

      {tLoading && <Spinner />}
      {tError && <p className="error-text">{tError}</p>}
      {!tLoading && tasks?.length === 0 && <p>No tasks yet.</p>}
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
