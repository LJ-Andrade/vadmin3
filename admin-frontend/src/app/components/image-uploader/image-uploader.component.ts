import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@src/environments/environment';
import { DataService } from '@src/app/services/data.service';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { CommonModule } from '@angular/common';
import { fadeIn } from '@src/app/animations/fadeIn';
import { ImagePreviewerComponent } from '../image-previewer/image-previewer-component';
import { HelpersService } from '@src/app/services/herlpers.service';
import { Button } from 'primeng/button';

@Component({
	selector: 'app-image-uploader',
	standalone: true,
	imports: [ CommonModule, ImagePreviewerComponent, ImageCropperComponent, Button ],
	animations: [ fadeIn ],
	templateUrl: './image-uploader.component.html',
	styleUrl: './image-uploader.component.sass'
})

export class ImageUploaderComponent {

	@ViewChild(ImagePreviewerComponent) imagePreviewer: ImagePreviewerComponent | undefined

	imageChangedEvent: Event | null = null;
	croppedImage: any  = '';

	dataService = inject(DataService)
	helpers: any = inject(HelpersService)
	acceptedFiles: string[] = ['png', 'jpg', 'jpeg']
	selectedImage: any = null
	imageId: number | null = null
	showCropper: boolean = false

	@Input() formGroup?: FormGroup
	@Input() fieldName: string = ''
	@Input() currentImage?: any
	@Input() useCropper: boolean = false	
	@Input() aspectRatio: number = 0
	@Input() resizeToWidth: number = 400
	@Output() onImageSelected = new EventEmitter<any>()
	@Output() onImageDeleted = new EventEmitter<any>()


	fileChangeEvent(event: any): void {
		const image = event.target.files[0];
		this.onImageSelected.emit(image)

		if (this.helpers.validateImage(image, this.acceptedFiles)) {

			if(this.useCropper) {
				this.showCropper = true
				this.imageChangedEvent = event;
			} else {
				this.selectedImage = image ? URL.createObjectURL(image) : null
				this.formGroup?.controls[this.fieldName]?.setValue(image);
			}

		} else {
			this.clearImageInput()
			this.formGroup?.controls[this.fieldName]?.setValue(null);
		}
    }

    imageCropped(event: ImageCroppedEvent) {
		// let selectedImage = event.blob
		this.imagePreviewer?.showExistingImage(URL.createObjectURL(event.blob!))
		this.formGroup?.controls[this.fieldName].setValue(event.blob);
	}

	imageLoaded(image: LoadedImage) {
    }

    cropperReady() {
    }

    loadImageFailed() {
    }

	setExistingImage(images: any, mediaCollection: string | null = null) {

		let currentImage: any = null

		if(mediaCollection != null) {
			let filteredImageFromMedia = images.filter( (media: any) => media.collection_name == mediaCollection )
			if(filteredImageFromMedia != undefined) {
				currentImage = filteredImageFromMedia[0]
			}
		} else {
			currentImage = Object.values(images)[0]
		}

		if(currentImage == null) return

		this.imageId = currentImage.id
		this.imagePreviewer?.showExistingImage(currentImage.original_url)
	}

	onCancel(): void {
		this.clearImageInput()
		this.imagePreviewer?.showExistingImage(null)
		this.imageId = null
	}

	// clearImageInput(): void {
	// 	this.showCropper = false
	// 	this.selectedImage = null
	// 	this.imagePreviewer?.imageDeletedSuccessfully()
	// }

	clearImageInput(): void {
		this.showCropper = false
		this.imageChangedEvent = null
		this.selectedImage = null
		this.imageId = null
	
		this.imagePreviewer?.imageDeletedSuccessfully()
		this.formGroup?.controls[this.fieldName]?.setValue(null)
	}
	

	deleteImage() {
		console.log("Image id: ", this.imageId);
	
		if (this.imageId != null) {
			this.dataService.httpDelete(`${environment.apiUrl+'delete-media/'+this.imageId}`).subscribe({
				next: (res: any) => {
					if (res.success) {
						this.clearImageInput()
						this.onImageDeleted.emit()
					}
					console.log(res);
				},
				error: (error: any) => {
					console.log("Error deleting image ", error);
					this.imagePreviewer?.actionFinished()
				}
			});
		} else {
			// Imagen sin ID, eliminar localmente
			this.clearImageInput()
			this.formGroup?.controls[this.fieldName]?.setValue(null)
			this.onImageDeleted.emit()
		}
	}
	
}
