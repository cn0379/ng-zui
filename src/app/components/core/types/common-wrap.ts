/*
 * @Author: zhangshaolong
 * @Date: 2022-01-09 17:34:34
 */
import { NzSafeAny } from './any';

export type FunctionProp<T> = (...args: NzSafeAny[]) => T;
