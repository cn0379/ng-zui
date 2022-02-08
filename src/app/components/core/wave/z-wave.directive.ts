/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:22:13
 */

import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  PLATFORM_ID
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

import { ZSafeAny } from '../types';
import { ZWaveRenderer } from './z-wave-renderer';

export interface ZWaveConfig {
  disabled?: boolean;
}

export const NZ_WAVE_GLOBAL_DEFAULT_CONFIG: ZWaveConfig = {
  disabled: false
};

export const NZ_WAVE_GLOBAL_CONFIG = new InjectionToken<ZWaveConfig>('nz-wave-global-options', {
  providedIn: 'root',
  factory: NZ_WAVE_GLOBAL_CONFIG_FACTORY
});

export function NZ_WAVE_GLOBAL_CONFIG_FACTORY(): ZWaveConfig {
  return NZ_WAVE_GLOBAL_DEFAULT_CONFIG;
}

@Directive({
  selector: '[z-wave],button[z-button]:not([nzType="link"]):not([nzType="text"])',
  exportAs: 'zWave'
})
export class ZWaveDirective implements OnInit, OnDestroy {
  @Input() nzWaveExtraNode = false;
  private waveRenderer?: ZWaveRenderer;
  private waveDisabled: boolean = false;

  get disabled(): boolean {
    return this.waveDisabled;
  }

  get rendererRef(): ZWaveRenderer | undefined {
    return this.waveRenderer;
  }

  constructor(
    private ngZone: NgZone,
    private elementRef: ElementRef,
    @Optional() @Inject(NZ_WAVE_GLOBAL_CONFIG) private config: ZWaveConfig,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private animationType: string,
    @Inject(PLATFORM_ID) private platformId: ZSafeAny
  ) {
    this.waveDisabled = this.isConfigDisabled();
  }

  isConfigDisabled(): boolean {
    let disabled = false;
    if (this.config && typeof this.config.disabled === 'boolean') {
      disabled = this.config.disabled;
    }
    if (this.animationType === 'NoopAnimations') {
      disabled = true;
    }
    return disabled;
  }

  ngOnDestroy(): void {
    if (this.waveRenderer) {
      this.waveRenderer.destroy();
    }
  }

  ngOnInit(): void {
    this.renderWaveIfEnabled();
  }

  renderWaveIfEnabled(): void {
    if (!this.waveDisabled && this.elementRef.nativeElement) {
      this.waveRenderer = new ZWaveRenderer(
        this.elementRef.nativeElement,
        this.ngZone,
        this.nzWaveExtraNode,
        this.platformId
      );
    }
  }

  disable(): void {
    this.waveDisabled = true;
    if (this.waveRenderer) {
      this.waveRenderer.removeTriggerEvent();
      this.waveRenderer.removeStyleAndExtraNode();
    }
  }

  enable(): void {
    // config priority
    this.waveDisabled = this.isConfigDisabled() || false;
    if (this.waveRenderer) {
      this.waveRenderer.bindTriggerEvent();
    }
  }
}
