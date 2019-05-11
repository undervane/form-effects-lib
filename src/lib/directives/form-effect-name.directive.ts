import { debounceTime, takeWhile, distinctUntilChanged } from 'rxjs/operators';
import { FormEffectsDirective } from './form-effects.directive';
import { Directive, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[formEffectName]' })
export class FormEffectNameDirective implements OnDestroy {

    /**
     * Setter for effect key names
     */
    @Input()
    set formEffectName(keys: string | string[]) {
        this.setupEffectKeys(keys);
        this.subscribeToFormControl();
    }

    /**
     * Holds all keys for effect
     */
    private effectKeys: string[] = [];

    /**
     * Holds the subscription for
     * the form control value changes
     */
    private controlSubscription: Subscription;

    /**
     * Flag to check if component
     * still exists in DOM
     */
    private isAlive = true;

    /**
     * Creates an instance of FormEffectNameDirective
     */
    constructor(
        private formEffectsDirective: FormEffectsDirective,
        private formControl: NgControl
    ) { }

    /**
     * Angular destroy lifecycle hook
     */
    ngOnDestroy(): void {
        this.isAlive = false;
    }

    /**
     * Executes logic to subscribe to form control value
     * changes, and notify parent form effect of any modification
     */
    private subscribeToFormControl(): void {

        if (this.controlSubscription || !this.formControl) {
            return;
        }

        this.controlSubscription = this.formControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                debounceTime(200),
                takeWhile(() => this.isAlive)
            )
            .subscribe(
                value => this.formEffectsDirective.notify({ keys: this.effectKeys, value })
            );
    }

    /**
     * Sets the effect keys from array or string
     */
    private setupEffectKeys(keys: string | string[]) {
        Array.isArray(keys) ? this.effectKeys = keys : this.effectKeys.push(keys);
    }

}
