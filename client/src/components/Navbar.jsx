import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">ProjectManagement</Link>
      {user && (
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <span className="nav-user">{user.fullName}</span>
          <button onClick={handleLogout} className="btn btn-sm">Logout</button>
        </div>
      )}
    </nav>
  );
}
