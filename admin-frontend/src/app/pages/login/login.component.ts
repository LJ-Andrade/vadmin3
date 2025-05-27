
import { Component, OnInit, inject, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AuthService } from '@src/app/services/auth/auth.service';
import { FieldErrorComponent } from '@src/app/components/field-error/field-error.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		CommonModule, ReactiveFormsModule, RouterModule, FieldErrorComponent,
		ButtonModule, InputTextModule, PasswordModule, CardModule, DividerModule
	],
	providers: [MessageService],
	templateUrl: './login.component.html',
	styleUrl: './login.component.sass'
})
export class LoginComponent implements OnInit {
	authService = inject(AuthService);
	messageService = inject(MessageService);

	// Move effect to a field initializer
	loginEffect = effect(() => {
		this.handleLoginState(this.authService.loginState() as 'authenticating' | 'success' | 'error' | 'idle');
	});

	formFields = [
		{
			name: 'user',
			label: 'Username',
			type: 'text',
			validators: [Validators.required],
			placeholder: 'Enter username'
		},
		{
			name: 'password',
			label: 'Password',
			type: 'password',
			validators: [Validators.required, Validators.minLength(8)],
			placeholder: 'Enter password'
		}
	];

	loginForm!: FormGroup;
	loading = false;

	constructor() {
		this.authService.dataService.testConnection();
		this.buildForm();
	}

	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.authService.router.navigate(['/dashboard']);
		}
		// Remove effect() call from here
	}

	private buildForm() {
		this.loginForm = new FormGroup({});
		this.formFields.forEach(field => {
			this.loginForm.addControl(
				field.name,
				new FormControl('', field.validators)
			);
		});
	}

	private handleLoginState(status: 'authenticating' | 'success' | 'error' | 'idle') {
		this.loading = status === 'authenticating';

		if (status === 'success') {
			this.messageService.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Login successful'
			});
		}
	}

	onSubmit() {
		this.loginForm.markAllAsTouched();

		if (this.loginForm.valid) {
			this.authService.authenticate(this.loginForm.value, '/dashboard');
		} else {
			this.handleInvalidForm();
		}
	}

	private handleInvalidForm() {
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Please fill all required fields correctly'
		});
	}

}
