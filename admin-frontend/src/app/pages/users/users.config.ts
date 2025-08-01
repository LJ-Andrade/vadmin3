import { SectionConfig, FormField, ListData, ListConfig } from '@src/app/interfaces/crud.interface';
import { Validators } from '@angular/forms';
import { matchToValidator } from '@src/app/validators/match-fields.validator';

export const UsersConfig = {

    
    sectionConfig: <SectionConfig> {
        model: 'users',
        sectionPath: '/general/usuarios/',
        icon: 'pi pi-users',
        gender: 'M',
        nameSingular: 'usuario',
        namePlural: 'usuarios',
        formSize: 'LARGE',
    },


    listData: <ListData[]>[
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
    ],

    listConfig: <ListConfig> {
        unDeleteableIds: [ 1, 2 ],
        unEditableIds: [ 1 ]
    },
    
    formFields: <FormField[]> [

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
        
        { name: 'roles', label: 'Role', value: '', placeholder: 'Select the role', type: 'select', 
            cols: 'sm:col-span-3 md:col-span-3',
            isRelation: true, isArray: true,
            options: { 
                name: 'roles', valueFieldName: 'id', labelFieldName: 'name'
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

        { name: 'avatar', label: 'Imágenes / Avatar', value: [], placeholder: 'sube imagenes', 
            cols: 'col-span-12',
            type: 'images',
            imageProperties: {
                maxImages: 1,
                acceptedExtensions: ['png', 'jpg', 'jpeg'],
                maxSize: 1000000,
                targetWidth: 300,
                targetHeight: 300,
                cropToFit: true,
            },
            validators: [] // Sin validadores requeridos
        },

    ]

} as const
