import StatusBadge from './StatusBadge.jsx';

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="card-title">{task.name}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <StatusBadge value={task.priority} />
          <StatusBadge value={task.status} />
        </div>
      </div>
      {task.description && <p className="card-desc">{task.description}</p>}
      <div className="card-footer">
        <span>Due: {task.dueDate || '—'}</span>
        <div className="card-actions">
          <button onClick={() => onEdit(task)} className="btn btn-sm">Edit</button>
          <button onClick={() => onDelete(task.id)} className="btn btn-sm btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}
