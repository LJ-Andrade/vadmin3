import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { DataService } from '@src/app/services/data.service';
import { HelpersService } from '@src/app/services/herlpers.service';
import { ButtonModule } from 'primeng/button';
import { ImagePreviewerComponent } from '../image-previewer/image-previewer-component';
import { NotificationService } from '@src/app/services/notification.service';


@Component({
	selector: 'app-multiple-image-uploader',
	standalone: true,
	imports: [ CommonModule, ButtonModule, ImagePreviewerComponent ],
	templateUrl: './multiple-image-uploader.component.html',
	styleUrls: ['./multiple-image-uploader.component.sass'],
})


export class MultipleImageUploaderComponent implements AfterViewInit {

	dataService = inject(DataService)
	helpers: any = inject(HelpersService)
	notificationService: NotificationService = inject(NotificationService);
	
	@ViewChildren(ImagePreviewerComponent) imagePreviewers!: QueryList<ImagePreviewerComponent>;
	
	@Input() sectionForm: any;
	@Input() maxImages: number = 5
	@Input() acceptedExtensions: string[] = ['png', 'jpg', 'jpeg']
	@Input() maxFileSize: number = 5 * 1024 * 1024 // 5 MB
	@Input() targetWidth: number = 0; // 0 significa que no se especifica un ancho
	@Input() targetHeight: number = 0; // 0 significa que no se especifica un alto
	@Input() cropToFit: boolean = false; // Si es true, las imágenes serán recortadas para ajustarse a las dimensiones

	images: string[] = [];
	imageItems: { id: string; image: string }[] = [];


	private generateUniqueId(): string {
		return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
	}


	texts: any = {
		selectImagesButton: 'Agregar imágenes...',
		adjustImage: 'Ajuste la imágen',
		previewImage: 'Previsualización',
	};

	get formImages(): { id: string; image: string }[] {
		const images = this.sectionForm.get('images')?.value || [];
		
		
		// If the form has images but our local state doesn't match, update it
		if (images.length > 0 && this.imageItems.length === 0) {
			console.log('FormImages getter: Syncing with form value because imageItems is empty', images);
			this.updateImagesFromFormValue(images);
		}
		
		// Check if arrays are different in content, not just length
		const currentImageUrls = this.imageItems.map(item => item.image);
		const formImageUrls = images;
		
		if (JSON.stringify(currentImageUrls) !== JSON.stringify(formImageUrls)) {
			console.log('FormImages getter: Arrays differ, updating. Current:', currentImageUrls, 'Form:', formImageUrls);
			this.imageItems = images.map((image: string, index: number) => ({
				id: this.imageItems[index]?.id || this.generateUniqueId(),
				image: image
			}));
		}
		
		return this.imageItems;
	}


	ngOnInit() {
		if (this.maxImages == 1) {
			this.texts.selectImagesButton = 'Agregar imagen...';
		}

	}

	ngAfterViewInit() {
		// Initialize images after view is ready
		setTimeout(() => {
			this.initializeImagesFromForm();
			
			// Subscribe to form value changes to detect when external code updates the images array
			this.sectionForm.get('images')?.valueChanges.subscribe((images: string[]) => {
				// Force update if the form value is different from current state
				if (JSON.stringify(images || []) !== JSON.stringify(this.images)) {
					console.log('Updating images due to form change - Old:', this.images, 'New:', images);
					this.updateImagesFromFormValue(images || []);
				}
			});
		}, 200); // Increased delay to ensure form is properly initialized
	}

	// Helper method to initialize images from form value
	private initializeImagesFromForm() {
		const formImages = this.sectionForm.get('images')?.value || [];
		if (formImages.length > 0 || this.images.length !== formImages.length) {
			this.updateImagesFromFormValue(formImages);
		}
	}

	// Update local state with new images array
	private updateImagesFromFormValue(images: string[]) {
		
		this.images = [...images];
		this.imageItems = images.map((image: string) => ({
			id: this.generateUniqueId(),
			image: image
		}));
		
		
		// Force change detection
		setTimeout(() => {
			console.log('Images after timeout:', this.images);
		}, 0);
	}


	fileChangeEvent(event: any): void {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		const files = Array.from(input.files);
		// console.log('Selected files:', files);
		
		const currentImages = this.sectionForm.get('images')?.value || [];
		
		// Validar que no se exceda el número máximo de imágenes
		if (currentImages.length + files.length > this.maxImages) {
			console.warn(`No se pueden agregar más de ${this.maxImages} imágenes`);
			this.notificationService.error(`No se pueden agregar más de ${this.maxImages} imágenes`);
			return;
		}
		
		let processedFiles = 0;
		const newImages: string[] = [];
		
		// Procesar cada archivo con la nueva función de procesamiento
		const processAllFiles = async () => {
			for (const file of files) {
				try {
					// Procesar la imagen (recortar si es necesario)
					const processedImage = await this.processImage(file);
					newImages.push(processedImage);
					// console.log('Imagen procesada:', processedImage.substring(0, 50) + '...');
				} catch (error) {
					console.error('Error al procesar imagen:', error);
				}
				processedFiles++;
			}
			
			// Cuando se han procesado todos los archivos, actualizar el estado
			if (processedFiles === files.length) {
				this.images = [...currentImages, ...newImages];
				this.sectionForm.get('images')?.setValue(this.images);
				// Agregar los nuevos items con IDs únicos
				const newImageItems = newImages.map(image => ({
					id: this.generateUniqueId(),
					image: image
				}));
				this.imageItems = [...this.imageItems, ...newImageItems];
				
				if (this.targetWidth > 0 || this.targetHeight > 0) {
					console.log(`Imágenes procesadas al tamaño: ${this.targetWidth}x${this.targetHeight}`);
				}
			}
		};
		
		// Iniciar el procesamiento
		processAllFiles();

		console.log('Procesando imágenes...');
		
		// Limpiar el input para permitir seleccionar el mismo archivo otra vez
		input.value = '';
	}	

