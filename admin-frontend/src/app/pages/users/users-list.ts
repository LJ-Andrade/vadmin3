import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SectionConfig, ListData, ListConfig } from '@src/app/interfaces/crud.interface'
import { AppList } from '@src/app/crud/list/list'

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [ CommonModule, AppList ],
	template: ` <app-list
					[sectionConfig]="sectionConfig"
					[listData]="listData"
					[listConfig]="listConfig">
				</app-list>
			`
})


export class UsersList  {

	sectionConfig: SectionConfig = {
		model: 'users',
		icon: 'pi pi-users',
		gender: 'M',
		nameSingular: 'usuario',
		namePlural: 'usuarios',
		formSize: 'LARGE',
	}

	listData: ListData[] = [
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false,
			unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },

		{ name: 'user', text: 'Username',
			search: { placeholder: 'By username...' },
		 },

		{ name: 'email', text: 'Email',
			search: { placeholder: 'By email...' },
		},

		{ name: 'roles', text: 'Role', columnClass: 'w-6', showAsBadge: true,
			isArray: true, isRelation: true, relationName: 'roles', relationDisplayName: 'name', relationValue: 'id',
			search: { 
				placeholder: 'By role...',
				type: 'select',
				options: {
					name: 'roles',
					valueFieldName: 'id',
					labelFieldName: 'name'
				}
			},
		},

		{ name: 'first_name', text: 'First Name', 
			search: { placeholder: 'By first name...' },
		},

		{ name: 'last_name', text: 'Last Name', columnClass: '',
			search: { placeholder: 'By last name...' },
		}
	];

	listConfig: ListConfig = {
		unDeleteableIds: [ 1, 2 ],
		unEditableIds: [ 1 ]
	}


}