import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { DataService } from '@src/app/services/data.service';
import { HelpersService } from '@src/app/services/herlpers.service';
import { Button } from 'primeng/button';
import { ImagePreviewerComponent } from '../image-previewer/image-previewer-component';


@Component({
	selector: 'app-multiple-image-uploader',
	standalone: true,
	imports: [ CommonModule, Button, ImagePreviewerComponent ],
	templateUrl: './multiple-image-uploader.component.html',
	styleUrls: ['./multiple-image-uploader.component.sass'],
})


export class MultipleImageUploaderComponent {

	dataService = inject(DataService)
	helpers: any = inject(HelpersService)
	
	@ViewChild(ImagePreviewerComponent) imagePreviewer: ImagePreviewerComponent | undefined

	@Input() sectionForm: any;
	@Input() maxImages: number = 5
	@Input() acceptedExtensions: string[] = ['png', 'jpg', 'jpeg']
	@Input() maxFileSize: number = 5 * 1024 * 1024 // 5 MB


	texts: any = {
		selectImagesButton: 'Seleccionar imágen...',
		adjustImage: 'Ajuste la imágen',
		previewImage: 'Previsualización',
	};


	fileChangeEvent(event: any): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const files = Array.from(input.files);
		const images: string[] = [];

		files.forEach(file => {
			const reader = new FileReader();
			reader.onload = () => {
				images.push(reader.result as string);
				// Actualizar el valor después de cargar todos
				this.sectionForm.get('images')?.setValue([...images]);
			};
			reader.readAsDataURL(file);
		});

		
		// const image = event.target.files[0];
		// console.log('Selected image:', image);
		// this.onImageSelected.emit(image)

		// if (this.helpers.validateImage(image, this.acceptedFiles)) {

		// 	if(this.useCropper) {
		// 		this.showCropper = true
		// 		this.imageChangedEvent = event;
		// 	} else {
		// 		this.formGroup?.controls[this.fieldName]?.setValue(image);
		// 	}
		// 	this.selectedImage = image ? URL.createObjectURL(image) : null

		// } else {
		// 	this.clearImageInput()
		// 	this.formGroup?.controls[this.fieldName]?.setValue(null);
		// }
    }	

	deleteImage(index: number): void {
		console.log("Deleting image at index:", index);
		
	}

}
