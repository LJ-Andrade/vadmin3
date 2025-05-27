import { Pipe, PipeTransform } from '@angular/core';
import { CrudService } from '@src/app/services/crud.service';

@Pipe({
	name: 'relationLabel',
	standalone: true,
	pure: true
})

export class RelationLabelPipe implements PipeTransform {

	constructor(private crudService: CrudService) {}

	transform(
		relationName: string,
		relationId: any,
		displayField: string,
		valueField: string = 'id' 
	): string {
		const relation = this.crudService.apiDataResponse().relations[relationName]
		if (!relation || relationId === null || relationId === undefined) return ''
        
		const match = relation.find((r: any) => r[valueField] === relationId)
		return match ? match[displayField] : ''
	}
}
