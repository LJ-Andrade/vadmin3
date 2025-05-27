import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CrudBase } from '@src/app/components/crud/crud-base';
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component';
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component';
import { SectionConfig, ListData, ListConfig } from '@src/app/interfaces/crud.interface';


@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
    templateUrl: './countries.component.html'
})

export class CountriesComponent extends CrudBase  {
    
    override ngOnInit() {
        super.ngOnInit()
    }

    override sectionConfig: SectionConfig = {
        model: 'countries',
        icon: 'pi pi-crown',
        nameSingular: 'country',
        namePlural: 'countries',
        formSize: 'SMALL',
    }

    override listData: ListData[] = [
        { name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false,
            unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },
        { name: 'name', text: 'Name', 
            search: {
                placeholder: 'By name...'
            }
        },
        { name: 'code', text: 'Code',
            search: {
                placeholder: 'By code...',
            }
        },
    ];

    override listConfig: ListConfig = {
        unDeleteableIds: [ 1, 2 ],
        unEditableIds: [ 1, 2 ]
    }

    override formFields: any[] = [

        { name: 'id', label: 'Id', value: '', placeholder: 'Enter the role id', type: 'text', class: 'col-span-12',
            hidden: true }, 

        { name: 'name', label: 'Name', value: '', placeholder: 'Enter the country name', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'code', label: 'Codeame', value: '', placeholder: 'Enter the country code', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },
    ]
}