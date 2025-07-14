import { Component, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
import { FieldErrorComponent } from '../field-error/field-error.component'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { SelectModule } from 'primeng/select'
import { TableModule } from 'primeng/table'
import { FileUploaderComponent } from '../file-uploader/file-uploader.component'
import { MultipleImageUploaderComponent } from '../multiple-image-uploader/multiple-image-uploader.component'

@Component({
	selector: 'app-crud-form',
	imports: [CommonModule, ButtonModule, SelectModule, FormsModule, ReactiveFormsModule,
		IftaLabelModule, FieldErrorComponent, InputTextModule, TableModule, 
		FileUploaderComponent, MultipleImageUploaderComponent ],
	templateUrl: './crud-form.component.html',
})

export class CrudFormComponent {
	@Input() sectionForm!: FormGroup;
	@Input() formFields: any[] = []
	@Input() formSize: string = 'LARGE'
	@Input() loading: boolean = false
	@Input() existingImageUrl: string | null = null;
	@Output() submitFormEvent = new EventEmitter<any>();
	
	imageChangedEvent: any = '';
	croppedImage: any = '';
	uploadedImages: File[] = [];
	files: { [key: string]: File[] } = {};

	get saveBtnLabel(): string {
		return this.loading ? 'Saving...' : 'Save';
	}

	ngOnInit() {
		if (this.sectionForm.get('image')?.value && !this.croppedImage) {
			this.existingImageUrl = this.sectionForm.get('image')?.value;
		}
	}

	submitForm() {
		// console.log(this.sectionForm.value)
		// console.log(this.files);
		this.submitFormEvent.emit({
			formValue: this.sectionForm.value,
			files: this.files 
		});
	}

	handleImages(images: File[]) {
		this.uploadedImages = images;
		console.log('Imágenes seleccionadas:', this.uploadedImages);
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}


	loadExistingImage(url: string) {
		this.existingImageUrl = url;
	}


	// #region Image Upload
	triggerImageUpload() {
		const inputElement = document.getElementById('imageInput') as HTMLInputElement;
		inputElement.click();
	}

	onImageDeleted() {
		console.error('Image deleted');
		// this.sectionForm.get('image')?.setValue(null);
	}

	// onImageCropped(imageBase64: string): void {
	// 	this.sectionForm.get('image')?.setValue(imageBase64);
	// }

	// imageCropped(event: ImageCroppedEvent) {
	// 	this.croppedImage = event.base64;
	// 	this.sectionForm.get('image')?.setValue(this.croppedImage);
	// }

	// #endregion


	onSelected(event: any, fieldName: string) {
		const selectedFiles = Array.from(event.target.files) as File[];
		if (!this.files[fieldName]) {
			this.files[fieldName] = [];
		}
		this.files[fieldName].push(...selectedFiles);
	}

	removeFile(fieldName: string, index: number) {
		this.files[fieldName].splice(index, 1);
	}


	onSingleFileSelected(event: { fieldName: string, files: File[] }) {
		this.files[event.fieldName] = event.files;
	}
	
	onSingleFileDeleted(event: { fieldName: string, index: number }) {
		this.files[event.fieldName].splice(event.index, 1);
	}
	

	onFilesSelected(event: { fieldName: string, files: File[] }) {
		this.files[event.fieldName] = event.files;
	}
	
	onFileDeleted(event: { fieldName: string, index: number }) {
		this.files[event.fieldName].splice(event.index, 1);
	}

}
