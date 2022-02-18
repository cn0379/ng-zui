/*
 * @Author: zhangshaolong
 * @Date: 2022-02-17 14:59:43
 */
import { ZSafeAny } from './any';

export type NgClassType = string | string[] | Set<string> | NgClassInterface;


export interface NgClassInterface {
  [klass: string]: ZSafeAny;
}

export interface NgStyleInterface {
  [klass: string]: ZSafeAny;
}
