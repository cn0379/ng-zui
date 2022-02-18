/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 10:14:13
 * @LastEditors: Please set LastEditors
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZUIModule } from './components'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FixedWidgetsModule } from './@shared/fixed-widgets/fixed-widgets.modules';
import {  HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ZUIModule.forRoot(),
    HttpClientModule,
    FixedWidgetsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
