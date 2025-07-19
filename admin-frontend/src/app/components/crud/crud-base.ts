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
	
    ngOnInit(): void {
	   	this.fetchData()
	   	this.buildSectionForm()
		this.buildSearchForm()
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
	// currentRecord: any = {}


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
		
		this.crudService.read(this.sectionConfig.model, params)

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
			// Initialize with proper default values based on field type
			let defaultValue = field.value || null;
			
			// For images field, initialize as empty array
			if (field.type === 'images') {
				defaultValue = [];
			}
			
			this.sectionForm.addControl(
				field.name,
				new FormControl(defaultValue, field.validators));

			// If field has a predefined value, set it
			if (field.value && field.type !== 'images') {
				this.sectionForm.get(field.name)?.setValue(field.value);
			}
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
	
		field.options.items = relationData;
	
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
				labelFieldName: 'name',
				valueFieldName: 'id',
				items: []
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

		Object.keys(this.sectionForm.value).forEach(key => {
			const value = this.sectionForm.value[key];

			if (key === 'images' && Array.isArray(value)) {
				value.forEach((image: string, index: number) => {
					if (image.startsWith('data:')) {
						// Imagen nueva, convertir a archivo
						const blob = this.dataURLtoBlob(image);
						formData.append('images', blob, `image_${index}.jpg`);
					}
					// Si es una URL existente, NO la envíes como archivo
					// El backend ya tiene esa imagen, no necesita que la envíes de nuevo
				});
			} else if (key !== 'images' && value !== null && value !== undefined) {
				formData.append(key, value);
			}
		});

		// Agregar archivos cargados (si usas otro sistema de archivos)
		Object.keys(this.files).forEach(fieldName => {
			this.files[fieldName].forEach(file => {
				formData.append(fieldName, file);
			});
		});

		let operation: string = '';
		console.log("Form data to submit: ", formData);
		
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
			}
		});
	}

	// Helper method to convert data URL to blob
	private dataURLtoBlob(dataURL: string): Blob {
		const arr = dataURL.split(',');
		const mime = arr[0].match(/:(.*?);/)![1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
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

	// fillFormWithRecordData(record: any) {
	// 	// this.currentRecord = record;
	// 	console.log("Form fields", this.formFields)
	// 	console.log("Filling form with record:", record);

	// 	this.formFields.forEach(field => {
			
	// 		if (field.type === 'images') {
	// 			//  Si hay un field del form del tipo images busca en la data original,
	// 			//  dentro de media a ver si hay imágenes
	// 			// TODO luego hay que hacer lo mismo con files
	// 			if (field.imageProperties?.multiple) {
	// 				const images = record.media?.filter((m: any) => m.mime_type?.startsWith('image/'));
	// 				this.sectionForm.get(field.name)?.value.push(...images);
	// 			}
	// 			else 
	// 			{
	// 				const image = record.media?.find((m: any) => m.mime_type?.startsWith('image/'));
	// 				this.sectionForm.get(field.name)?.setValue(image);
	// 			}
	// 		} else {
	// 			console.log(field.name)
	// 			console.log(record[field.name]);
	// 			this.sectionForm.get(field.name)?.setValue(record[field.name]);
	// 		}
			
	// 	});

	// 	this.sectionForm.updateValueAndValidity();
	// 	console.log("Form filled with record data:", this.sectionForm.value);
	// }


	fillFormWithRecordData(record: any) {
		this.formFields.forEach(field => {
			if (field.type === 'images') {
				if (field.imageProperties?.multiple) {
					const images = record.media?.filter((m: any) => m.mime_type?.startsWith('image/'));
					this.sectionForm.get(field.name)?.setValue(images ?? []);
				} else {
					const image = record.media?.find((m: any) => m.mime_type?.startsWith('image/'));
					this.sectionForm.get(field.name)?.setValue(image ?? null);
				}
			} else if (field.type === 'select' && field.isArray) {
				// Para selects múltiples, asigna array de IDs
				let value = record[field.name];
				if (Array.isArray(value)) {
					value = value.map(item => String(item[field.options?.valueName || 'id'])); // Normaliza a string si tus IDs son string
				}
				this.sectionForm.get(field.name)?.setValue(value ?? []);
			} else {
				this.sectionForm.get(field.name)?.setValue(record[field.name] ?? null);
			}
		});

		this.sectionForm.updateValueAndValidity();
		console.log("Form filled with record data: ", this.sectionForm.value);
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
		// Reset form values with proper defaults for each field type
		this.formFields.forEach(field => {
			if (field.type === 'images') {
				this.sectionForm.get(field.name)?.setValue([]);
			} else {
				this.sectionForm.get(field.name)?.setValue(null);
			}
		});

		// Clear all validation states
		Object.values(this.sectionForm.controls).forEach(control => {
			control.markAsPristine();
			control.markAsUntouched();
			control.setErrors(null);
		});
	
		this.sectionForm.updateValueAndValidity();
		// this.currentRecord = {}; // Clear current record
	}

		
}