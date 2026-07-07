import { useState, useEffect } from 'react';
import './App.css';

const API = '/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state for creating a new task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);

  const [formError, setFormError] = useState('');

  // ── Fetch all tasks ──────────────────────────────────────────────────────────
  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to load tasks');
      setTasks(await res.json());
    } catch {
      setError('Could not connect to the API. Make sure the server is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // ── Create task ──────────────────────────────────────────────────────────────
  const createTask = async (e) => {
    e.preventDefault();
    setFormError('');

    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDesc }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.message);
      return;
    }

    const created = await res.json();
    setTasks(prev => [...prev, created]);
    setNewTitle('');
    setNewDesc('');
  };

  // ── Toggle completed ─────────────────────────────────────────────────────────
  const toggleCompleted = async (task) => {
    const res = await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    }
  };

  // ── Open edit modal ──────────────────────────────────────────────────────────
  const openEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditCompleted(task.completed);
    setFormError('');
  };

  const closeEdit = () => setEditId(null);

  // ── Save edit ────────────────────────────────────────────────────────────────
  const saveEdit = async (e) => {
    e.preventDefault();
    setFormError('');

    const res = await fetch(`${API}/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDesc, completed: editCompleted }),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.message);
      return;
    }

    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    closeEdit();
  };

  // ── Delete task ──────────────────────────────────────────────────────────────
  const deleteTask = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (res.ok) setTasks(prev => prev.filter(t => t.id !== id));
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const done = tasks.filter(t => t.completed).length;
  const pending = tasks.length - done;

  return (
    <div id="todo-app">
      <header className="todo-header">
        <h1>Todo List</h1>
        <div className="stats">
          <span className="stat pending">{pending} pending</span>
          <span className="stat done">{done} done</span>
        </div>
      </header>

      {/* ── Create form ──────────────────────────────────────────────── */}
      <form className="create-form" onSubmit={createTask}>
        <h2>New Task</h2>
        <div className="field-row">
          <input
            className="input"
            type="text"
            placeholder="Title (required, max 50 chars)"
            maxLength={50}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Add</button>
        </div>
        {formError && !editId && <p className="form-error">{formError}</p>}
      </form>

      {/* ── Task list ────────────────────────────────────────────────── */}
      {loading && <p className="status-msg">Loading tasks…</p>}
      {error   && <p className="status-msg error">{error}</p>}

      {!loading && !error && (
        <ul className="task-list">
          {tasks.length === 0 && (
            <li className="empty-msg">No tasks yet. Add one above!</li>
          )}
          {tasks.map(task => (
            <li key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task)}
                />
                <span className="checkmark" />
              </label>
              <div className="task-body">
                <span className="task-title">{task.title}</span>
                {task.description && (
                  <span className="task-desc">{task.description}</span>
                )}
              </div>
              <div className="task-actions">
                <button className="btn btn-edit" onClick={() => openEdit(task)}>Edit</button>
                <button className="btn btn-delete" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Edit modal ───────────────────────────────────────────────── */}
      {editId !== null && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <form onSubmit={saveEdit}>
              <div className="field-col">
                <input
                  className="input"
                  type="text"
                  placeholder="Title"
                  maxLength={50}
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Description"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={editCompleted}
                    onChange={e => setEditCompleted(e.target.checked)}
                  />
                  Mark as completed
                </label>
              </div>
              {formError && editId && <p className="form-error">{formError}</p>}
              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">Save</button>
                <button className="btn btn-cancel" type="button" onClick={closeEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
