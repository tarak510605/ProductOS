const request = require('supertest');
const app = require('../src/app');

describe('Health endpoint', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
