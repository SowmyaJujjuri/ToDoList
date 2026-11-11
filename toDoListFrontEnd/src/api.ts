export interface Todo {
  id: string;
  title: string;
  completed?: boolean;
}

export async function showAllTodos(): Promise<Todo[]> {
  const response = await fetch('/api/getAll');
  if (!response.ok) throw new Error('Could not load todos.');
  return response.json();
}

export async function submitText(text: string): Promise<void> {
  // Vite forwards /api requests to the backend during local development.
  const response = await fetch('/api/toDo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"title": text, "completed": false}),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
}

export async function changeToDoStatus(id: string, completed: boolean): Promise<void> {
  // Vite forwards /api requests to the backend during local development.
  const response = await fetch('/api/toDo', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"id": id, "completed": completed}),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
}
