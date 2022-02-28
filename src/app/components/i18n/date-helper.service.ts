/*
 * @Author: zhangshaolong
 * @Date: 2022-03-04 06:22:44
 */
import { formatDate } from '@angular/common';
import { Inject, Injectable, Injector, Optional } from '@angular/core';

import {
  format as fnsFormat,
  getISOWeek as fnsGetISOWeek,
  parse as fnsParse,
} from 'date-fns';

import { WeekDayIndex, ɵNgTimeParser } from '../core/time';

import { mergeDateConfig, NzDateConfig, NZ_DATE_CONFIG } from './date-config';
import { NzI18nService } from './nz-i18n.service';

export function DATE_HELPER_SERVICE_FACTORY(
  injector: Injector,
  config: NzDateConfig
): DateHelperService {
  const i18n = injector.get(NzI18nService);
  return new DateHelperByDatePipe(i18n, config);
}

@Injectable({
  providedIn: 'root',
  useFactory: DATE_HELPER_SERVICE_FACTORY,
  deps: [Injector, [new Optional(), NZ_DATE_CONFIG]],
})
export abstract class DateHelperService {
  constructor(
    protected i18n: NzI18nService,
    @Optional() @Inject(NZ_DATE_CONFIG) protected config: NzDateConfig
  ) {
    this.config = mergeDateConfig(this.config);
  }

  abstract getISOWeek(date: Date): number;
  abstract getFirstDayOfWeek(): WeekDayIndex;
  abstract format(date: Date | null, formatStr: string): string;
  abstract parseDate(text: string, formatStr?: string): Date;
  abstract parseTime(text: string, formatStr?: string): Date | undefined;
}

export class DateHelperByDatePipe extends DateHelperService {
  getISOWeek(date: Date): number {
    return +this.format(date, 'w');
  }

  getFirstDayOfWeek(): WeekDayIndex {
    if (this.config.firstDayOfWeek === undefined) {
      const locale = this.i18n.getLocaleId();
      return locale && ['zh-cn', 'zh-tw'].indexOf(locale.toLowerCase()) > -1
        ? 1
        : 0;
    }
    return this.config.firstDayOfWeek;
  }

  format(date: Date | null, formatStr: string): string {
    return date ? formatDate(date, formatStr, this.i18n.getLocaleId())! : '';
  }

  parseDate(text: string): Date {
    return new Date(text);
  }

  parseTime(text: string, formatStr: string): Date {
    const parser = new ɵNgTimeParser(formatStr, this.i18n.getLocaleId());
    return parser.toDate(text);
  }
}
