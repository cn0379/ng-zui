/*
 * @Author: zhangshaolong
 * @Date: 2022-03-03 05:37:51
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import { CdkOverlayOrigin, ConnectionPositionPair } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { isValid } from 'date-fns';

import { slideMotion } from '../core/animation';
import { ZConfigKey, ZConfigService, WithConfig } from '../core/config';
import { BooleanInput, ZSafeAny } from '../core/types';
import { InputBoolean, isNil } from '../core/util';

const NZ_CONFIG_MODULE_NAME: ZConfigKey = 'timePicker';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'nz-time-picker',
  exportAs: 'nzTimePicker',
  template: `
    <div class="z-picker-input">
      <input
        #inputElement
        [attr.id]="nzId"
        type="text"
        [size]="inputSize"
        autocomplete="off"
        [placeholder]="nzPlaceHolder || (i18nPlaceHolder$ | async)"
        [(ngModel)]="inputValue"
        [disabled]="nzDisabled"
        (focus)="onFocus(true)"
        (blur)="onFocus(false)"
        (keyup.enter)="onKeyupEnter()"
        (keyup.escape)="onKeyupEsc()"
        (ngModelChange)="onInputChange($event)"
      />
      <span class="z-picker-suffix">
        <ng-container *nzStringTemplateOutlet="nzSuffixIcon; let suffixIcon">
          <i>@</i>
        </ng-container>
      </span>
      <span
        *ngIf="nzAllowEmpty && !nzDisabled && value"
        class="z-picker-clear"
        (click)="onClickClearBtn($event)"
      >
        <i
          nz-icon
          nzType="close-circle"
          nzTheme="fill"
          [attr.aria-label]="nzClearText"
          [attr.title]="nzClearText"
        ></i>
      </span>
    </div>

    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="nzBackdrop"
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="nzOpen"
      [cdkConnectedOverlayTransformOriginOn]="'.z-picker-dropdown'"
      (detach)="close()"
      (overlayOutsideClick)="onClickOutside($event)"
    >
      <div [@slideMotion]="'enter'" class="z-picker-dropdown" style="position: relative">
        <div class="z-picker-panel-container">
          <div tabindex="-1" class="z-picker-panel">
            <nz-time-picker-panel
              [ngClass]="nzPopupClassName"
              [format]="nzFormat"
              [nzHourStep]="nzHourStep"
              [nzMinuteStep]="nzMinuteStep"
              [nzSecondStep]="nzSecondStep"
              [nzDisabledHours]="nzDisabledHours"
              [nzDisabledMinutes]="nzDisabledMinutes"
              [nzDisabledSeconds]="nzDisabledSeconds"
              [nzPlaceHolder]="nzPlaceHolder || (i18nPlaceHolder$ | async)"
              [nzHideDisabledOptions]="nzHideDisabledOptions"
              [nzUse12Hours]="nzUse12Hours"
              [nzDefaultOpenValue]="nzDefaultOpenValue"
              [nzAddOn]="nzAddOn"
              [nzClearText]="nzClearText"
              [nzNowText]="nzNowText"
              [nzOkText]="nzOkText"
              [nzAllowEmpty]="nzAllowEmpty"
              [(ngModel)]="value"
              (ngModelChange)="onPanelValueChange($event)"
              (closePanel)="setCurrentValueAndClose()"
            ></nz-time-picker-panel>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  host: {
    class: 'z-picker',
    '[class.z-picker-large]': `nzSize === 'large'`,
    '[class.z-picker-small]': `nzSize === 'small'`,
    '[class.z-picker-disabled]': `nzDisabled`,
    '[class.z-picker-focused]': `focused`,
    '[class.z-picker-rtl]': `dir === 'rtl'`,
    '(click)': 'open()',
  },
  animations: [slideMotion],
})
export class NzTimePickerComponent {
  readonly _nzModuleName: ZConfigKey = NZ_CONFIG_MODULE_NAME;

  static ngAcceptInputType_nzUse12Hours: BooleanInput;
  static ngAcceptInputType_nzHideDisabledOptions: BooleanInput;
  static ngAcceptInputType_nzAllowEmpty: BooleanInput;
  static ngAcceptInputType_nzDisabled: BooleanInput;
  static ngAcceptInputType_nzAutoFocus: BooleanInput;

  private _onChange?: (value: Date | null) => void;
  private _onTouched?: () => void;
  private destroy$ = new Subject<void>();
  isInit = false;
  focused = false;
  inputValue: string = '';
  value: Date | null = null;
  preValue: Date | null = null;
  origin!: CdkOverlayOrigin;
  inputSize?: number;
  i18nPlaceHolder$: Observable<string | undefined> = of(undefined);
  overlayPositions: ConnectionPositionPair[] = [
    {
      offsetY: 3,
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      offsetY: -3,
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    },
    {
      offsetY: 3,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      offsetY: -3,
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
    },
  ] as ConnectionPositionPair[];
  dir: Direction = 'ltr';

  @ViewChild('inputElement', { static: true })
  inputRef!: ElementRef<HTMLInputElement>;
  @Input() nzId: string | null = null;
  @Input() nzSize: string | null = null;
  @Input() @WithConfig() nzHourStep: number = 1;
  @Input() @WithConfig() nzMinuteStep: number = 1;
  @Input() @WithConfig() nzSecondStep: number = 1;
  @Input() @WithConfig() nzClearText: string = 'clear';
  @Input() @WithConfig() nzNowText: string = '';
  @Input() @WithConfig() nzOkText: string = '';
  @Input() @WithConfig() nzPopupClassName: string = '';
  @Input() nzPlaceHolder = '';
  @Input() nzAddOn?: TemplateRef<void>;
  @Input() nzDefaultOpenValue?: Date;
  @Input() nzDisabledHours?: () => number[];
  @Input() nzDisabledMinutes?: (hour: number) => number[];
  @Input() nzDisabledSeconds?: (hour: number, minute: number) => number[];
  @Input() @WithConfig() nzFormat: string = 'HH:mm:ss';
  @Input() nzOpen = false;
  @Input() @WithConfig() @InputBoolean() nzUse12Hours: boolean = false;
  @Input() @WithConfig() nzSuffixIcon: string | TemplateRef<ZSafeAny> =
    'clock-circle';

  @Output() readonly nzOpenChange = new EventEmitter<boolean>();

  @Input() @InputBoolean() nzHideDisabledOptions = false;
  @Input() @WithConfig() @InputBoolean() nzAllowEmpty: boolean = true;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzAutoFocus = false;
  @Input() @WithConfig() nzBackdrop = false;

  emitValue(value: Date | null): void {
    this.setValue(value, true);

    if (this._onChange) {
      this._onChange(this.value);
    }

    if (this._onTouched) {
      this._onTouched();
    }
  }

  setValue(value: Date | null, syncPreValue: boolean = false): void {
    if (syncPreValue) {
      this.preValue = isValid(value) ? new Date(value!) : null;
    }
    this.value = isValid(value) ? new Date(value!) : null;
    // this.inputValue = this.dateHelper.format(value, this.nzFormat);
    this.cdr.markForCheck();
  }

  open(): void {
    if (this.nzDisabled || this.nzOpen) {
      return;
    }
    this.focus();
    this.nzOpen = true;
    this.nzOpenChange.emit(this.nzOpen);
  }

  close(): void {
    this.nzOpen = false;
    this.cdr.markForCheck();
    this.nzOpenChange.emit(this.nzOpen);
  }

  updateAutoFocus(): void {
    if (this.isInit && !this.nzDisabled) {
      if (this.nzAutoFocus) {
        this.renderer.setAttribute(
          this.inputRef.nativeElement,
          'autofocus',
          'autofocus'
        );
      } else {
        this.renderer.removeAttribute(this.inputRef.nativeElement, 'autofocus');
      }
    }
  }

  onClickClearBtn(event: MouseEvent): void {
    event.stopPropagation();
    // this.emitValue(null);
  }

  onClickOutside(event: MouseEvent): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.setCurrentValueAndClose();
    }
  }

  onFocus(value: boolean): void {
    this.focused = value;
    if (!value) {
      if (this.checkTimeValid(this.value)) {
        this.setCurrentValueAndClose();
      } else {
        this.setValue(this.preValue);
        this.close();
      }
    }
  }

  focus(): void {
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.focus();
    }
  }

  blur(): void {
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.blur();
    }
  }

  onKeyupEsc(): void {
    // this.setValue(this.preValue);
  }

  onKeyupEnter(): void {
    if (this.nzOpen && isValid(this.value)) {
      // this.setCurrentValueAndClose();
    } else if (!this.nzOpen) {
      this.open();
    }
  }

  onInputChange(str: string): void {
    if (
      !this.platform.TRIDENT &&
      document.activeElement === this.inputRef.nativeElement
    ) {
      this.open();
      this.parseTimeString(str);
    }
  }

  onPanelValueChange(value: Date): void {
    // this.setValue(value);
    this.focus();
  }

  setCurrentValueAndClose(): void {
    // this.emitValue(this.value);
    // this.close();
  }

  parseTimeString(str: string): void {
    // const value = this.dateHelper.parseTime(str, this.nzFormat) || null;
    // if (isValid(value)) {
    //   this.value = value;
    //   this.cdr.markForCheck();
    // }
  }

  constructor(
    public zConfigService: ZConfigService,
    private element: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private platform: Platform,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('nzHourStep', this.nzHourStep);
    this.inputSize = Math.max(8, this.nzFormat.length) + 2;
    this.origin = new CdkOverlayOrigin(this.element);

    this.dir = this.directionality.value;
    this.directionality.change
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((direction: Direction) => {
        this.dir = direction;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    // const { nzUse12Hours, nzFormat, nzDisabled, nzAutoFocus } = changes;
    // if (nzUse12Hours && !nzUse12Hours.previousValue && nzUse12Hours.currentValue && !nzFormat) {
    //   this.nzFormat = 'h:mm:ss a';
    // }
  }

  private checkTimeValid(value: Date | null): boolean {
    if (!value) {
      return true;
    }

    const disabledHours = this.nzDisabledHours?.();
    const disabledMinutes = this.nzDisabledMinutes?.(value.getHours());
    const disabledSeconds = this.nzDisabledSeconds?.(
      value.getHours(),
      value.getMinutes()
    );

    return !(
      disabledHours?.includes(value.getHours()) ||
      disabledMinutes?.includes(value.getMinutes()) ||
      disabledSeconds?.includes(value.getSeconds())
    );
  }
}
