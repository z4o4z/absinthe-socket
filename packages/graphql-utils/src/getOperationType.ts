import type { GqlOperationType } from './types';

const OPERATION_TYPE_REGEX = /^\s*(query|mutation|subscription|\{)/;

const getOperationTypeFromMatched = (matched: string): GqlOperationType =>
  matched === '{' ? 'query' : (matched as GqlOperationType);

/**
 * Returns the type (query, mutation, or subscription) of the given operation
 *
 * @example
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * const operationType = getOperationType(operation);
 *
 * console.log(operationType); // "subscription"
 */
const getOperationType = (operation: string): GqlOperationType => {
  const result = operation.match(OPERATION_TYPE_REGEX);

  if (!result?.[1]) {
    throw new TypeError(`Invalid operation:\n${operation}`);
  }

  return getOperationTypeFromMatched(result[1]);
};

export default getOperationType;
