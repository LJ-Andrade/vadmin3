import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { FieldErrorComponent } from '@components/field-error/field-error.component'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { SelectModule } from 'primeng/select'
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table'
// import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component'
// import { ImageUploaderComponent } from '@components/image-uploader/image-uploader.component'
import { FormField, SectionConfig } from '@src/app/interfaces/crud.interface'
import { HelpersService } from '@src/app/services/herlpers.service'
import { ActionsBar } from '@src/app/components/actions-bar/actions-bar'
import { DataService } from '@src/app/services/data.service'
import { delay } from 'rxjs'

@Component({
	selector: 'app-dynamic-form',
	imports: [CommonModule, ButtonModule, ActionsBar, SelectModule, MultiSelectModule, FormsModule, ReactiveFormsModule,
		IftaLabelModule, FieldErrorComponent, InputTextModule, TableModule ],
		templateUrl: './dynamic-form.html',
	})
	// ImageUploaderComponent, FileUploaderComponent ],

export class DynamicForm {
	helpersService = inject(HelpersService)
	dataService: DataService = inject(DataService)

	@Input() formFields!: FormField[]
	@Input() formSize: string = 'LARGE'
	@Input() sectionConfig!: SectionConfig
	@Input() showActionsBar: boolean = false
	@Input() existingRecordId: string | null = null
	
	sectionForm: FormGroup = new FormGroup({}); // Inicialización segura
	loading: boolean = false
	
	#currentRecord = signal<any>({})
	public currentRecord = computed(() => this.#currentRecord())


	get saveBtnLabel(): string {
		return this.loading ? 'Saving...' : 'Save';
	}

	ngOnInit() {
		console.log(this.existingRecordId)
		this.buildSectionForm()

		if(this.existingRecordId) {
			this.getExinstingRecordData()
		} 

	}

	getExinstingRecordData() {
		this.loading = true;
		console.log(`🔄 Fetching existing record data for ID: ${this.existingRecordId}`);
		this.dataService.httpFetch(this.sectionConfig.model + '/' + this.existingRecordId)
			// .pipe(delay(1500)) // Simulate delay for demonstration
			.subscribe({
				next: (res: any) => {
					this.#currentRecord.set(res);
					if (this.sectionForm) {
						this.sectionForm.patchValue(res);
					}
					this.loading = false;
				},
				error: (error: any) => {
					console.log("Error on users ", error);
				}
			});
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
	

	submitForm() {
		console.log(this.sectionForm.value)
		// console.log(this.files);
		// this.submitFormEvent.emit({
		// 	formValue: this.sectionForm.value,
		// 	files: this.files 
		// });
	}


}
