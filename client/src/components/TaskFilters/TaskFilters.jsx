import './TaskFilters.css';

export default function TaskFilters({ active, onChange }) {
  return <div className="filters" role="tablist" aria-label="Task status"><span className="filter-label">VIEW</span>{[['all', 'All'], ['pending', 'Pending'], ['completed', 'Completed']].map(([value, label]) => <button className={active === value ? 'filter active' : 'filter'} key={value} role="tab" aria-selected={active === value} onClick={() => onChange(value)}>{label}</button>)}</div>;
}
