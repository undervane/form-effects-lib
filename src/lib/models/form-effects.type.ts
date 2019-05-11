import { OnDestroy } from '@angular/core';

import { takeWhile } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import {
    EffectInterface,
    EffectResultInterface,
    EffectDispatchInterface
} from '../interfaces';

export class FormEffects implements OnDestroy {

    /**
     * Holds the subject for effects subscription
     */
    private readonly effectsSubject = new Subject();

    /**
     * Holds the configuration for effects
     */
    private effects: EffectInterface;

    /**
     * Holds all predicate evaluation results
     */
    private results: EffectResultInterface;

    /**
     * Flag to check if component
     * still exists in DOM
     */
    private isAlive = true;

    /**
     * Creates an instance of FormEffects
     */
    constructor(effects: EffectInterface) {

        this.effects = effects;
        this.results = {};

        this.subscription
            .pipe(
                takeWhile(() => this.isAlive)
            )
            .subscribe(
                effect => this.update(effect)
            );
    }

    /**
     * Angular destroy lifecycle hook
     */
    ngOnDestroy(): void {
        this.isAlive = false;
    }

    get subscription(): Observable<any> {
        return this.effectsSubject.asObservable();
    }

    /**
     * Getter for predicate results
     */
    get(key: string): any {

        if (!this.results) {
            return;
        }

        return this.results[key];
    }

    /**
     * Alerts the subscribers of
     * new form control change
     */
    notify(effect: EffectInterface): void {
        this.effectsSubject.next(effect);
    }

    /**
     * Takes predicate functions from
     * effects and save states to values
     */
    update(effectDispatch: EffectDispatchInterface): void {

        if (!effectDispatch) {
            throw new Error('An effect dispatch must be provided to update values');
        }

        effectDispatch.keys.forEach(
            key => this.updateResultForKey(key, effectDispatch.value)
        );
    }

    /**
     * Takes a key and updates the result
     * for the provided predicate function
     */
    private updateResultForKey(key: string, value: any): void {

        const predicate = this.effects[key];

        if (!predicate) {
            console.warn(`No predicate was found for key: ${key}`);
            return;
        }

        this.results[key] = predicate(value);
    }

}
