import TaskCard from '../TaskCard/TaskCard.jsx';
import './TaskList.css';

export default function TaskList({ tasks, loading, error, onRetry, completingId, onComplete, filter }) {
  if (loading) return <div className="state-panel"><span className="spinner" /> Loading tasks...</div>;
  if (error) return <div className="state-panel error-state"><strong>Could not load your tasks.</strong><span>{error}</span><button className="button secondary" onClick={onRetry}>Try again</button></div>;
  if (!tasks.length) return <div className="state-panel"><strong>No {filter === 'all' ? '' : filter} tasks yet.</strong><span>Add a task above and it will appear here.</span></div>;
  return <div className="task-list">{tasks.map((task) => <TaskCard key={task._id} task={task} completing={completingId === task._id} onComplete={onComplete} />)}</div>;
}
