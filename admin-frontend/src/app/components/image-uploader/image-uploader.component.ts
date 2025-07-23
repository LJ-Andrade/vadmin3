import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { DataService } from '@src/app/services/data.service';
import { HelpersService } from '@src/app/services/herlpers.service';
import { ButtonModule } from 'primeng/button';
import { ImagePreviewerComponent } from '../image-previewer/image-previewer-component';
import { NotificationService } from '@src/app/services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { EventBusService } from '@src/app/services/event.bus.service';


@Component({
	selector: 'app-image-uploader',
	standalone: true,
	imports: [ CommonModule, ButtonModule, ImagePreviewerComponent ],
	templateUrl: './image-uploader.component.html',
	styleUrls: ['./image-uploader.component.sass'],
})


export class ImageUploaderComponent {

	dataService = inject(DataService)
	helpers: any = inject(HelpersService)
	notificationService: NotificationService = inject(NotificationService)
	eventBusService: any = inject(EventBusService)

	// @ViewChildren(ImagePreviewerComponent) imagePreviewers!: QueryList<ImagePreviewerComponent>;
	
	@Input() sectionForm: any;
	@Input() maxImages: number = 5
	@Input() acceptedExtensions: string[] = ['png', 'jpg', 'jpeg']
	@Input() maxFileSize: number = 5 * 1024 * 1024 // 5 MB
	@Input() targetWidth: number = 0; // 0 significa que no se especifica un ancho
	@Input() targetHeight: number = 0; // 0 significa que no se especifica un alto
	@Input() cropToFit: boolean = false; // Si es true, las imágenes serán recortadas para ajustarse a las dimensiones

	@Output() onFilesSelected = new EventEmitter<{ fieldName: string, files: File[] }>();


	images: { url: string, type: 'new' | 'existing' }[] = [];
	
	private destroy$ = new Subject<void>();
	
	texts: any = {
		selectImagesButton: 'Agregar imágenes...',
		adjustImage: 'Ajuste la imágen',
		previewImage: 'Previsualización',
	};


	ngOnInit() {
		if (this.maxImages == 1) {
			this.texts.selectImagesButton = 'Agregar imagen...';
		}

		this.eventBusService.on('resetMainForm')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => this.reset()
		);
		

	}



	fileChangeEvent(event: any): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const files: FileList = input.files;
		const selectedFiles: File[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];

			// Validar cantidad máxima
			if (this.images.length >= this.maxImages) {
				this.notificationService.error('Máximo de imágenes alcanzado');
				break;
			}

			// Validar extensión
			const extension = file.name.split('.').pop()?.toLowerCase();
			if (!this.acceptedExtensions.includes(extension || '')) {
				this.notificationService.error(`La extensión de ${file.name} no está permitida`);
				continue;
			}

			// Crear URL para preview
			const url = URL.createObjectURL(file);

			// Agregar imagen al array visual
			this.images.push({ url, type: 'new' });

			// Agregar a los seleccionados válidos
			selectedFiles.push(file);
		}

		// Emitir solo si hay imágenes válidas
		if (selectedFiles.length > 0) {
			this.onFilesSelected.emit({ fieldName: 'images', files: selectedFiles });
		}

		// Limpiar input para permitir volver a subir la misma imagen si se borra
		input.value = '';
	}


	removeImage(index: number): void {
		this.images.splice(index, 1);
		// this.imageItems.splice(index, 1);
		this.sectionForm.get('images')?.setValue([...this.images]);
	}

	deleteImage(index: number): void {
		// console.log("Deleting image at index:", index);
		const images = this.sectionForm.get('images')?.value || [];
		images.splice(index, 1);
		this.sectionForm.get('images')?.setValue([...images]);
		this.images.splice(index, 1);
		// this.imageItems.splice(index, 1);
	}

	
	reset(): void {
		console.log('Limpiando todas las imágenes');
		this.images = [];
		// this.imageItems = [];
		this.sectionForm.get('images')?.setValue([]);
		console.log('Todas las imágenes han sido eliminadas');
	}


	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
