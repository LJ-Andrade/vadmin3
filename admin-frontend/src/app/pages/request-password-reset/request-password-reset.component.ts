import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '@src/environments/environment';


@Component({
	selector: 'app-login',
	standalone: true,
	// imports: [ CommonModule, HttpClientModule, PanelComponent, ReactiveFormsModule, LoadingComponent, InputErrorComponent, RouterModule ],
	templateUrl: './request-password-reset.component.html',
	styleUrls: ['../login/login.component.sass']
})


export class RequestResetPasswordComponent implements OnInit {

	protected loading: boolean = false
	protected showSuccessMessage: boolean = false
	protected restorePasswordForm: FormGroup = new FormGroup({});


	ngOnInit(): void {

		this.restorePasswordForm = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
		});

	}

	OnFormSubmit() {

		if(!this.restorePasswordForm.valid) {
			this.restorePasswordForm.markAllAsTouched();
			console.log("Error on form ", this.restorePasswordForm)
	
			return
		}

		this.sendPasswordResetEmail()
	}

	sendPasswordResetEmail() {
		this.loading = true


		// this.dataService.httpPost(environment.apiUrl + 'password/forgot', this.restorePasswordForm.value)
		// .subscribe({
		// 	next: (res: any) => {
		// 		// this.notificationService.success('info', 'Se le ha enviado un mail a su casilla de correo para cambiar su contraseña.');
		// 		this.showSuccessMessage = true
		// 	},
		// 	error: (error: any) => {
		// 		console.log(error);
				
		// 		this.showSuccessMessage = false
		// 	},
		// 	complete: () => {
		// 		this.loading = false
		// 	}
		// })
	}

	resetForm() {
		this.restorePasswordForm.reset();
		this.showSuccessMessage = false
	}

}

