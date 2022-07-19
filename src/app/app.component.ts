/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 10:14:13
 */
/* eslint-disable */
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ROUTE_LIST } from './route';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, debounceTime, switchMap } from 'rxjs/operators';

interface DocPageMeta {
  path: string;
  label: string;
  order?: number;
  zh: string;
  description: string;
}

type SiteTheme = 'default' | 'dark' | 'compact' | 'aliyun';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  randomUserUrl = 'https://api.randomuser.me/?results=5';
  searchChange$ = new BehaviorSubject('');
  optionList: string[] = [];
  selectedUser?: string;
  isLoading = false;

  onSearch(value: string): void {
    this.isLoading = true;
    this.searchChange$.next(value);
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const getRandomNameList = (name: string): Observable<any> =>
      this.http
        .get(`${this.randomUserUrl}`)
        .pipe(
          catchError(() => of({ results: [] })),
          map((res: any) => res.results)
        )
        .pipe(map((list: any) => list.map((item: any) => `${item.name.first} ${name}`)));
    const optionList$: Observable<string[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      this.optionList = data;
      this.isLoading = false;
    });
  }
}
