import './TaskCard.css';

const priorityClass = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' };
export default function TaskCard({ task, completing, onComplete }) {
  return <article className="task-card"><div className="task-main"><div className="task-title-row"><h3>{task.taskName}</h3><span className={`priority ${priorityClass[task.priority]}`}>{task.priority}</span></div><p className="task-meta"><span>{task.courseName}</span><b>•</b><span>{task.topicName}</span><b>•</b><span>{task.durationMinutes} min</span></p></div><div className="task-status">{task.status === 'completed' ? <span className="status-complete">Completed</span> : <button className="button complete" onClick={() => onComplete(task._id)} disabled={completing}>{completing ? 'Saving...' : 'Mark completed'}</button>}</div></article>;
}
