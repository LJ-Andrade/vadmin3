import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SectionConfig, ListData, ListConfig } from '@src/app/interfaces/crud.interface'
import { AppList } from '@src/app/crud/list/list'
import { CategoryConfig } from './category.config';

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

export class CategoryList {
    sectionConfig: SectionConfig = CategoryConfig.sectionConfig;
    listConfig: ListConfig = CategoryConfig.listConfig;
    listData: ListData[] = CategoryConfig.listData;
}
