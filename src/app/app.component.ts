/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 10:14:13
 */
import { Component, OnInit } from '@angular/core';
import { ROUTE_LIST  } from './route'

interface DocPageMeta {
  path: string;
  label: string;
  order?: number;
  zh: string;
  description: string;
}
@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  sideMenuList = ROUTE_LIST;
  componentList: DocPageMeta[] = [];
  language: 'zh' | 'en' = 'zh';

  ngOnInit(): void {
    this.sideMenuList.components.forEach(group => {
      this.componentList = this.componentList.concat([...group.children]);
    });
  }

  nzClick1(){

  }

  zOpenChange() {

  }


}
