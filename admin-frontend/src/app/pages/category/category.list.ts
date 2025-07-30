import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SectionConfig, ListData, ListConfig } from '@src/app/interfaces/crud.interface'
import { AppList } from '@src/app/crud/list/list'
import { CategoryConfig } from './category.config';
import { SectionHeader } from '@src/app/components/section-header/section-header';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [ CommonModule, AppList, SectionHeader ],
    template: ` 
                <app-section-header [sectionConfig]="sectionConfig" [sectionAction]="'Listado'"></app-section-header>
                <app-list
					[sectionConfig]="sectionConfig"
					[listData]="listData"
                    [listConfig]="listConfig">
				</app-list>
			`
})

export class CategoryList {
    sectionConfig: SectionConfig = CategoryConfig.sectionConfig;
    listConfig: ListConfig = CategoryConfig.listConfig;
    listData: ListData[] = CategoryConfig.listData;
}
