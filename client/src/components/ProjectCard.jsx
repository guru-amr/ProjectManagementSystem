import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

export default function ProjectCard({ project, onDelete }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Link to={`/projects/${project.id}`} className="card-title">{project.name}</Link>
        <StatusBadge value={project.status} />
      </div>
      {project.description && <p className="card-desc">{project.description}</p>}
      <div className="card-footer">
        <span>{project.startDate || '—'} → {project.endDate || '—'}</span>
        <div className="card-actions">
          <Link to={`/projects/${project.id}/edit`} className="btn btn-sm">Edit</Link>
          <button onClick={() => onDelete(project.id)} className="btn btn-sm btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}
