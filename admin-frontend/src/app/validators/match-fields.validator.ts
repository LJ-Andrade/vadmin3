import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchToValidator(matchToField: string): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control || !control.parent) return null;

		const thisValue = control.value;
		const otherValue = control.parent.get(matchToField)?.value;

		if (thisValue !== otherValue) {
			return { match: true };
		}

		return null;
	};
}
