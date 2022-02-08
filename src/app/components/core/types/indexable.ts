/*
 * @Author: zhangshaolong
 * @Date: 2022-02-03 17:40:20
 */
import { ZSafeAny } from './any';
export interface IndexableObject {
  [key: string]: ZSafeAny;
}
