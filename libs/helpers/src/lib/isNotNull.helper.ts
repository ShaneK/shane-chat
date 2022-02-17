/**
 * Necessary for `filter` if we wanna filter out not null things with rxjs and let the next
 * piped operator know there are no nulls. Just a work around for a bug in rxjs 7.
 * @param t
 */
export function isNotNull<T>(t: T | null): t is T {
  return t !== null;
}

export function isNotNullOrUndefined<T>(t: T | null | undefined): t is T {
  return t != null;
}
