import request from 'supertest';
import app from '../src/app.js';

describe('App Endpoints', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.status).toEqual('fail');
  });
});
