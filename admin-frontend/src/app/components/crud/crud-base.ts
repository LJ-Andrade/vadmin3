import { Injectable, OnInit, inject } from '@angular/core'
import { CrudService } from '@src/app/services/crud.service'
import { FormControl, FormGroup } from '@angular/forms'
import { ListConfig, ListData, SectionConfig } from '@src/app/interfaces/crud.interface'

@Injectable({
    providedIn: 'root'
})

export class CrudBase implements OnInit {

	crudService: CrudService = inject(CrudService)

	listVisibility: boolean = true
	batchDeleteButtonVisible: boolean = false
	creationFormVisibility: boolean = false
	currentPage: number = 1
	existingImageUrl: string | null = null;
	// relations: { [key: string]: any } = {};
	debugData: boolean = false;
	debugCreationForm: boolean = true;

    ngOnInit(): void {
	   	this.fetchData()
	   	this.buildSectionForm()
		this.buildSearchForm()

		if (this.debugData) {
			console.info("Debug mode is activated on the current view file")
			console.log('Section config ', this.sectionConfig)
			console.log('List data ', this.listData)
			console.log('List config ', this.listConfig)
			console.log('Form fields ', this.formFields)
		}

		if (this.debugCreationForm) {
			this.toggleCreationForm()
		}
    }

	ngOnDestroy(): void {
		this.clearCreationForm()
		this.crudService.clearResults()
	}

	sectionConfig: SectionConfig = {
		model: '',
        icon: '',
		nameSingular: '',
		namePlural: '',
        formSize: 'LARGE',
	}

	listData: ListData[] = []
	listConfig: ListConfig = { unDeleteableIds: [], unEditableIds: [] }
	formFields: any[] = []
	sectionForm: FormGroup = new FormGroup({})
	files: { [key: string]: File[] } = {};
	searchForm: FormGroup = new FormGroup({})
	currentRecord: any = {}


	fetchData(params: any = {}) {
		
		// if (page > 1) {
		// 	this.currentPage = page;
		// }

		let perPage: number = 10;
		if (localStorage.getItem('perPage')) {
			perPage = parseInt(localStorage.getItem('perPage')!);
		}
		
		params['list_regs_per_page'] = perPage;
		this.currentPage = params['page']
		
		this.crudService.read(this.sectionConfig.model, params, this.debugData)

	}

    fetchRelation(model: string, field: string, debug: boolean = false) {
        this.crudService.dataService.getModelData(model).subscribe(
            data => {
				this.crudService.appendRelation(model, data);
                this.updateFormFieldsWithData(field, data);
				this.updateSearchFormWithData(model, data);
				if (debug) {
					console.log("Relations ", this.crudService.relations())
				}
            }
        );
    }



	buildSectionForm() {
		this.sectionForm = new FormGroup({});

		this.formFields.forEach(field => {
			this.sectionForm.addControl(
				field.name,
				new FormControl(null, field.validators))

			if (field.value)
				this.sectionForm.get(field.name)?.setValue(field.value)
		});
	}


	buildSearchForm() {
		this.listData.forEach((field: any) => {
			if (field.search) {
				this.searchForm.addControl(
					field.name, new FormControl(null))
			}
		});
	}

	private applyRelationDataToField(fieldName: string, relationData: any[], formGroup: FormGroup = this.sectionForm): void {
		const field = this.formFields.find(f => f.name === fieldName);
		if (!field || !field.options) return;
	
		field.options.data = relationData;
	
		const control = formGroup.get(field.name);
		if (control) {
			const currentValue = control.value;
			control.setValue(currentValue); // mantiene el valor actual
		}
	}

	updateFormFieldsWithData(fieldName: string, data: any[]) {
		this.applyRelationDataToField(fieldName, data, this.sectionForm);
	}


	updateSearchFormWithData(fieldName: string, _data: any[]): void {
		const searchField = this.listData.find(f => f.name === fieldName);
		if (!searchField || !searchField.search) return;
	
		// Asegura que options exista, pero NO le metemos .data
		if (!searchField.search.options) {
			searchField.search.options = {
				name: fieldName,
				valueName: 'id',
				displayField: 'name'
			};
		}
	}


	// submitForm() {

	// 	console.log(this.sectionForm.value)
		
	// 	if(!this.validateForm()) {
	// 		return
	// 	}
	// 	var operation: string = '';

	// 	this.crudService.save(this.sectionForm.getRawValue(), this.sectionConfig.model)!
	// 	.subscribe({
	// 		next: (res: any) => {
	// 			let message: string = '';
	// 			if (res.meta && res.meta.operation == 'update') {
	// 				message = 'The record has been updated successfully';
	// 				operation = 'update';
	// 			} else {
	// 				operation = 'create';
	// 				message = 'The record has been created successfully';
	// 			}
	// 			this.crudService.notificationService.success(message, '');
	// 			this.fetchData();
	// 		},
	// 		error: (error: any) => {
	// 			let errors = error.error;
	// 			if(errors) {
	// 				this.sectionForm.get('errors')?.setErrors({serverError: errors.errors})
	// 				console.log("Error on form ", errors)
					
	// 				let error_message: string = '';
					
