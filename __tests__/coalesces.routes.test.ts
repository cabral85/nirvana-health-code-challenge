import { coalescesRouter } from '../src/routes/coalesces.route';
import request from 'supertest';
import express from 'express';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const app = express();
app.use('/', coalescesRouter);

const defaultUserId = 1;

describe('Happy Path', () => {
  test('Calling url and getting the result', async () => {
    const mock = new MockAdapter(axios);
    const dataUrl1 = { deductible: 1000, stop_loss: 10000, oop_max: 5000 };
    const dataUrl2 = { deductible: 1500, stop_loss: 10000, oop_max: 5000 };
    const dataUrl3 = { deductible: 2000, stop_loss: 10000, oop_max: 5000 };
    mock.onGet('https://api1.com?member_id=1').reply(200, dataUrl1);
    mock.onGet('https://api2.com?member_id=1').reply(200, dataUrl2);
    mock.onGet('https://api3.com?member_id=1').reply(200, dataUrl3);
    const res = await request(app).get(`/${defaultUserId}/average`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      deductible: 1500, stop_loss: 10000, oop_max: 5000,
    });
  });
  // eslint-disable-next-line max-len
  test('Calling url and getting the result without passing strategy', async () => {
    const mock = new MockAdapter(axios);
    const dataUrl1 = { deductible: 1000, stop_loss: 10000, oop_max: 5000 };
    const dataUrl2 = { deductible: 1500, stop_loss: 10000, oop_max: 5000 };
    const dataUrl3 = { deductible: 2000, stop_loss: 10000, oop_max: 5000 };
    mock.onGet('https://api1.com?member_id=1').reply(200, dataUrl1);
    mock.onGet('https://api2.com?member_id=1').reply(200, dataUrl2);
    mock.onGet('https://api3.com?member_id=1').reply(200, dataUrl3);
    const res = await request(app).get(`/${defaultUserId}/minimum`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      deductible: 1000, stop_loss: 10000, oop_max: 5000,
    });
  });
  test('Calling url without parameter', async () => {
    const res = await request(app).get('');
    expect(res.statusCode).toBe(404);
  });
});
