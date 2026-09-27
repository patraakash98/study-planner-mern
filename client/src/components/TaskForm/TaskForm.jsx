import { useState } from 'react';
import './TaskForm.css';

const initialForm = { taskName: '', courseName: '', topicName: '', priority: 'medium', durationMinutes: '' };

export default function TaskForm({ onCreate, saving }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    for (const [field, label, max] of [['taskName', 'Task name', 150], ['courseName', 'Course name', 100], ['topicName', 'Topic name', 150]]) {
      const value = form[field].trim();
      if (!value) nextErrors[field] = `${label} is required.`;
      else if (value.length > max) nextErrors[field] = `${label} must be ${max} characters or fewer.`;
    }
    const duration = Number(form.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) nextErrors.durationMinutes = 'Use a whole number from 1 to 1440.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onCreate({ ...form, taskName: form.taskName.trim(), courseName: form.courseName.trim(), topicName: form.topicName.trim(), durationMinutes: duration }, () => setForm(initialForm));
  }
  return <form className="task-form" onSubmit={submit} noValidate><div className="form-heading"><p className="eyebrow">NEW TASK</p><h2>Add to your plan</h2></div><label>Task name<input name="taskName" value={form.taskName} onChange={update} placeholder="e.g. Read chapter 4" maxLength="150" aria-invalid={Boolean(errors.taskName)} />{errors.taskName && <small className="field-error">{errors.taskName}</small>}</label><div className="form-row"><label>Course<input name="courseName" value={form.courseName} onChange={update} placeholder="e.g. Biology" maxLength="100" aria-invalid={Boolean(errors.courseName)} />{errors.courseName && <small className="field-error">{errors.courseName}</small>}</label><label>Topic<input name="topicName" value={form.topicName} onChange={update} placeholder="e.g. Cell structure" maxLength="150" aria-invalid={Boolean(errors.topicName)} />{errors.topicName && <small className="field-error">{errors.topicName}</small>}</label></div><div className="form-row"><label>Priority<select name="priority" value={form.priority} onChange={update}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label>Minutes<input name="durationMinutes" type="number" min="1" max="1440" step="1" value={form.durationMinutes} onChange={update} placeholder="30" aria-invalid={Boolean(errors.durationMinutes)} />{errors.durationMinutes && <small className="field-error">{errors.durationMinutes}</small>}</label></div><button className="button primary" disabled={saving}>{saving ? 'Adding task...' : 'Add task'}</button></form>;
}
