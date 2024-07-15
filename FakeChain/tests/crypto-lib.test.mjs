import { describe, it, expect } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Hashing', () => {
  it('should produce a hash with supplied arguments', () => {
    expect(createHash('bitcoin', 'ethereum')).toEqual(
      createHash('bitcoin', 'ethereum')
    );
  });

  it('should produce a hash with supplied arguments in any order', () => {
    expect(createHash('bitcoin', 'ethereum')).toEqual(
      createHash('ethereum', 'bitcoin')
    );
  });

  it('should create a unique hash when any property have changed', () => {
    const obj = {};
    const orginalHash = createHash(obj);
    obj['name'] = 'FALSE';

    expect(createHash(obj)).not.toEqual(orginalHash);
  });
});
