/*
 * @Author: zhangshaolong
 * @Date: 2022-02-02 10:20:57
 */
import { Direction } from '@angular/cdk/bidi';
import { InjectionToken, TemplateRef, Type } from '@angular/core';

export interface ZConfig {
  popover?: PopoverConfig;
  dropDown?: DropDownConfig;
  button?: ButtonConfig;

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

export type ZConfigKey = keyof ZConfig;


export const Z_CONFIG = new InjectionToken<ZConfig>('z-config');

