import { HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@src/environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn
) => {
	const token = localStorage.getItem(environment.tokenKeyName);

	if (token) {
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	return next(request);
}