	removeImage(index: number): void {
		this.images.splice(index, 1);
		this.imageItems.splice(index, 1);
		this.sectionForm.get('images')?.setValue([...this.images]);
	}

	deleteImage(index: number): void {
		// console.log("Deleting image at index:", index);
		const images = this.sectionForm.get('images')?.value || [];
		images.splice(index, 1);
		this.sectionForm.get('images')?.setValue([...images]);
		this.images.splice(index, 1);
		this.imageItems.splice(index, 1);
	}

	// Función para procesar la imagen y recortarla si es necesario
	processImage(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			
			reader.onload = (event) => {
				const img = new Image();
				img.onload = () => {
					// Si no hay dimensiones objetivo o cropToFit es false, devuelve la imagen original
					if ((this.targetWidth <= 0 && this.targetHeight <= 0) || !this.cropToFit) {
						resolve(reader.result as string);
						return;
					}
					
					// Determinar el ancho y alto finales según la proporción original
					let finalWidth = this.targetWidth;
					let finalHeight = this.targetHeight;
					
					// Si solo se especificó una dimensión, calcular la otra manteniendo la proporción
					if (this.targetWidth <= 0 && this.targetHeight > 0) {
						finalWidth = Math.round(img.width * (this.targetHeight / img.height));
						finalHeight = this.targetHeight;
					} else if (this.targetWidth > 0 && this.targetHeight <= 0) {
						finalWidth = this.targetWidth;
						finalHeight = Math.round(img.height * (this.targetWidth / img.width));
					}
					
					// Crear un canvas para el recorte
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');
					
					if (!ctx) {
						reject(new Error("No se pudo crear el contexto del canvas"));
						return;
					}
					
					// Calcular dimensiones y posiciones de recorte para centrar la imagen
					let sourceX = 0;
					let sourceY = 0;
					let sourceWidth = img.width;
					let sourceHeight = img.height;
					
					// Determinar la relación de aspecto de destino y fuente
					const targetRatio = finalWidth / finalHeight;
					const sourceRatio = img.width / img.height;
					
					// Recortar la imagen original para mantener la proporción objetivo
					if (sourceRatio > targetRatio) {
						// La imagen es más ancha que la proporción objetivo
						sourceWidth = Math.round(img.height * targetRatio);
						sourceX = Math.round((img.width - sourceWidth) / 2);
					} else if (sourceRatio < targetRatio) {
						// La imagen es más alta que la proporción objetivo
						sourceHeight = Math.round(img.width / targetRatio);
						sourceY = Math.round((img.height - sourceHeight) / 2);
					}
					
					// Configurar el tamaño del canvas
					canvas.width = finalWidth;
					canvas.height = finalHeight;
					
					// Dibujar la imagen recortada en el canvas
					ctx.drawImage(
						img,
						sourceX, sourceY, sourceWidth, sourceHeight, // Área de recorte de la imagen original
						0, 0, finalWidth, finalHeight // Área de destino en el canvas
					);
					
					// Obtener la imagen resultante como data URL
					const dataUrl = canvas.toDataURL('image/jpeg', 0.92); // 0.92 es la calidad
					resolve(dataUrl);
				};
				
				img.onerror = () => {
					reject(new Error("Error al cargar la imagen"));
				};
				
				img.src = reader.result as string;
			};
			
			reader.onerror = () => {
				reject(new Error("Error al leer el archivo"));
			};
			
			reader.readAsDataURL(file);
		});
	}

	// Método para mover una imagen hacia la izquierda (intercambiando con la anterior)
	moveImageLeft(index: number): void {
		// Si ya está en la primera posición, no hacer nada
		if (index <= 0) return;
		
		// console.log(`Moviendo imagen ${index} hacia la izquierda`);
		this.swapImages(index, index - 1);
	}
	
	// Método para mover una imagen hacia la derecha (intercambiando con la siguiente)
	moveImageRight(index: number): void {
		const images = this.sectionForm.get('images')?.value || [];
		// Si ya está en la última posición, no hacer nada
		if (index >= images.length - 1) return;
		
		// console.log(`Moviendo imagen ${index} hacia la derecha`);
		this.swapImages(index, index + 1);
	}
	
	// Método auxiliar para intercambiar dos imágenes en el array
	private swapImages(index1: number, index2: number): void {
		// Obtener el array actual de imágenes
		const images = [...(this.sectionForm.get('images')?.value || [])];
		
		// Verificar índices válidos
		if (index1 < 0 || index2 < 0 || index1 >= images.length || index2 >= images.length) {
			console.error('Índices fuera de rango', index1, index2, images.length);
			return;
		}
		
		// Intercambiar posiciones
		[images[index1], images[index2]] = [images[index2], images[index1]];
		
		// Actualizar el formulario
		this.sectionForm.get('images')?.setValue(images);
		this.images = [...images];
		
		// Intercambiar también en imageItems para mantener sincronizado
		const tempId = this.imageItems[index1].id;
		const tempImage = this.imageItems[index1].image;
		
		this.imageItems[index1] = {
			id: this.imageItems[index2].id,
			image: this.imageItems[index2].image
		};
		
		this.imageItems[index2] = {
			id: tempId,
			image: tempImage
		};
		
		console.log('Imágenes reordenadas correctamente');
	}
}
