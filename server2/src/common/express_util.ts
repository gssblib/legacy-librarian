import qs from 'qs';

/**
 * Returns an expression query parameters as a number.
 */
export function getNumberParam(params: qs.ParsedQs, name: string): number|undefined {
  const param = params[name];
  return typeof (param) === 'string' ? parseInt(param, 10) : undefined;
}

/**
 * Returns an expression query parameters as a boolean.
 */
export function getBooleanParam(params: qs.ParsedQs, name: string): boolean|undefined {
  const param = params[name];
  return param === 'true';
}