import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SectionConfig, FormField } from '@src/app/interfaces/crud.interface'
import { CategoryConfig } from './category.config'

@Component({
    selector: 'app-category-create-edit',
    standalone: true,
    imports: [ CommonModule ],
    templateUrl: './category.create-edit.html',
})

export class CategoryCreateEdit {
    sectionConfig: SectionConfig = CategoryConfig.sectionConfig
    formFields: FormField[] = CategoryConfig.formFields
}
