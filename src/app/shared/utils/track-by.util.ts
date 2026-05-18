/**
 * LEARNING: *ngFor (and @for) reuses DOM nodes when trackBy identifies stable rows.
 *
 * Without trackBy, Angular destroys and recreates every row when the array reference
 * changes — expensive for tables and lists. Always track by a unique id from your API.
 *
 * Usage:
 *   @for (patient of patients; track trackById($index, patient)) { ... }
 *   *ngFor="let row of rows; trackBy: trackById"
 */

export type TrackByFn<T> = (index: number, item: T) => string | number;

/** Track list items by their `id` field (string or number). */
export function trackById<T extends { id: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?.id ?? index;
}

/** Track by `_id` (common in Mongo-style APIs). */
export function trackByMongoId<T extends { _id: string | number }>(
  index: number,
  item: T,
): string | number {
  return item?._id ?? index;
}

/** Track by an arbitrary key on the row object. */
export function trackByProperty<T extends Record<string, unknown>>(
  key: keyof T & string,
): TrackByFn<T> {
  return (index: number, item: T) => {
    const value = item?.[key];
    return (typeof value === 'string' || typeof value === 'number') ? value : index;
  };
}

/** Fallback: track by index (use only when items lack stable ids). */
export function trackByIndex(index: number): number {
  return index;
}
