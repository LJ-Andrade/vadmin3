import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Validators } from '@angular/forms'
import { CrudBase } from '@src/app/components/crud/crud-base'
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component'
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component'
import { SectionConfig, ListData, ListConfig, FormField } from '@src/app/interfaces/crud.interface'
import { matchToValidator } from '@src/app/validators/match-fields.validator'


@Component({
	selector: 'app-users',
	standalone: true,
	imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
	templateUrl: './users.component.html'
})

export class UsersComponent extends CrudBase  {

	override ngOnInit() {
		this.debugData = false;
		super.ngOnInit()
		this.fetchRelation('roles', 'role', this.debugData)
	}

	override sectionConfig: SectionConfig = {
		model: 'users',
		icon: 'pi pi-users',
		nameSingular: 'usuario',
		namePlural: 'usuarios',
		formSize: 'LARGE',
	}

	override listData: ListData[] = [
		{ name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false,
			unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },

		{ name: 'user', text: 'Username',
			search: { placeholder: 'By username...' },
		 },

		{ name: 'email', text: 'Email',
			search: { placeholder: 'By email...' },
		 },

		{ name: 'roles', text: 'Role', columnClass: 'w-6', showAsBadge: true,
			search: { 
				placeholder: 'By role...',
				type: 'select',
				options: {
					name: 'roles',
					valueName: 'name',
					displayField: 'name'
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

	override listConfig: ListConfig = {
		unDeleteableIds: [ 1, 2 ],
		unEditableIds: [ 1 ]
	}

	override formFields: FormField[] = [

		{ name: 'id', label: 'Id', value: '', placeholder: 'Enter the id', type: 'text', cols: 'col-span-12',
			hidden: true },

		{ name: 'user', label: 'Username', value: '', placeholder: 'Enter the username', type: 'text', 
			cols: 'sm:col-span-3 md:col-span-3', class: '',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
	   
		{ name: 'first_name', label: 'First Name', value: '', placeholder: 'Enter the first name', type: 'text', 
			cols: 'sm:col-span-3 md:col-span-3',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
	   
		{ name: 'last_name', label: 'Last Name', value: '', placeholder: 'Enter the last name', type: 'text', 
			cols: 'sm:col-span-3 md:col-span-3',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
		
		{ name: 'role', label: 'Role', value: '', placeholder: 'Select the role', type: 'select', 
			cols: 'sm:col-span-3 md:col-span-3',
			isRelation: true,
			options: { 
				name: 'roles', valueName: 'name', displayField: 'name'
			},
			validators: []
		},

		{ name: 'email', label: 'Email', value: '', placeholder: 'Enter the email', type: 'text', 
			cols: 'sm:col-span-4 md:col-span-4',
				validators: [ Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)] },

		{ name: 'password', label: 'Password', value: '', placeholder: 'Enter the password', 
			type: 'text', 
			cols: 'sm:col-span-4 md:col-span-4',
			validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

		{ name: 'confirm_password', label: 'Confirm Password', value: '', placeholder: 'Enter the password', 
			type: 'text', 
			cols: 'sm:col-span-4 md:col-span-4',
			matchTo: 'password',
			validators: [ Validators.required, matchToValidator('password') ] },

		// { name: 'attachments', type: 'file', label: 'Adjuntar archivos', class: 'sm:col-span-12' },

		// { name: 'avatar', label: 'Avatar', value: '', placeholder: 'Upload an avatar image', class: '',
		// 	type: 'image',
		// 	imageProperties: {
		// 		accept: 'image/*',
		// 		maxSize: 1000000,
		// 		useCropper: true,
		// 		aspectRatio: 1,
		// 		resizeToWidth: 300,
		// 	},
		// 	validators: []
		// },

		{ name: 'images', label: 'Imágenes', value: '', placeholder: 'sube imagenes', 
			cols: 'col-span-12',
			type: 'images',
			imageProperties: {
				maxImages: 5,
				acceptedExtensions: 'image/*',
				maxSize: 1000000,
				useCropper: true,
				aspectRatio: 1,
				resizeToWidth: 300,
			},
			validators: []
		},




	]
}