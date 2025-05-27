import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CrudBase } from '@src/app/components/crud/crud-base';
import { CrudManagerComponent } from '@src/app/components/crud/crud-manager.component';
import { CrudFormComponent } from '@src/app/components/crud/crud-form.component';
import { SectionConfig, ListData, ListConfig, FormField } from '@src/app/interfaces/crud.interface';


@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [ CommonModule, CrudManagerComponent, CrudFormComponent ],
    templateUrl: './clients.component.html'
})

export class ClientsComponent extends CrudBase  {

    override ngOnInit() {
        this.debugData = true;
        super.ngOnInit()
        this.fetchRelation('countries', 'country_id', this.debugData)
    }

    override sectionConfig: SectionConfig = {
        model: 'clients',
        icon: 'pi pi-map',
        nameSingular: 'client',
        namePlural: 'clients',
        formSize: 'LARGE',
    }

    override listData: ListData[] = [
        { name: 'id', text: 'Id', columnClass: 'w-3', hideOnCreation: false, hideOnEdition: false,
            unDeleteableIds: [ 1, 2 ], unEditableIds: [ 1, 2 ] },
        { name: 'domain', text: 'Domain', search: { placeholder: 'By domain...' } },
        { name: 'name', text: 'Name', search: { placeholder: 'By name...' } },
        
        { name: 'primary_color', text: 'Primary color', showAsBadge: true, badgeBgClass: 'bg-yellow-50' },
        { name: 'secondary_color', text: 'Secondary color', showAsBadge: true, badgeBgClass: 'bg-yellow-50' },
        
        { name: 'account_balance', text: 'Account Balancde' },
        { name: 'status', text: 'Status', showAsBadge: true, badgeBgClass: 'bg-blue-50',
            search: { placeholder: 'By status...',
                type: 'select',
				options: {
					name: 'roles',
					valueName: 'name',
					displayField: 'name',
                    items: [
                        { id: 0, name: 'INACTIVE' },
                        { id: 1, name: 'ACTIVE'},
                    ] 
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

        { name: 'domain', label: 'Domain', value: '', placeholder: 'Enter the domain name', type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(250)] },

        { name: 'name', label: 'Name', value: '', placeholder: 'Enter the name', type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'primary_color', label: 'Primary Color', value: '', placeholder: 'Enter the primary color', 
            type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'secondary_color', label: 'Secondary Color', value: '', placeholder: 'Enter the secondary color', 
            type: 'text', class: 'col-span-6',
            validators: [ Validators.required, Validators.minLength(3), Validators.maxLength(50)] },

        { name: 'account_balance', label: 'Account Balance', value: '', placeholder: 'Enter the account balance', 
            type: 'number', class: 'col-span-6',
            validators: [ Validators.required ] },

        { name: 'status', label: 'Status', value: '', placeholder: 'Select status', 
            type: 'select', class: 'col-span-6',
            options: {
                name: 'roles', valueName: 'id', displayField: 'name',
                items: [
                    { id: 0, name: 'INACTIVE' },
                    { id: 1, name: 'ACTIVE'},
                ] 
            },
            validators: [ Validators.required ] },
    ]
}