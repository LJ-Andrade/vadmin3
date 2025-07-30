import { Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { FieldErrorComponent } from '@components/field-error/field-error.component'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { SelectModule } from 'primeng/select'
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table'
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component'
import { ImageUploaderComponent } from '@components/image-uploader/image-uploader.component'
import { FormField } from '@src/app/interfaces/crud.interface'
import { HelpersService } from '@src/app/services/herlpers.service'
import { ActionsBar } from '@src/app/components/actions-bar/actions-bar'

@Component({
	selector: 'app-dynamic-form',
	imports: [CommonModule, ButtonModule, ActionsBar, SelectModule, MultiSelectModule, FormsModule, ReactiveFormsModule,
		IftaLabelModule, FieldErrorComponent, InputTextModule, TableModule, 
		ImageUploaderComponent, FileUploaderComponent ],
	templateUrl: './dynamic-form.html',
})

export class DynamicForm {
	helpersService = inject(HelpersService);

	@Input() formFields!: FormField[]
	@Input() formSize: string = 'LARGE'
	@Input() showActionsBar: boolean = false;
	
	sectionForm!: FormGroup;
	
	// @Input() existingImageUrl: string | null = null;
	// @Output() submitFormEvent = new EventEmitter<any>();
	
	// @ViewChild(ImageUploaderComponent) imageUploader!: ImageUploaderComponent;

	loading: boolean = false
	imageChangedEvent: any = '';
	// croppedImage: any = '';
	// uploadedImages: File[] = [];
	files: { [key: string]: File[] } = {};

	get saveBtnLabel(): string {
		return this.loading ? 'Saving...' : 'Save';
	}

	ngOnInit() {
		// if (this.sectionForm.get('image')?.value && !this.croppedImage) {
		// 	this.existingImageUrl = this.sectionForm.get('image')?.value;
		// }

		// console.log(this.formFields)
		this.buildSectionForm();
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
