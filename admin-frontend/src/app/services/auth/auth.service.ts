import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
import { DataService } from '../data.service';
import { NotificationService } from '../notification.service';
import { Observable } from 'rxjs';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';
export type AuthUser = User | null | undefined;

interface LoginState {
	status: LoginStatus;
}

interface AuthState {
  user: AuthUser;
}

interface User {
	id: number;
	email: string;
	name: string;
	first_name: string;
	last_name: string;
	roles: []
}

@Injectable({
	providedIn: 'root',
})

export class AuthService {
    notificationService = inject(NotificationService);
    http = inject(HttpClient);
    dataService = inject(DataService);
    router = inject(Router);

    private loginStatus = signal<LoginState>({ status: 'pending' });
    private user = signal<AuthState>({ user: null });
    loginState = computed(() => this.loginStatus().status);

    authenticate(data: any, redirectTo: string = '/dashboard') {
        this.loginStatus.set({ status: 'authenticating' });

        return this.dataService.httpPost('auth/login', data).subscribe({
            next: (response: any) => {
                localStorage.setItem(environment.tokenKeyName, response.token.access_token);
                this.user.set({ user: response.data });
                this.loginStatus.set({ status: 'success' });
                this.notificationService.success('Welcome', 'Login successful');
                this.router.navigateByUrl(redirectTo);
            },
            error: (error: any) => {
                this.handleError(error);
                this.loginStatus.set({ status: 'error' });
            },
            complete: () => {
                setTimeout(() => {
                    this.loginStatus.set({ status: 'pending' });
                }, 1000);
            }
        });
    }

    private handleError(error: any) {
        if (error.status === 0) {
            this.notificationService.error('Error', 'No server connection. Try again later.');
        } else {
            this.notifyErrors(error.error.errors);
        }
    }

	isAuthenticated() {
		const authToken = localStorage.getItem(environment.tokenKeyName);
		return !!authToken;
	}

	login(loginData: any, redirectTo: string = '/inicio') {
		this.loginStatus.set({ status: 'authenticating' });

		this.http.post(environment.apiUrl + 'auth/login', loginData)
		.subscribe({
			next: (res: any) => {
				localStorage.setItem(environment.tokenKeyName, res.token.access_token);
				this.loginStatus.set({ status: 'success' });
				this.notificationService.success('Bienvenid@', 'Has ingresado correctamente');
				this.router.navigateByUrl(redirectTo);
				this.user.set({ user: res.data });
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);


			},
			error: (error: any) => {
				if(error.status === 0) {
					this.notificationService.error('Error', 'No hay conexión con el servidor. Inténtalo más tarde.');
				} else {
					this.notifyErrors(error.error.errors);
				}
				this.loginStatus.set({ status: 'error' });
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			}
		});
	}

	register(registerData: any, redirectTo: string = '/inicio') {
		this.loginStatus.set({ status: 'authenticating' });

		this.http.post(environment.apiUrl + 'auth/register', registerData)
		.subscribe({
			next: (res: any) => {
				localStorage.setItem(environment.tokenKeyName, res.token);
				this.loginStatus.set({ status: 'success' });
				this.notificationService.success('Bienvenid@', 'Has ingresado correctamente');
				this.router.navigateByUrl(redirectTo);
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			},
			error: (error: any) => {
				if(error.status === 0) {
					this.notificationService.error('Error', 'No hay conexión con el servidor. Inténtalo más tarde.');
				} else {
					this.notifyErrors(error.error.errors);
				}
				this.loginStatus.set({ status: 'error' });
				setTimeout(() => {
					this.loginStatus.set({ status: 'pending' });
				}, 1000);
			}
		});
	}

	retrieveLoggedUser(): Promise<AuthUser | null> {
		return new Promise((resolve) => {
			if (this.isAuthenticated() && this.user()?.user == null) {
				this.dataService.httpFetch('auth/me').subscribe({
					next: (res: any) => {
						this.user.set({ user: res.data });
						resolve(res.data);
					},
					error: () => {
						this.user.set({ user: null });
						resolve(null);
					}
				});
			} else {
				resolve(this.user()?.user || null);
			}
		});
	}

	getUserData(): User | null {
		return this.user().user || null;
	}

	getUserFullName(): string {
		const user = this.user().user;
		return user ? `${user.first_name} ${user.last_name}` : '';
	}

	getUserEmail(): string {
		const user = this.user().user;
		return user? user.email : '';
	}


	logout() {

		this.notificationService.info('Login out...', '');
		this.dataService.httpPost(environment.apiUrl + 'auth/logout', {}).subscribe({
			next: (res: any) => {
				if (res.status || res.message == 'Success') {
					localStorage.removeItem(environment.tokenKeyName)
					localStorage.removeItem('client-skin')
					location.reload()
				}
			},
			error: () => {
				// Si hay error en el logout, de todas formas limpiamos el token y recargamos
				localStorage.removeItem(environment.tokenKeyName)
				location.reload()
				console.log('Error en el logout')
			}
		});
	}

	notifyErrors(errors: any) {
		let message = '';
		for (const errorKey in errors) {
			message += '- ' + errors[errorKey] + '</br>';
		}
		this.notificationService.error('Error', message);
	}
}
