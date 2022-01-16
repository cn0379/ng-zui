/*
 * @Author: zhangshaolong
 * @Date: 2022-01-09 17:30:06
 */
import { coerceBooleanProperty, coerceCssPixelValue, _isNumberValue } from '@angular/cdk/coercion';
import { FunctionProp, ZSafeAny } from '../types';

export function toBoolean(value: boolean | string): boolean {
  return coerceBooleanProperty(value);
}
export function valueFunctionProp<T>(prop: FunctionProp<T> | T, ...args: ZSafeAny[]): T {
  return typeof prop === 'function' ? (prop as FunctionProp<T>)(...args) : prop;
}

function propDecoratorFactory<T, D>(
  name: string,
  fallback: (v: T) => D
): (target: ZSafeAny, propName: string) => void {
  function propDecorator(
    target: ZSafeAny,
    propName: string,
    originalDescriptor?: TypedPropertyDescriptor<ZSafeAny>
  ): ZSafeAny {
    const privatePropName = `$$__zorroPropDecorator__${propName}`;

    if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
      // warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`);
    }

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true
    });

    return {
      get(): string {
        return originalDescriptor && originalDescriptor.get
          ? originalDescriptor.get.bind(this)()
          : this[privatePropName];
      },
      set(value: T): void {
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.bind(this)(fallback(value));
        }
        this[privatePropName] = fallback(value);
      }
    };
  }

  return propDecorator;
}

export function InputBoolean(): ZSafeAny {
  return propDecoratorFactory('InputBoolean', toBoolean);
}

export function toCssPixel(value: number | string): string {
  return coerceCssPixelValue(value);
}
