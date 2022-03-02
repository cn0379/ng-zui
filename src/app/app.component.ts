/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 10:14:13
 */
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
  sideMenuList = ROUTE_LIST;
  componentList: DocPageMeta[] = [];
  language: 'zh' | 'en' = 'zh';
  theme: any = 'default';
  num = 0;
  time = new Date(0, 0, 1, 1, 1, 2);
  defaultOpenValue = new Date(0, 0, 1, 0, 0, 0);
  nzHourStep = 2;

  constructor(
    private appService: AppService,
    private platform: Platform,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    // tslint:disable-next-line:no-any
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit(): void {
    this.sideMenuList.components.forEach((group) => {
      this.componentList = this.componentList.concat([...group.children]);
    });
  }

  nzClick1() {
    this.num = 9;
    this.nzHourStep = 3;
  }

  zOpenChange() {}

  onThemeChange(theme: string, notification: boolean = true): void {
    if (!this.platform.isBrowser) {
      return;
    }

    this.renderer.addClass(this.document.activeElement, 'preload');
    const successLoaded = () => {
      this.theme = theme as SiteTheme;
      this.appService.theme$.next(theme);
      this.renderer.setAttribute(document.body, 'data-theme', theme);
      localStorage.removeItem('site-theme');
      localStorage.setItem('site-theme', theme);
      ['dark', 'compact', 'aliyun']
        .filter((item) => item !== theme)
        .forEach((item) => {
          const dom = document.getElementById(`site-theme-${item}`);
          if (dom) {
            dom.remove();
          }
        });
      setTimeout(() =>
        this.renderer.removeClass(this.document.activeElement, 'preload')
      );
    };
    if (theme !== 'default') {
      const style = document.createElement('link');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.id = `site-theme-${theme}`;
      style.href = `assets/${theme}.css`;
      style.onload = () => {
        successLoaded();
      };
      document.body.append(style);
    } else {
      successLoaded();
    }
  }
}
