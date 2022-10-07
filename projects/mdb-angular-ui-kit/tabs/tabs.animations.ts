import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  style,
  transition,
  trigger,
  animation,
  useAnimation,
} from '@angular/animations';

export function fadeInAnimation(): AnimationTriggerMetadata {
  return trigger('fadeIn', [
    transition('0 => 1', [
      useAnimation(
        animation(
          [
            animate(
              '500ms 0ms',
              keyframes([style({ opacity: 0, offset: 0 }), style({ opacity: 1, offset: 1 })])
            ),
          ],
          {
            delay: 0,
          }
        )
      ),
    ]),
  ]);
}
