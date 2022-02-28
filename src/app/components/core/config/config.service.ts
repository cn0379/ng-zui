/*
 * @Author: zhangshaolong
 * @Date: 2022-02-02 10:21:11
 */
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import { ZSafeAny } from '../types';

import { ZConfig, ZConfigKey, Z_CONFIG } from './config';

const isDefined = function (value?: ZSafeAny): boolean {
  return value !== undefined;
};

@Injectable({
  providedIn: 'root'
})
export class ZConfigService {
  private configUpdated$ = new Subject<keyof ZConfig>();

  /** Global config holding property. */
  private readonly config: ZConfig;

  constructor(@Optional() @Inject(Z_CONFIG) defaultConfig?: ZConfig) {
    this.config = defaultConfig || {};
  }

  getConfig(): ZConfig {
    return this.config;
  }

  getConfigForComponent<T extends ZConfigKey>(componentName: T): ZConfig[T] {
    return this.config[componentName];
  }

  getConfigChangeEventForComponent(componentName: ZConfigKey): Observable<void> {
    return this.configUpdated$.pipe(
      filter(n => n === componentName),
      mapTo(undefined)
    );
  }

  set<T extends ZConfigKey>(componentName: T, value: ZConfig[T]): void {
    this.config[componentName] = { ...this.config[componentName], ...value };
    this.configUpdated$.next(componentName);
  }
}


export function WithConfig<T>() {
  return function ConfigDecorator(
    target: ZSafeAny,
    propName: ZSafeAny,
    originalDescriptor?: TypedPropertyDescriptor<T>
  ): ZSafeAny {
    const privatePropName = `$$__zorroConfigDecorator__${propName}`;

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true,
      enumerable: false
    });

    return {
      get(): T | undefined {
        const originalValue = originalDescriptor?.get ? originalDescriptor.get.bind(this)() : this[privatePropName];
        const assignedByUser = (this.propertyAssignCounter?.[propName] || 0) > 1;

        const configValue = this.zConfigService.getConfigForComponent(this._nzModuleName)?.[propName];
        if (assignedByUser && isDefined(originalValue)) {
          return originalValue;
        } else {
          return isDefined(configValue) ? configValue : originalValue;
        }
      },
      set(value?: T): void {
        // If the value is assigned, we consider the newly assigned value as 'assigned by user'.
        this.propertyAssignCounter = this.propertyAssignCounter || {};
        this.propertyAssignCounter[propName] = (this.propertyAssignCounter[propName] || 0) + 1;

        if (originalDescriptor?.set) {
          originalDescriptor.set.bind(this)(value!);
        } else {
          this[privatePropName] = value;
        }
      },
      configurable: true,
      enumerable: true
    };
  };
}

