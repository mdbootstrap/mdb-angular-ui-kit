import { Validator, AbstractControl } from '@angular/forms';
export declare class EqualValidatorDirective implements Validator {
    validateEqual: string;
    reverse: string;
    constructor(validateEqual: string, reverse: string);
    private readonly isReverse;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
