import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Input, Output, Renderer2, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-image-previewer',
	standalone: true,
	imports: [ CommonModule, DialogModule, ButtonModule ],
	templateUrl: './image-previewer.component.html',
	styleUrl: './image-previewer.component.sass'
})
export class ImagePreviewerComponent {
	renderer = inject(Renderer2)
	document = inject(DOCUMENT)

	actionIsLoading: boolean = false
	confirmingDelete: boolean = false

	@Input() image?: any;
	@Input() allowDelete: boolean = true
	@Output() deleteImageRequested = new EventEmitter()

	fullImage: boolean = false;

	showExistingImage(image: any) {
		this.image = image
	}

	showFullImage() {
		const fullImage = this.document.querySelector('.full-image')
		this.renderer.appendChild(this.document.body, fullImage)
		this.fullImage = true
	}

	hideFullImage() {
		this.fullImage = false
	}

	askImageDeletion() {
		this.confirmingDelete = true
	}

	requestImageDeletion() {
		this.actionIsLoading = true
		this.confirmingDelete = false
		this.deleteImageRequested.emit()
	}

	cancelImageDeletion() {
		this.confirmingDelete = false
		this.actionFinished()
	}

	imageDeletedSuccessfully() {
		this.actionFinished()
		this.image = null
	}

	actionFinished() {
		this.actionIsLoading = false
	}
}
