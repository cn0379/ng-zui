/*
 * @Author: zhangshaolong
 * @Date: 2022-02-17 15:03:04
 */

export function isNotNil<T>(value: T): value is NonNullable<T> {
  return typeof value !== 'undefined' && value !== null;
}
