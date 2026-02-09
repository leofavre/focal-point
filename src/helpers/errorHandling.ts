type Err<R extends string> = { reason: R };

export type Result<A, R extends string> =
  | { accepted: A; rejected?: never }
  | { accepted?: never; rejected: Err<R> };

export function accept<A>(accepted: A): Result<A, never> {
  return { accepted };
}

export function reject<R extends string>(rejected: Err<R>): Result<never, R> {
  return { rejected };
}

export function processResults<A, R extends string>(
  results: Result<A, R>[],
): { accepted: A[]; rejected: Err<R>[] } {
  const { accepted, rejected } = results.reduce(
    (acc, result) => {
      if (result.accepted !== undefined) {
        acc.accepted.push(result.accepted);
      } else if (result.rejected !== undefined) {
        acc.rejected.push(result.rejected);
      }
      return acc;
    },
    { accepted: [] as A[], rejected: [] as Err<R>[] },
  );

  return { accepted, rejected };
}
