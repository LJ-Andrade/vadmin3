import { Routes } from '@angular/router';
import MainComponent from '@src/app/pages/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RequestResetPasswordComponent } from './pages/request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { authGuard } from '@src/app/services/auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import DashboardComponent from './pages/dashboard/dashboard.component';
import { ExamplesComponent } from './pages/examples/examples.component';
import { UsersComponent } from './pages/users/users.component';
import { RolesComponent } from './pages/roles/roles.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { StatesComponent } from './pages/states/states.component';
import { ClientsComponent } from './pages/clients/clients.component';

/**
 * App routes
 */

// If you want to specify a route but don't want it to appear in the main menu
// add "skipFromMenu: true" to the route's data


export const routes: Routes = [
	
	{ path: 'login', component: LoginComponent, pathMatch: 'full', },
	{ path: 'request-password-reset', component: RequestResetPasswordComponent, pathMatch: 'full' },
	{ path: 'reset-password', component: ResetPasswordComponent, pathMatch: 'full' },
	{
		path: '',
		component: MainComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{
				path: 'dashboard',
				component: DashboardComponent,
				data: {
					title: '',
					icon: 'pi pi-home'
				}
			},
			{
				path: 'examples',
				component: ExamplesComponent,
				data: {
					title: 'Examples',
					icon: 'pi pi-users',
					skipFromMenu: true
				}
			},
			{
				path: 'profile',
				component: ProfileComponent,
				data: { 
					title: 'Profile',
					icon: 'pi pi-user',
					skipFromMenu: true
				}
			},
			{
				path: 'settings',
				data: { 
					title: 'Settings',
					icon: 'pi pi-briefcase',
					noRedirect: true
				},
				children: [
					{
						path: 'users',
						component: UsersComponent,
						data: {
							title: 'Users',
							icon: 'pi pi-users'
						}
					},
					{
						path: 'roles',
						component: RolesComponent,
						data: {
							title: 'Roles',
							icon: 'pi pi-crown'
						}
					},
					{
						path: 'countries',
						component: CountriesComponent,
						data: {
							title: 'Countries',
							icon: 'pi pi-globe'
						}
					},
					{
						path: 'states',
						component: StatesComponent,
						data: {
							title: 'States',
							icon: 'pi pi-map'
						}
					},
				]
			},
			{
				path: 'clients',
				component: ClientsComponent,
				data: {
					title: 'Clients',
					icon: 'pi pi-map'
				}
			}
		]
	}
];
