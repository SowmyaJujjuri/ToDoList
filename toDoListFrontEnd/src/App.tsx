import { useRef, useState, type FormEvent } from 'react';
import { changeToDoStatus, showAllTodos, submitText, type Todo } from './api';

export default function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState('');
  const [lastSubmission, setLastSubmission] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [todosError, setTodosError] = useState('');
  const [updatingTodoIds, setUpdatingTodoIds] = useState<string[]>([]);

  async function handleShowAllTodos() {
    if (isLoadingTodos) return;
    setIsLoadingTodos(true);
    setTodosError('');
    try {
      setTodos(await showAllTodos());
    } catch (error) {
      setTodosError(error instanceof Error ? error.message : 'Could not load todos.');
    } finally {
      setIsLoadingTodos(false);
    }
  }

  function openPopup() {
    setText('');
    setError('');
    dialogRef.current?.showModal();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (!value || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    try {
      await submitText(value);
      setLastSubmission(value);
      dialogRef.current?.close();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCheck(id: string, completed: boolean) {
    if (updatingTodoIds.includes(id)) return;
    setUpdatingTodoIds((current) => [...current, id]);
    setTodosError('');
    try {
      await changeToDoStatus(id, completed);
      setTodos((current) =>
        current === null
          ? null
          : current.map((todo) =>
              todo.id === id ? { ...todo, completed } : todo
            )
      );
    } catch (error) {
      setTodosError(error instanceof Error ? error.message : 'Could not update todo.');
    } finally {
      setUpdatingTodoIds((current) => current.filter((todoId) => todoId !== id));
    }
  }

  return (
    <main className="card">
      <h1>A place for your thoughts.</h1>
      <p>Open the popup, type something, and press Enter.</p>
      <div className="main-actions">
        <button type="button" onClick={openPopup}>Enter some text</button>
        <button type="button" className="secondary" onClick={handleShowAllTodos} disabled={isLoadingTodos || updatingTodoIds.length > 0}>
          {isLoadingTodos ? 'Loading…' : 'show all todos'}
        </button>
      </div>

      <div aria-live="polite">
        {todosError && <p className="error" role="alert">{todosError}</p>}
        {todos !== null && (
          <section className="todo-section" aria-labelledby="todos-title" aria-busy={isLoadingTodos}>
            <h2 id="todos-title">All todos</h2>
            {todos.length === 0 ? (
              <p>No todos yet.</p>
            ) : (
              <ul className="todo-list">
                {todos.map((todo) => (
                  <li key={todo.id}>
                    <span className={todo.completed ? 'todo-completed' : undefined}>{todo.title}</span>
                    <input
                      className="todo-checkbox"
                      type="checkbox"
                      checked={todo.completed === true}
                      disabled={isLoadingTodos || updatingTodoIds.includes(todo.id)}
                      onChange={(event) =>
                        handleCheck(todo.id, event.currentTarget.checked)
                      }
                      aria-label={`${todo.title}: ${todo.completed ? 'Completed' : 'Pending'}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        {lastSubmission !== null && (
          <section className="submission">
            <h2>Last submitted</h2>
            <p>{lastSubmission}</p>
          </section>
        )}
      </div>

      <dialog ref={dialogRef} aria-labelledby="popup-title" aria-describedby="popup-description">
        <form onSubmit={handleSubmit}>
          <h2 id="popup-title">What’s on your mind?</h2>
          <p id="popup-description">Type your text below and press Enter to submit.</p>
          <label htmlFor="text-input">Your text</label>
          <input
            id="text-input"
            name="text"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Start typing…"
            autoFocus
            required
            disabled={isSubmitting}
          />
          {error && <p className="error" role="alert">{error}</p>}
          <div className="actions">
            <button type="button" className="secondary" onClick={() => dialogRef.current?.close()} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={!text.trim() || isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </dialog>
    </main>
  );
}
