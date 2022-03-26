import type { GqlError, GqlErrorLocation } from './types';

const locationsToString = (locations: GqlErrorLocation[]) =>
  locations.map(({ column, line }) => `${line}:${column}`).join('; ');

const errorToString = ({ message, locations }: GqlError) =>
  message + (locations ? ` (${locationsToString(locations)})` : '');

/**
 * Transforms an array of GqlError into a string.
 *
 * @example
 * const gqlResponse = {
 *   errors: [
 *     {message: "First Error", locations: [{column: 10, line: 2}]},
 *     {message: "Second Error", locations: [{column: 2, line: 4}]}
 *   ]
 * }
 *
 * const error = errorsToString(gqlResponse.errors);
 * // string with the following:
 * // First Error (2:10)
 * // Second Error (4:2)
 */
const errorsToString = (gqlErrors: GqlError[]): string => gqlErrors.map(errorToString).join('\n');

export default errorsToString;
