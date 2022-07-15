/*
 * @Author: zhangshaolong
 * @Date: 2022-02-02 10:20:57
 */
import { Direction } from '@angular/cdk/bidi';
import { InjectionToken, TemplateRef, Type } from '@angular/core';
import {
  ZSafeAny,
} from '../types';
export interface ZConfig {
  popover?: PopoverConfig;
  dropDown?: DropDownConfig;
  button?: ButtonConfig;
  timePicker?: TimePickerConfig;
  select?: SelectConfig;
}

export interface ButtonConfig {
  nzSize?: 'large' | 'default' | 'small';
}

export interface PopConfirmConfig {
  zPopconfirmBackdrop?: boolean;
  zAutofocus?: null | 'ok' | 'cancel';
}

export interface DropDownConfig {
  nzBackdrop?: boolean;
}

export interface PopoverConfig {
  zPopoverBackdrop?: boolean;
}

export interface SelectConfig {
  nzBorderless?: boolean;
  nzSuffixIcon?: TemplateRef<ZSafeAny> | string | null;
  nzBackdrop?: boolean;
}

export interface TimePickerConfig {
  nzAllowEmpty?: boolean;
  nzClearText?: string;
  nzNowText?: string;
  nzOkText?: string;
  nzFormat?: string;
  nzHourStep?: number;
  nzMinuteStep?: number;
  nzSecondStep?: number;
  nzPopupClassName?: string;
  nzUse12Hours?: string;
  nzSuffixIcon?: string | TemplateRef<ZSafeAny>;
  nzBackdrop?: boolean;
}

export type ZConfigKey = keyof ZConfig;


export const Z_CONFIG = new InjectionToken<ZConfig>('z-config');

