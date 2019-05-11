import { Directive, Input } from '@angular/core';
import { EffectDispatchInterface } from '../interfaces';
import { FormEffects } from '../models';

@Directive({
  selector: '[formEffects]'
})
export class FormEffectsDirective {

  /**
   * Holds the formEffects instance
   */
  @Input()
  formEffects: FormEffects;

  /**
   * When executed, updates the predicate result for provided key
   * array, and optionally passes the new form control value
   */
  notify(effectDispatch: EffectDispatchInterface): void {

    if (!this.formEffects) {
      throw new Error('A FormEffects instance must be provided to update values');
    }

    if (!effectDispatch) {
      throw new Error(`Can't execute update if EffectDispatch is not provided`);
    }

    this.formEffects.update(effectDispatch);
  }

}
