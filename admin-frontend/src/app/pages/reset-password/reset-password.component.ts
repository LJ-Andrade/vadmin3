import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import { DataService } from '@src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '@src/environments/environment';

@Component({
	selector: 'app-login',
	standalone: true,
	// imports: [ CommonModule, HttpClientModule, PanelComponent, ReactiveFormsModule, LoadingComponent, InputErrorComponent ],
	templateUrl: './reset-password.component.html',
	styleUrls: ['../login/login.component.sass']
})

export class ResetPasswordComponent implements OnInit {
	// private dataService = inject(DataService)
	private currentRoute: ActivatedRoute = inject(ActivatedRoute)
	private router: Router = inject(Router)
	// private notificationService: NotificationService = inject(NotificationService)

	protected resetToken: string | null = null

	protected resetPasswordForm: FormGroup = new FormGroup({});

	protected loading: boolean = false
	protected showSuccessMessage: boolean = false

	constructor() {
		this.resetToken = this.currentRoute.snapshot.queryParamMap.get('token');
	}

	ngOnInit(): void {

		this.resetPasswordForm = new FormGroup({
			token: new FormControl(this.resetToken, [Validators.required]),
			email: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
			password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(6)]),
		},
		{ validators: this.stringMatch('password', 'password_confirmation') })

	}

	OnFormSubmit() {
		this.sendResetPassword()
	}

	sendResetPassword() {
		this.loading = true


		// this.dataService.httpPost(environment.apiUrl + 'password/reset', this.resetPasswordForm.value)
		// .subscribe({
		// 	next: (res: any) => {
		// 		this.showSuccessMessage = true
		// 		this.router.navigate(['/login'])
		// 	},
		// 	error: (error: any) => {
		// 		console.log(error);
		// 		this.notificationService.error('Ups!', 'Ha ocurrido un error. <br> Tal vez su email no existe en nuestra base de datos o deba volver a generar una nueva solicitud de restablecimiento de contraseña ');
		// 		this.showSuccessMessage = false
		// 	},
		// 	complete: () => {
		// 		this.loading = false
		// 	}
		// })
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

