/*
 * @Author: zhangshaolong
 * @Date: 2022-01-27 17:36:11
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
@Component({
  selector: 'app-fixed-widgets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="
    position: fixed;
    right: 32px;
    bottom: 102px;
    z-index: 2147483640;
    display: flex;
    flex-direction: column;
    cursor: pointer;"
      class="fixed-widgets"
    >
      <div
        class="z-avatar z-avatar-circle z-avatar-icon fixed-widgets-avatar"
        style="width: 44px; height: 44px; line-height: 44px; font-size: 22px;"
        z-dropdown
        [zDropdownMenu]="menu"
      >
        <theming-icon></theming-icon>
        <z-dropdown-menu #menu="zDropdownMenu">
          <ul z-menu nzSelectable>
            <li z-menu-item (click)="onThemeChange('default')">
              {{ language === 'zh' ? '默认主题' : 'Default' }}
            </li>
            <li z-menu-item (click)="onThemeChange('dark')">
              {{ language === 'zh' ? '暗黑主题' : 'Dark Theme' }}
            </li>
            <li z-menu-item (click)="onThemeChange('compact')">
              {{ language === 'zh' ? '紧凑主题' : 'Compact Theme' }}
            </li>
            <li z-menu-item (click)="onThemeChange('aliyun')">
              {{ language === 'zh' ? '阿里云主题' : 'Aliyun Theme' }}
            </li>
          </ul>
        </z-dropdown-menu>
      </div>
    </div>
  `,
})
export class FixedWidgetsComponent {
  compact = false;
  @Input() theme: string = 'default';
  @Input() language: string = 'zh';
  @Output() readonly themeChange = new EventEmitter<string>();

  onThemeChange(theme: string): void {
    this.theme = theme;
    this.themeChange.emit(theme);
  }
}
