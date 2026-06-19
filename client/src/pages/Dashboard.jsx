import { Link } from 'react-router-dom';
import { getDashboard } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.jsx';
import Spinner from '../components/Spinner.jsx';

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-value">{value ?? 0}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, error } = useFetch(getDashboard);

  if (loading) return <Spinner />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <Link to="/projects/new" className="btn btn-primary">+ New Project</Link>
      </div>
      <div className="stats-grid">
        <StatCard label="Total Projects"      value={data.totalProjects}      color="#6366f1" />
        <StatCard label="In Progress"         value={data.projectsInProgress} color="#f59e0b" />
        <StatCard label="Total Tasks"         value={data.totalTasks}         color="#3b82f6" />
        <StatCard label="Completed Tasks"     value={data.completedTasks}     color="#10b981" />
        <StatCard label="Pending Tasks"       value={data.pendingTasks}       color="#ef4444" />
      </div>
      <div style={{ marginTop: 32 }}>
        <Link to="/projects" className="btn">View All Projects →</Link>
      </div>
    </div>
  );
}
