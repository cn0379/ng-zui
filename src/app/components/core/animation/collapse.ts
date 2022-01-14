/*
 * @Author: zhangshaolong
 * @Date: 2022-01-14 21:00:00
 */
import {
  animate,
  AnimationTriggerMetadata,
  query,
  stagger,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { AnimationCurves } from './animation-consts';


export const collapseMotion: AnimationTriggerMetadata = trigger('collapseMotion', [
  state('expanded', style({ height: '*' })),
  state('collapsed', style({ height: 0, overflow: 'hidden' })),
  state('hidden', style({ height: 0, overflow: 'hidden', borderTopWidth: '0' })),
  transition('expanded => collapsed', animate(`150ms ${AnimationCurves.EASE_IN_OUT}`)),
  transition('expanded => hidden', animate(`150ms ${AnimationCurves.EASE_IN_OUT}`)),
  transition('collapsed => expanded', animate(`150ms ${AnimationCurves.EASE_IN_OUT}`)),
  transition('hidden => expanded', animate(`150ms ${AnimationCurves.EASE_IN_OUT}`))
]);

