import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ToastModule } from 'primeng/toast'
import { AuthService } from '@services/auth/auth.service'

@Component({
    selector: 'app-root',
    standalone: true, 
    imports: [ RouterOutlet, ToastModule ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})

export class AppComponent {
    title = 'frontend'

    authService: AuthService = inject(AuthService)

    async ngOnInit() {
        this.authService.retrieveLoggedUser()
	}
}