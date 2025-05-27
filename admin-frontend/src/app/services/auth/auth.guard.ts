import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';


export const authGuard: CanActivateFn = (_route, _state) => {
	
	const authService = inject(AuthService);
	const router = inject(Router);
	

	if (authService.isAuthenticated()) {
		return true;
	} else {
		const url = router.createUrlTree(['/login']);
		return url;
	}
};


