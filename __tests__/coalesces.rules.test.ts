import assert from 'assert';
import { getCoalesce } from '../src/rules/coalesces.rules';

describe('Happy Path', () => {
  test('Testing average result', async () => {
    const result = await getCoalesce(1);
    assert(result, '');
  });
});
