import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler.js';
import { apiRouter } from './routes/index.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRouter);

// app.use((_req, res) => {
//   res.status(404).json({ error: 'Route  found' });
// });

app.get('/health', (_req, res) => {
  res.status(200).json({ success: 'success' });
});

app.use(errorHandler);
