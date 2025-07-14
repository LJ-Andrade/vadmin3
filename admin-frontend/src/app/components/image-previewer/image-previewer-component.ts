import { CommonModule, DOCUMENT } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	Output,
	Renderer2,
	inject,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
	ChangeDetectorRef,
	ChangeDetectionStrategy
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-image-previewer',
	standalone: true,
	imports: [CommonModule, DialogModule, ButtonModule],
	templateUrl: './image-previewer.component.html',
	styleUrl: './image-previewer.component.sass',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ImagePreviewerComponent implements OnChanges, OnInit, OnDestroy {
	renderer = inject(Renderer2)
	document = inject(DOCUMENT)
	cdr = inject(ChangeDetectorRef)

	actionIsLoading = false
	confirmingDelete = false

	@Input() image?: string
	@Input() allowDelete = true
	@Input() imageIndex: number = -1 
	@Output() deleteImageRequested = new EventEmitter<number>()

	fullImage = false
	displayedImage: string = ''; // esta se usa para mostrar en <img>
	imageVersion: number = 0; // para forzar actualización del template

	ngOnInit(): void {
		console.log(`🟢 ImagePreviewerComponent creado - Index: ${this.imageIndex}, Image: ${this.image?.substring(0, 20)}...`);
		// Inicializar displayedImage si ya hay una imagen
		if (this.image) {
			this.displayedImage = this.image;
			this.imageVersion = 1; // Inicializar versión
		}
	}

	ngOnDestroy(): void {
		console.log(`🔴 ImagePreviewerComponent destruido - Index: ${this.imageIndex}, Image: ${this.image?.substring(0, 20)}...`);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['image'] && changes['image'].currentValue) {
			console.log('🔄 Imagen cambiada, actualizando componente...');
			console.log('Imagen anterior:', changes['image'].previousValue?.substring(0, 30) + '...');
			console.log('Imagen nueva:', changes['image'].currentValue?.substring(0, 30) + '...');
			
			this.displayedImage = this.image!;
			this.imageVersion++; // Incrementar versión para forzar actualización
			
			// Forzar detección de cambios
			this.cdr.markForCheck();
			this.cdr.detectChanges();
		}
	}

	showExistingImage(image: string) {
		this.image = image;
		this.displayedImage = image;
	}

	showFullImage() {
		this.fullImage = true;
	}

	hideFullImage() {
		this.fullImage = false;
	}

	askImageDeletion() {
		this.confirmingDelete = true;
	}

	requestImageDeletion() {		
		this.actionIsLoading = true;
		this.confirmingDelete = false;
		this.deleteImageRequested.emit(this.imageIndex);
		// Limpiar la imagen después de emitir el evento
		this.imageDeletedSuccessfully();
	}

	cancelImageDeletion() {
		this.confirmingDelete = false;
		this.actionFinished();
	}

	imageDeletedSuccessfully() {
		this.actionFinished();
		this.image = undefined;
		this.displayedImage = '';
	}

	actionFinished() {
		this.actionIsLoading = false;
	}

	// Método público para actualizar la imagen desde el componente padre
	updateImage(newImage: string) {
		console.log('🔄 Actualizando imagen desde el componente padre:', newImage.substring(0, 50) + '...');
		this.image = newImage;
		this.displayedImage = newImage;
		this.imageVersion++; // Incrementar para forzar actualización del template
		this.cdr.markForCheck();
		this.cdr.detectChanges();
	}

	debugComponentState() {
		console.log('🔍 Debug estado del componente:');
		console.log('- imageIndex:', this.imageIndex);
		console.log('- image:', this.image?.substring(0, 50) + '...');
		console.log('- displayedImage:', this.displayedImage?.substring(0, 50) + '...');
		console.log('- imageVersion:', this.imageVersion);
	}
}
