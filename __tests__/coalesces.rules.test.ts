import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCoalesce } from '../src/rules/coalesces.rules';

describe('Happy Path', () => {
  test('Testing average result', async () => {
    const mock = new MockAdapter(axios);
    const dataUrl1 = { deductible: 1000, stop_loss: 10000, oop_max: 5000 };
    const dataUrl2 = { deductible: 2000, stop_loss: 10000, oop_max: 5000 };
    const dataUrl3 = { deductible: 2000, stop_loss: 10000, oop_max: 5000 };
    mock.onGet('https://api1.com?member_id=1').reply(200, dataUrl1);
    mock.onGet('https://api2.com?member_id=1').reply(200, dataUrl2);
    mock.onGet('https://api3.com?member_id=1').reply(200, dataUrl3);

    const result = await getCoalesce(1);
    // eslint-disable-next-line max-len
    expect(result).toEqual({ deductible: 1667, stop_loss: 10000, oop_max: 5000 });
  });
  test('Testing maximum result', async () => {
    process.env.STRATEGY = 'maximum';

    const mock = new MockAdapter(axios);
    const dataUrl1 = { deductible: 1000, stop_loss: 10000, oop_max: 5000 };
    const dataUrl2 = { deductible: 1500, stop_loss: 10000, oop_max: 5000 };
    const dataUrl3 = { deductible: 2000, stop_loss: 10000, oop_max: 5000 };
    mock.onGet('https://api1.com?member_id=1').reply(200, dataUrl1);
    mock.onGet('https://api2.com?member_id=1').reply(200, dataUrl2);
    mock.onGet('https://api3.com?member_id=1').reply(200, dataUrl3);

    const result = await getCoalesce(1);
    // eslint-disable-next-line max-len
    expect(result).toEqual({ deductible: 2000, stop_loss: 10000, oop_max: 5000 });
  });
  test('Testing minum result', async () => {
    process.env.STRATEGY = 'minimum';

    const mock = new MockAdapter(axios);
    const dataUrl1 = { deductible: 1000, stop_loss: 10000, oop_max: 5000 };
    const dataUrl2 = { deductible: 1500, stop_loss: 10000, oop_max: 5000 };
    const dataUrl3 = { deductible: 2000, stop_loss: 10000, oop_max: 5000 };
    mock.onGet('https://api1.com?member_id=1').reply(200, dataUrl1);
    mock.onGet('https://api2.com?member_id=1').reply(200, dataUrl2);
    mock.onGet('https://api3.com?member_id=1').reply(200, dataUrl3);

    const result = await getCoalesce(1);
    // eslint-disable-next-line max-len
    expect(result).toEqual({ deductible: 1000, stop_loss: 10000, oop_max: 5000 });
  });
});
