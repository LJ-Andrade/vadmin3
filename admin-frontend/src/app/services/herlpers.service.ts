import { Injectable, inject } from '@angular/core'
import { environment } from '@src/environments/environment'
import { NotificationService } from './notification.service'

@Injectable({
	providedIn: 'root'
})

export class HelpersService {
	notificationService = inject(NotificationService);

	public log(message: any) {
		console.log(message);
	}


	public getApiImagePath(modelName: string, filename: string): string {
		return `${environment.apiUrl}image/${modelName}/${filename}`;
	}


	validateFile(file: any, validFileExtensions: string[] = ['txt', 'pdf'], maxSizeMb: number | null = null) : boolean
	{

		if (maxSizeMb !== null && file.size > maxSizeMb * 1024 * 1024) {
			this.notificationService.error('Archivo demasiado grande', 'El archivo no debe superar los <b>' + maxSizeMb  + ' MB</b>');
			return false
		}

		let fileExtension = file.name.split('.').pop();

		if(!validFileExtensions.includes(fileExtension)) {
			this.notificationService.error('Formato no soportado', 'Deben ser archivos con la extensión <b>' + validFileExtensions.join(', ') + '</b>');
			return false
		}

		return true
	}


	validateImage(image: any, validFileExtensions: string[] = ['png', 'jpg']) : boolean {

		let fileExtension = image.name.split('.').pop();

		// const validFileExtensions = ['txt', 'pdf'];

		if(!validFileExtensions.includes(fileExtension)) {
			this.notificationService.error('Formato no soportado', 'Deben ser archivos con la extensión <b>' + validFileExtensions.join(', ') + '</b>');
			return false
		}

		return true
	}


	getFieldNameById(data: any, id: number, orig: any = null): any {
		const text: any = data.find((category: any) => category.id === id);
		// console.log(text)
		if(text)
			return text.name
		else
			return orig
		// return text ? text.name : '-';
	}

	dateEnToDateEs(date: any): string {
		return date.split('-').reverse().join('/');
	}

	loadSetting<T>(key: string, defaultValue: T): T {
		const storedValue = localStorage.getItem(key);
		return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
	  }
	
	saveSetting<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

}
