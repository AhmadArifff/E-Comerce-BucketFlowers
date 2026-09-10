import { describe, it, expect } from 'vitest';
import { Result } from '../../src/lib/result.js';

describe('Result<T> Pattern Unit Tests (PRD 14.1)', () => {
  it('should create a successful result with value', () => {
    const data = { id: 'order-123', total: 150000 };
    const result = Result.ok(data);

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeNull();
    expect(result.getValue()).toEqual(data);
  });

  it('should create a successful result without value', () => {
    const result = Result.ok();

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should create a failure result with error message and code', () => {
    const errorMsg = 'Stok bahan baku tidak mencukupi.';
    const errorCode = 'INSUFFICIENT_STOCK';
    const result = Result.fail<string>(errorMsg, errorCode);

    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe(errorMsg);
    expect(result.errorCode).toBe(errorCode);
    expect(() => result.getValue()).toThrowError(/Can't get the value of an error result/);
  });

  it('should combine multiple results and return ok when all succeed', () => {
    const res1 = Result.ok('Step 1 complete');
    const res2 = Result.ok({ count: 42 });
    const res3 = Result.ok(true);

    const combined = Result.combine([res1, res2, res3]);
    expect(combined.isSuccess).toBe(true);
    expect(combined.isFailure).toBe(false);
  });

  it('should combine multiple results and return the first failure', () => {
    const res1 = Result.ok('Step 1 complete');
    const res2 = Result.fail('Step 2 failed: Invalid coupon');
    const res3 = Result.fail('Step 3 failed: Out of stock');

    const combined = Result.combine([res1, res2, res3]);
    expect(combined.isSuccess).toBe(false);
    expect(combined.isFailure).toBe(true);
    expect(combined.error).toBe('Step 2 failed: Invalid coupon');
  });

  it('should enforce immutability (frozen object)', () => {
    const res = Result.ok('initial');
    expect(Object.isFrozen(res)).toBe(true);
    expect(() => {
      (res as any).isSuccess = false;
    }).toThrow();
  });
});
