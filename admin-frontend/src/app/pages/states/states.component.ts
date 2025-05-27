import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CrudBase } from '@src/app/components/crud/crud-base';
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component';
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component';
import { SectionConfig, ListData, ListConfig, FormField } from '@src/app/interfaces/crud.interface';


@Component({
    selector: 'app-states',
    standalone: true,
    imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
    templateUrl: './states.component.html'
})

export class StatesComponent extends CrudBase  {

    override ngOnInit() {
        this.debugData = true;
        super.ngOnInit()
        this.fetchRelation('countries', 'country_id', this.debugData)
    }

    override sectionConfig: SectionConfig = {
        model: 'states',
        icon: 'pi pi-map',
        nameSingular: 'state',
        namePlural: 'states',
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
        
        { name: 'code', text: 'Code', showAsBadge: true, badgeBgClass: 'bg-yellow-50',
            search: {
                placeholder: 'By code...',
            }
        },
        
        { name: 'country_id', text: 'Country', columnClass: 'w-6', showAsBadge: false,
            isRelation: true, relationName: 'countries', relationValue: 'id',  relationDisplayName: 'name', 
            search: { 
                placeholder: 'By country...',
                type: 'select',
                options: {
                  name: 'countries',
                  valueName: 'id',
                  displayField: 'name',
                }
              }
        },
    ];

    override listConfig: ListConfig = {
        unDeleteableIds: [],
        unEditableIds: []
    }

    override formFields: FormField[] = [

        { name: 'id', label: 'Id', value: '', placeholder: 'Enter the state id', type: 'text', class: 'col-span-12',
            hidden: true }, 

        { name: 'name', label: 'Name', value: '', placeholder: 'Enter the state name', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'code', label: 'Code', value: '', placeholder: 'Enter the state code', type: 'text', class: 'col-span-12',
            validators: [ Validators.required, Validators.minLength(2), Validators.maxLength(10)] },
            
        { name: 'country_id', label: 'Country', value: '', placeholder: 'Select the country', type: 'select', class: 'col-span-12',
            isRelation: true,
            options: { 
                name: 'countries', valueName: 'id', displayField: 'name'
            },
            validators: [ Validators.required ]
        }
    ]
}