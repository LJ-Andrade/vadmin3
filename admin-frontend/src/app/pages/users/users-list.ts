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
		{ value: 'id', label: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false,
			unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },

		{ value: 'user', label: 'Username',
			search: { placeholder: 'By username...' },
		 },

		{ value: 'email', label: 'Email',
			search: { placeholder: 'By email...' },
		},

		{ value: 'roles', label: 'Role', columnClass: 'w-6', showAsBadge: true,
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

		{ value: 'first_name', label: 'First Name', 
			search: { placeholder: 'By first name...' },
		},

		{ value: 'last_name', label: 'Last Name', columnClass: '',
			search: { placeholder: 'By last name...' },
		}
	];

	listConfig: ListConfig = {
		unDeleteableIds: [ 1, 2 ],
		unEditableIds: [ 1 ]
	}


}