	// 				if (errors.errors) {
	// 					for (let key in errors.errors) {
	// 						error_message += '- ' + errors.errors[key] + '\n';
	// 					}
	// 				}

	// 				if (errors.error) {
	// 					error_message += '- '+ errors.error + '\n';
	// 				}

	// 				this.crudService.notificationService.error("There are errors on the form ", error_message);
	// 			}
	// 		},
	// 		complete: () => {
	// 			if (operation == 'create') {
	// 				this.clearCreationForm()
	// 			}
	// 		}
	// 	});
	// }

	submitForm() {
		console.log(this.sectionForm.value);
	
		if (!this.validateForm()) {
			return;
		}
	
		const formData = new FormData();
	
		// Agregar campos normales del formulario
		Object.keys(this.sectionForm.value).forEach(key => {
			formData.append(key, this.sectionForm.value[key]);
		});
	
		// Agregar archivos cargados
		Object.keys(this.files).forEach(fieldName => {
			this.files[fieldName].forEach(file => {
				formData.append(fieldName, file);
			});
		});
	
		let operation: string = '';
	
		this.crudService.save(formData, this.sectionConfig.model)!
		.subscribe({
			next: (res: any) => {
				let message: string = '';
				if (res.meta && res.meta.operation == 'update') {
					message = 'The record has been updated successfully';
					operation = 'update';
				} else {
					operation = 'create';
					message = 'The record has been created successfully';
				}
				this.crudService.notificationService.success(message, '');
				this.fetchData();
			},
			error: (error: any) => {
				let errors = error.error;
				if (errors) {
					this.sectionForm.get('errors')?.setErrors({ serverError: errors.errors });
					console.log("Error on form ", errors);
	
					let error_message: string = '';
	
					if (errors.errors) {
						for (let key in errors.errors) {
							error_message += '- ' + errors.errors[key] + '\n';
						}
					}
	
					if (errors.error) {
						error_message += '- ' + errors.error + '\n';
					}
	
					this.crudService.notificationService.error("There are errors on the form ", error_message);
				}
			},
			complete: () => {
				if (operation == 'create') {
					this.clearCreationForm();
				}
			}
		});
	}

	
	
	validateForm(): boolean {
		if (!this.sectionForm.valid) {
			this.sectionForm.markAllAsTouched();
			// console.log("Error on form ", this.sectionForm)
			return false
		} else {
			return true
		}
	}

	toggleCreationForm(visibility: boolean = true, clearForm: boolean = false): void {
		this.hideOtherComponents()
		this.clearCreationForm();

		if(visibility) {
			this.creationFormVisibility = true;
		} else {
			this.creationFormVisibility = false;
			if (clearForm) {
				this.clearCreationForm();
			}
		}
	}

	editRecord(record: any) {
		this.toggleEditForm(true, record);
	}

	toggleEditForm(visibility: boolean = true, record: any = null): void {
		this.hideOtherComponents()
		
		if(visibility) {
			this.creationFormVisibility = true;
			this.fillFormWithRecordData(record);
		} else {
			this.creationFormVisibility = false;
			this.clearCreationForm();
		}
	}
	
	// fillFormWithRecordData(record: any) {
	// 	this.formFields.forEach(field => {
			
	// 		if(field.isRelation) {
	// 			if (record[field.options.name][0] == undefined) {
	// 				this.sectionForm.get(field.name)?.setValue(null);
	// 			} else {
	// 				this.sectionForm.get(field.name)?.setValue(record[field.options.name][0]);
	// 			}
	// 		} else {
	// 			this.sectionForm.get(field.name)?.setValue(record[field.name]);
	// 		}
	// 	});
	// }

	fillFormWithRecordData(record: any) {
		this.formFields.forEach(field => {
	
			if (field.isRelation) {
				if (record[field.options.name][0] == undefined) {
					this.sectionForm.get(field.name)?.setValue(null);
				} else {
					this.sectionForm.get(field.name)?.setValue(record[field.options.name][0]);
				}
			} else {
				this.sectionForm.get(field.name)?.setValue(record[field.name]);
	
				// Si es el campo 'image', además lo guardamos en una propiedad para mostrar el preview
				if (field.name === 'image') {
					// Esta propiedad debe existir en tu componente hijo, que extiende CrudBase
					(this as any).existingImageUrl = record[field.name];
				}
			}
		});
	}
	


	toggleList(visibility: boolean = true): void {
		this.hideOtherComponents()
		if(visibility) {
			this.listVisibility = true;
		} else {
			this.listVisibility = false;
		}
	}

	hideOtherComponents() {
		this.creationFormVisibility = false;
		this.listVisibility = false;
	}

	onRowsSelected(rows: any[]): void {
		if (rows.length > 0) {
			this.batchDeleteButtonVisible = true;
		} else {
			this.batchDeleteButtonVisible = false;
		}
	}

	clearCreationForm(): void {
		this.sectionForm.reset();
		// this.sectionForm.clearValidators();
		// this.sectionForm.updateValueAndValidity();

		Object.values(this.sectionForm.controls).forEach(control => {
			control.markAsPristine();
			control.markAsUntouched();
			control.setErrors(null);
		});
	
		this.sectionForm.updateValueAndValidity();
		// console.log("Form ", this.sectionForm)
	}

		
}