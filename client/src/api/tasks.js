async function request(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error?.message || 'The request failed.'); error.fields = data.error?.fields; throw error; }
  return data;
}

export function getTasks(status, signal) { return request(`/api/tasks${status === 'all' ? '' : `?status=${status}`}`, { signal }); }
export function createTask(task) { return request('/api/tasks', { method: 'POST', body: JSON.stringify(task) }); }
export function completeTask(id) { return request(`/api/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'completed' }) }); }
