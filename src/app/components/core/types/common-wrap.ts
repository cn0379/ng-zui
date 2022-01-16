/*
 * @Author: zhangshaolong
 * @Date: 2022-01-09 17:34:34
 */
import { ZSafeAny } from './any';

export type FunctionProp<T> = (...args: ZSafeAny[]) => T;
