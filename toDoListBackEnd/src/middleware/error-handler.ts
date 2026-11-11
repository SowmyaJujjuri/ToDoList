import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  // Express body parser reports malformed JSON and oversized requests with a status.
  const status =
    typeof error === 'object' && error !== null && 'status' in error
      ? error.status
      : undefined;

  if (status === 400 || status === 413) {
    res.status(status).json({
      error: status === 400 ? 'Invalid request body' : 'Request body too large',
    });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};
