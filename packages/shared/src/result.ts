/**
 * Result pattern wrapper for standardized error handling without throw/catch overhead.
 * Battle-tested pattern adapted from CrownJobExpiredSupbase.
 */
export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly error: string | null;
  public readonly errorCode?: string;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: string | null, value?: T, errorCode?: string) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result must contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error ?? null;
    this.errorCode = errorCode;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Can't get the value of an error result. Error: ${this.error}`);
    }
    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string, errorCode?: string): Result<U> {
    return new Result<U>(false, error, undefined, errorCode);
  }

  public static combine(results: Result<unknown>[]): Result<unknown> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
