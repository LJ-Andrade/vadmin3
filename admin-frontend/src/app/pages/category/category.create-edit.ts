import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SectionConfig, FormField } from '@src/app/interfaces/crud.interface'
import { DynamicForm } from "@src/app/crud/dynamic-form/dynamic-form"
import { CategoryConfig } from './category.config'
import { SectionHeader } from '@src/app/components/section-header/section-header'
import { Button } from 'primeng/button'
import { RouterLink } from '@angular/router'
import { CrudCommon } from '@src/app/crud/crud-common'

@Component({
    selector: 'app-category-create-edit',
    standalone: true,
    imports: [ CommonModule, DynamicForm, SectionHeader, RouterLink, Button ],
    template: `
                <app-section-header [sectionConfig]="sectionConfig" 
                    [sectionAction]="sectionTypeName">
                </app-section-header>
                
                <app-dynamic-form
                    [formFields]="formFields"
                    [formSize]="sectionConfig.formSize"
                    [sectionConfig]="sectionConfig"
                    [existingRecordId]="existingRecordId"
                    [showActionsBar]="true">
                    
                    <div slot="start">
                        <p-button 
                            label="Listado" icon="pi pi-list" class="mr-2 main-button"
                            [routerLink]="['/', sectionConfig.parentRoute, sectionConfig.model]" 
                        />
                    </div>
                    <div slot="end"> </div>
                </app-dynamic-form>
            `,
})

export class CategoryCreateEdit extends CrudCommon {
    sectionConfig: SectionConfig = CategoryConfig.sectionConfig
    formFields: FormField[] = CategoryConfig.formFields
}
