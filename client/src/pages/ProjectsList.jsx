import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, deleteProject } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Spinner from '../components/Spinner.jsx';
import toast from 'react-hot-toast';

const STATUSES = ['', 'Not Started', 'In Progress', 'Completed'];

export default function ProjectsList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState({});

  const { data: projects, loading, error, reload } = useFetch(
    () => getProjects(query),
    [JSON.stringify(query)]
  );

  const applyFilters = () => setQuery({ search: search || undefined, status: status || undefined });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      reload();
    } catch (err) { toast.error(err.error || 'Delete failed'); }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">+ New Project</Link>
      </div>

      <div className="filters">
        <input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyFilters()} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <button className="btn" onClick={applyFilters}>Filter</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="error-text">{error}</p>}
      {!loading && projects?.length === 0 && <p>No projects found.</p>}
      <div className="cards-grid">
        {projects?.map(p => <ProjectCard key={p.id} project={p} onDelete={handleDelete} />)}
      </div>
    </div>
  );
}
