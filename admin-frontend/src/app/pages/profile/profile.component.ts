import { Component, computed, inject } from '@angular/core'
import { AuthService } from '@src/app/services/auth/auth.service'
import { BadgeModule } from 'primeng/badge'
import { Card } from 'primeng/card'
import { Divider } from 'primeng/divider';


@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [ Card, BadgeModule, Divider ],
	templateUrl: './profile.component.html'
})

export class ProfileComponent {
	userData = computed(() => this.authService.getUserData());

	authService = inject(AuthService);
}
