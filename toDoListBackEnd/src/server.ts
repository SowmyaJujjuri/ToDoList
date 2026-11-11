import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, env.host, () => {
  console.info(
    `Server listening at http://${env.host}:${env.port} (${env.nodeEnv})`,
  );
});

server.on('error', (error) => {
  console.error('Server failed to start:', error);
  process.exitCode = 1;
});

let shuttingDown = false;

function shutdown(signal: string): void {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`${signal} received; closing HTTP server`);

  const timeout = setTimeout(() => {
    console.error('Graceful shutdown timed out');
    process.exit(1);
  }, 10_000);
  timeout.unref();

  server.close((error) => {
    clearTimeout(timeout);
    if (error) {
      console.error('Failed to close HTTP server:', error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
