export type CreateTodoBody = {
  title: string;
  completed?: boolean;
};

export type UpdateTodoBody = {
  id: string;
  completed: boolean;
};

export function isCreateTodoBody(value: unknown): value is CreateTodoBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'title' in value &&
    typeof value.title === 'string' &&
    (!('completed' in value) || typeof value.completed === 'boolean')
  );
}

export function isUpdateTodoBody(value: unknown): value is UpdateTodoBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('id' in value) || typeof value.id != 'string' || value.id.trim() == '' || value.id.includes('/')){
    return false
  }

  return ( 
    'id' in value && typeof value.id === 'string' &&
    'completed' in value && typeof value.completed === 'boolean'
  );
}