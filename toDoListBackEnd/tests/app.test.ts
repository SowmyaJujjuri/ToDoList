import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import { app } from '../src/app.js';

test('unregistered API routes return JSON 404 with security headers', async () => {
  const response = await request(app).get('/api');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Route not found' });
  assert.equal(response.headers['x-powered-by'], undefined);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
});

test('malformed JSON returns a sanitized client error', async () => {
  const response = await request(app)
    .post('/api')
    .set('Content-Type', 'application/json')
    .send('{');

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, { error: 'Invalid request body' });
});
