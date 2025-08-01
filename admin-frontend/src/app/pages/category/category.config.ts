import { SectionConfig, FormField, ListData, ListConfig } from '@src/app/interfaces/crud.interface';
import { Validators } from '@angular/forms';

export const CategoryConfig = {

    sectionConfig: <SectionConfig>{
        model: 'categories',
        parentRoute: 'articles',
        icon: 'pi pi-tags',
        gender: 'F',
        nameSingular: 'categoría',
        namePlural: 'categorías',
        formSize: 'LARGE',
    },

    formFields: <FormField[]>[
        { name: 'id', label: 'Id', value: '', placeholder: 'Ingrese el id', type: 'text', class: 'col-span-12', hidden: true },
        {
            name: 'name', label: 'Nombre', value: '', placeholder: 'Ingrese el nombre de la categoría', type: 'text', 
            cols: 'sm:col-span-6 md:col-span-6',
            validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
        },
        {
            name: 'module', label: 'Módulo', value: '', placeholder: 'Ingrese a qué módulo pertenece', type: 'select', 
            cols: 'sm:col-span-6 md:col-span-6',
            options: {
                name: 'modules',
                valueFieldName: 'name',
                labelFieldName: 'name',
                items: [
                    { id: 1, name: 'Article' },
                    { id: 2, name: 'Product' },
                ]
            },
            validators: [Validators.required]
        }
    ],

    listData: <ListData[]>[
        { value: 'id', label: 'Id', columnClass: 'w-3' },
        { value: 'name', label: 'Nombre', search: { placeholder: 'Por nombre...' } },
        {
            value: 'module',
            label: 'Módulo',
            search: {
                placeholder: 'Por módulo...',
                type: 'select',
                options: {
                    name: 'module',
                    valueFieldName: 'id',
                    labelFieldName: 'name',
                    items: [
                        { id: '1', name: 'Article' },
                        { id: '2', name: 'Product' },
                    ]
                }
            }
        },
        {
            value: 'created_at',
            label: 'Fecha de creación',
            columnClass: 'w-3',
            hideOnCreation: true,
            hideOnEdition: true,
            mutate: (value: string) => (value ? new Date(value).toLocaleDateString() : '')
        }
    ],

    listConfig: <ListConfig>{
        unDeleteableIds: [1, 2],
        unEditableIds: []
    }
} as const;
