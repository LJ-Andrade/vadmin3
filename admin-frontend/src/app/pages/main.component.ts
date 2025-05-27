import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '@src/app/services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../components/header/header.component';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [ CommonModule, RouterModule, ButtonModule, HeaderComponent ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.sass'
})

export default class MainComponent {
	// authService = inject(AuthService);
	router = inject(Router);
}
