/**
 * Serialize Prisma objects for passing from Server Components to Client Components.
 *
 * Prisma returns non-JSON-serializable types:
 * - Decimal (for price, lat, lng) → needs to become number
 * - Date (for createdAt, updatedAt, etc.) → needs to become string
 *
 * The simplest and most reliable approach is JSON.parse(JSON.stringify(obj))
 * which automatically handles all conversions.
 */

/**
 * Serialize any object for client component props.
 * Converts Date to ISO string and Decimal to number.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Serialize an array of objects
 */
export function serializeArray<T>(data: T[]): T[] {
  return JSON.parse(JSON.stringify(data));
}

// Convenience aliases for semantic clarity
export const serializeListing = serialize;
export const serializeListings = serializeArray;
export const serializeCategory = serialize;
export const serializeNeighborhood = serialize;
