import { RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'; // Corregido
import { NotificationService } from '@src/app/services/notification.service';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [ RouterModule, PanelModule, CardModule, ButtonModule ], // Corregido
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.sass']
})

export default class DashboardComponent {
	private notificationService = inject(NotificationService);

	show(): void {
		this.notificationService.success('Info', 'Message Content');
	}
}