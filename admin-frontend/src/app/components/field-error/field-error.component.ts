import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-field-error',
	standalone: true,
	imports: [ CommonModule ],
	templateUrl: './field-error.component.html',
	styleUrl: './field-error.component.sass'
})

export class FieldErrorComponent {

	@Input() inputName: string = '';
	@Input() field: any = {};
	@Input() debugShow: boolean = false;


    getText(errors: any): string {
        if (!errors) return '';
    
        if (errors.required) return 'This field is required';
        if (errors.minlength?.requiredLength) return 'Must enter at least ' + errors.minlength.requiredLength + ' characters';
        if (errors.maxLength?.requiredLength) return 'Must enter maximum ' + errors.maxLength.requiredLength + ' characters';
        if (errors.maxlength) return 'Must enter less than 50 characters';
        if (errors.email) return 'Must enter a valid email';
    
        if (errors.match) return 'Passwords do not match';
        if (errors?.['match']) return 'Passwords do not match';
        
        return 'Error';
    }
}
