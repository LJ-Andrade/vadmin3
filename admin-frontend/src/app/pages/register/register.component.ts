import { Component, inject } from '@angular/core';

import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import { DataService } from '@src/app/services/data.service';

@Component({
  selector: 'app-register',
  standalone: true,
//   imports: [ CommonModule, HttpClientModule, PanelComponent, ReactiveFormsModule, LoadingComponent, InputErrorComponent ],
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.sass']
})

export class RegisterComponent {
	// authService = inject(AuthService)
	// dataService = inject(DataService)

	registerForm: FormGroup = new FormGroup({});

	ngOnInit(): void {

		this.registerForm = new FormGroup({
			name: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
			email: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
			password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),

		},
			{ validators: this.stringMatch('password', 'password_confirmation') }
			);

	}

	onFormSubmitted() {
		// this.authService.register(this.registerForm.value);
	}

	stringMatch(controlName: string, matchingControlName: string): ValidatorFn {
		return (formGroup: AbstractControl): ValidationErrors | null => {
			const control = (formGroup as FormGroup).controls[controlName];
			const matchingControl = (formGroup as FormGroup).controls[matchingControlName];

			if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
				return null;
			}

			if (control.value !== matchingControl.value) {
				matchingControl.setErrors({ mustMatch: true });
				return { mustMatch: true };
			} else {
				matchingControl.setErrors(null);
				return null;
			}
		}
	}
}
