import { useParams } from 'react-router-dom';
import { getProject } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.jsx';
import Spinner from '../components/Spinner.jsx';
import ProjectForm from './ProjectForm.jsx';

export default function ProjectEdit() {
  const { id } = useParams();
  const { data: project, loading, error } = useFetch(() => getProject(id), [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="error-text">{error}</p>;
  return <ProjectForm initial={project} />;
}
