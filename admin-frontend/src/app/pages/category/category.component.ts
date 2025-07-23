import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CrudBase } from '@src/app/components/crud/crud-base';
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component';
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component';
import { SectionConfig, ListData, ListConfig, FormField } from '@src/app/interfaces/crud.interface';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
    templateUrl: './category.component.html'
})
export class CategoryComponent extends CrudBase  {

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
