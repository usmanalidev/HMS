import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  OperatorFunction,
} from 'rxjs';

/**
 * LEARNING: RxJS operators are pure functions that transform Observables.
 *
 * Extracting common operator chains into helpers keeps components thin and guarantees
 * consistent search behavior (debounce + trim + ignore empty queries).
 *
 * Usage in a component:
 *   this.searchControl.valueChanges.pipe(
 *     debounceSearch(300),
 *     switchMap(term => this.api.search(term)),
 *   ).subscribe(...);
 */

export interface DebounceSearchOptions {
  /** Wait time in ms before emitting (default: 300). */
  debounceMs?: number;
  /** Minimum trimmed length before emitting (default: 0 = allow empty). */
  minLength?: number;
  /** When true, empty string still emits after debounce (useful for "clear search"). */
  emitEmpty?: boolean;
}

/**
 * Debounces, trims, deduplicates, and optionally filters short search strings.
 */
export function debounceSearch(
  debounceMsOrOptions: number | DebounceSearchOptions = 300,
): OperatorFunction<string | null | undefined, string> {
  const options: DebounceSearchOptions =
    typeof debounceMsOrOptions === 'number'
      ? { debounceMs: debounceMsOrOptions }
      : debounceMsOrOptions;

  const debounceMs = options.debounceMs ?? 300;
  const minLength = options.minLength ?? 0;
  const emitEmpty = options.emitEmpty ?? true;

  return (source$) =>
    source$.pipe(
      debounceTime(debounceMs),
      map((value) => (value ?? '').trim()),
      distinctUntilChanged(),
      filter((term) => {
        if (term.length === 0) {
          return emitEmpty;
        }
        return term.length >= minLength;
      }),
    );
}
