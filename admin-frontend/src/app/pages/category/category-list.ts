import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Validators } from '@angular/forms'
import { CrudBase } from '@src/app/components/crud/crud-base'
import { SectionConfig, ListData, FormField } from '@src/app/interfaces/crud.interface'
import { AppList } from '@src/app/crud/list/list'

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ CommonModule, AppList ],
    template: ` <app-list
					[sectionConfig]="sectionConfig"
					[listData]="listData"
					[listConfig]="listConfig">
				</app-list>
			`
})
export class CategoryList extends CrudBase  {

    override ngOnInit() {
        super.ngOnInit();
    }

    override sectionConfig: SectionConfig = {
        model: 'categories',
        icon: 'pi pi-tags',
        gender: 'F',
        nameSingular: 'categoría',
        namePlural: 'categorías',
        formSize: 'LARGE',
    }

    override listData: ListData[] = [
        { name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false},
        { name: 'name', text: 'Nombre', search: { placeholder: 'Por nombre...' } },
        { name: 'module', text: 'Módulo', 
            search: { 
				placeholder: 'Por módulo...',
				type: 'select',
				options: {
					name: 'module',
					valueFieldName: 'id',
					labelFieldName: 'name',
                    items: [
                        { id: "Article", name: 'Article' },
                        { id: "Product", name: 'Product' },
                    ]
				}
			},
        },
        { name: 'created_at', text: 'Fecha de creación', columnClass: 'w-3', hideOnCreation: true, hideOnEdition: true,
            mutate: (value: string) => { 
                return value ? new Date(value).toLocaleDateString() : '';
            }
         },

    ];

    // override listConfig: ListConfig = {
    //     unDeleteableIds: [],
    //     unEditableIds: []
    // }

    override formFields: FormField[] = [
        { name: 'id', label: 'Id', value: '', placeholder: 'Ingrese el id', type: 'text', class: 'col-span-12',
            hidden: true },

        { name: 'name', label: 'Nombre', value: '', placeholder: 'Ingrese el nombre de la categoría', type: 'text', 
            cols: 'sm:col-span-6 md:col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'module', label: 'Módulo', value: '', placeholder: 'Ingrese a que módulo pertenece', type: 'select', 
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
            validators: [ Validators.required ]
        }
    ]
}
