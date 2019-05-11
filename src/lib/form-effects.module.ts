import { NgModule } from '@angular/core';
import { FormEffectsDirective, FormEffectNameDirective } from './directives';

@NgModule({
  declarations: [
    FormEffectNameDirective,
    FormEffectsDirective
  ],
  exports: [
    FormEffectNameDirective,
    FormEffectsDirective
  ]
})
export class FormEffectsModule { }
