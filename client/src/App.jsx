import { useCallback, useEffect, useRef, useState } from 'react';
import { completeTask, createTask, getTasks } from './api/tasks.js';
import TaskFilters from './components/TaskFilters/TaskFilters.jsx';
import TaskForm from './components/TaskForm/TaskForm.jsx';
import TaskList from './components/TaskList/TaskList.jsx';

export default function App() {
  const [filter, setFilter] = useState('pending');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState('');
  const requestId = useRef(0);
  const abortRef = useRef(null);

  const loadTasks = useCallback(async (nextFilter = filter) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const currentRequest = ++requestId.current;
    setLoading(true); setListError('');
    try { const data = await getTasks(nextFilter, controller.signal); if (currentRequest === requestId.current) setTasks(data.tasks); return true; }
    catch (error) { if (error.name !== 'AbortError' && currentRequest === requestId.current) setListError(error.message); return false; }
    finally { if (currentRequest === requestId.current) setLoading(false); }
  }, [filter]);
  useEffect(() => { loadTasks(filter); return () => abortRef.current?.abort(); }, [filter, loadTasks]);

  async function handleCreate(task, onSuccess) {
    setSaving(true); setMutationError(''); setNotice('');
    try {
      await createTask(task);
      onSuccess();
      setFilter('pending');
      const refreshed = await loadTasks('pending');
      setNotice(refreshed ? 'Task added.' : 'Task saved, but the list could not refresh.');
    }
    catch (error) { setMutationError(error.message); }
    finally { setSaving(false); }
  }
  async function handleComplete(id) {
    setCompletingId(id); setMutationError(''); setNotice('');
    try {
      await completeTask(id);
      const refreshed = await loadTasks(filter);
      setNotice(refreshed ? 'Task completed.' : 'Task completed, but the list could not refresh.');
    }
    catch (error) { setMutationError(error.message); }
    finally { setCompletingId(''); }
  }
  return <div className="app"><header className="site-header"><div className="brand"><span className="brand-mark">◒</span><span>study planner</span></div><span className="header-note">A calmer way to make progress</span></header><main className="layout"><section className="intro"><p className="eyebrow">YOUR STUDY SPACE</p><h1>Make time for what matters.</h1><p>Plan one focused step at a time. Your work is saved in MongoDB and will be here when you return.</p></section><div className="columns"><TaskForm onCreate={handleCreate} saving={saving} /><section className="tasks-section"><div className="section-top"><div><p className="eyebrow">TASKS</p><h2>Your study list</h2></div><TaskFilters active={filter} onChange={setFilter} /></div>{notice && <div className="notice success" role="status">{notice}</div>}{mutationError && <div className="notice failure" role="alert">{mutationError}</div>}<TaskList tasks={tasks} loading={loading} error={listError} onRetry={() => loadTasks(filter)} completingId={completingId} onComplete={handleComplete} filter={filter} /></section></div></main><footer>Local development MVP <span>•</span> Persistent MongoDB storage</footer></div>;
}
