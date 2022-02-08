/*
 * @Author: zhangshaolong
 * @Date: 2022-02-02 18:23:47
 */
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  FlexibleConnectedPositionStrategyOrigin
} from '@angular/cdk/overlay';
import { Directive, ElementRef, Input } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { ZDestroyService } from '../services';
import { InputBoolean } from '../util';

import { getPlacementName } from './overlay-position';

type Dimensions = Omit<ClientRect, 'x' | 'y' | 'toJSON'>;
@Directive({
  selector: '[cdkConnectedOverlay][nzConnectedOverlay]',
  exportAs: 'zConnectedOverlay',
  providers: [ZDestroyService]
})
export class ZConnectedOverlayDirective {
  @Input() @InputBoolean() zArrowPointAtCenter: boolean = false;


  constructor(
    private readonly cdkConnectedOverlay: CdkConnectedOverlay,
    private readonly zDestroyService: ZDestroyService
  ) {
    this.cdkConnectedOverlay.backdropClass = 'z-overlay-transparent-backdrop';

    this.cdkConnectedOverlay.positionChange
      .pipe(takeUntil(this.zDestroyService))
      .subscribe((position: ConnectedOverlayPositionChange) => {
        if (this.zArrowPointAtCenter) {
          this.updateArrowPosition(position);
        }
      });
  }

  private updateArrowPosition(position: ConnectedOverlayPositionChange): void {
    const originRect = this.getOriginRect();
    const placement = getPlacementName(position);

    let offsetX: number | undefined = 0;
    let offsetY: number | undefined = 0;

    if (placement === 'topLeft' || placement === 'bottomLeft') {
      offsetX = originRect.width / 2 - 14;
    } else if (placement === 'topRight' || placement === 'bottomRight') {
      offsetX = -(originRect.width / 2 - 14);
    } else if (placement === 'leftTop' || placement === 'rightTop') {
      offsetY = originRect.height / 2 - 10;
    } else if (placement === 'leftBottom' || placement === 'rightBottom') {
      offsetY = -(originRect.height / 2 - 10);
    }

    if (this.cdkConnectedOverlay.offsetX !== offsetX || this.cdkConnectedOverlay.offsetY !== offsetY) {
      this.cdkConnectedOverlay.offsetY = offsetY;
      this.cdkConnectedOverlay.offsetX = offsetX;
      this.cdkConnectedOverlay.overlayRef.updatePosition();
    }
  }

  private getFlexibleConnectedPositionStrategyOrigin(): FlexibleConnectedPositionStrategyOrigin {
    if (this.cdkConnectedOverlay.origin instanceof CdkOverlayOrigin) {
      return this.cdkConnectedOverlay.origin.elementRef;
    } else {
      return this.cdkConnectedOverlay.origin;
    }
  }

  private getOriginRect(): Dimensions {
    const origin = this.getFlexibleConnectedPositionStrategyOrigin();

    if (origin instanceof ElementRef) {
      return origin.nativeElement.getBoundingClientRect();
    }

    // Check for Element so SVG elements are also supported.
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }

    const width = origin.width || 0;
    const height = origin.height || 0;

    // If the origin is a point, return a client rect as if it was a 0x0 element at the point.
    return {
      top: origin.y,
      bottom: origin.y + height,
      left: origin.x,
      right: origin.x + width,
      height,
      width
    };
  }
}
