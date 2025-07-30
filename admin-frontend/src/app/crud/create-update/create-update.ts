import { Component, Input, Output, EventEmitter, inject } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
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

@Component({
	selector: 'app-create-update-form',
	imports: [CommonModule, ButtonModule, SelectModule, MultiSelectModule, FormsModule, ReactiveFormsModule,
		IftaLabelModule, FieldErrorComponent, InputTextModule, TableModule, 
		ImageUploaderComponent, FileUploaderComponent ],
	templateUrl: './create-update.html',
})

export class CrudFormComponent {
	@Input() sectionForm!: FormGroup;
	@Input() formFields: FormField[] = []
	@Input() formSize: string = 'LARGE'
	@Input() loading: boolean = false
	@Input() existingImageUrl: string | null = null;
	@Output() submitFormEvent = new EventEmitter<any>();
	
	// @ViewChild(ImageUploaderComponent) imageUploader!: ImageUploaderComponent;
	helpersService = inject(HelpersService);

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
	}

	

	submitForm() {
		// console.log(this.sectionForm.value)
		// console.log(this.files);
		this.submitFormEvent.emit({
			formValue: this.sectionForm.value,
			files: this.files 
		});
	}

	// handleImages(images: File[]) {
	// 	this.uploadedImages = images;
	// 	console.log('Imágenes seleccionadas:', this.uploadedImages);
	// }

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
		console.log(event.files)
		this.files[event.fieldName] = event.files;
	}
	
	onFileDeleted(event: { fieldName: string, index: number }) {
		this.files[event.fieldName].splice(event.index, 1);
	}

	// Llama a esto al cerrar el formulario o antes de cargar un nuevo registro
	// resetUploaderImages() {
	// 	if (this.imageUploader) {
	// 		this.imageUploader.clearImages();
	// 	}
	// }

	closeForm() {
		console.log('Form closed');
		// ...tu lógica de cierre...
	}

	editRecord(record: any) {
		// ...tu lógica para cargar el registro...
	}


}
