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
import { ChatComponent } from './pages/chat/chat.component';

import { UsersList } from './pages/users/users-list';
import { CategoryList } from './pages/category/category.list';
import { CategoryCreateEdit } from './pages/category/category.create-edit';

/**
 * App routes
 */

// If you want to specify a route but don't want it to appear in the main menu
// add "hideOnMenu: true" to the route's data


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
					hideOnMenu: true
				}
			},
			{
				path: 'profile',
				component: ProfileComponent,
				data: { 
					title: 'Profile',
					icon: 'pi pi-user',
					hideOnMenu: true
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
						component: UsersList,
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
					}
				]
			},
			{
				path: 'articles',
				data: {
					title: 'Artículos',
					icon: 'pi pi-briefcase',
					noRedirect: true
				},
				children: [
					{
						path: 'categories',
						data: {
							title: 'Categorías',
							icon: 'pi pi-tags',
							noRedirect: true
						},
						children: [
							{ path: '', component: CategoryList, data: { title: 'Listado', icon: 'pi pi-list' } },
							{ path: 'create', component: CategoryCreateEdit, data: { title: 'Crear', icon: 'pi pi-plus' } },
							{ path: 'edit/:id', component: CategoryCreateEdit, data: { title: 'Editar', icon: 'pi pi-pencil', hideOnMenu: true } }
						]
					}
				]
			},
			{
				path: 'chat',
				component: ChatComponent,
				data: {
					title: 'Chat',
					icon: 'pi pi-map'
				}
			}
		]
	}
];
