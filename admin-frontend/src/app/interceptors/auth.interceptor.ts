import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
	const router = inject(Router);
	const token = localStorage.getItem(environment.tokenKeyName);

	let req = request;
	if (token) {
		req = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401 || error.status === 403 || error.status === 0) {
				localStorage.removeItem(environment.tokenKeyName);
				router.navigate(['/login']);
			}
			return throwError(() => error);
		})
	);
};



// import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';

// import { environment } from '@src/environments/environment';

// export const AuthInterceptor: HttpInterceptorFn = (
// 	request: HttpRequest<unknown>,
// 	next: HttpHandlerFn
// ) => {
// 	const token = localStorage.getItem(environment.tokenKeyName);

// 	if (token) {
// 		request = request.clone({
// 			setHeaders: {
// 				Authorization: `Bearer ${token}`
// 			}
// 		});
// 	}

// 	return next(request);
// }
