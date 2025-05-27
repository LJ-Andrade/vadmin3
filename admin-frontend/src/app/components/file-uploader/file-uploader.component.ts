
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@Component({
	selector: 'app-file-uploader',
	standalone: true,
	imports: [CommonModule, ButtonModule, TableModule, DialogModule],
	templateUrl: './file-uploader.component.html'
})

export class FileUploaderComponent {
	@Input() fieldName!: string;
	@Input() files: File[] = [];
	@Output() onSingleFileSelected = new EventEmitter<{ fieldName: string, files: File[] }>();
	@Output() onSingleFileDeleted = new EventEmitter<{ fieldName: string, index: number }>();

	confirmingDelete: boolean = false;
	fileToDeleteIndex: number | null = null;

	handleFileInput(event: any) {
		const selectedFiles = Array.from(event.target.files) as File[];
		this.files.push(...selectedFiles);
		this.onSingleFileSelected.emit({ fieldName: this.fieldName, files: this.files });
	}

	askFileDeletion(index: number) {
		this.fileToDeleteIndex = index;
		this.confirmingDelete = true;
	}

	confirmFileDeletion() {
		if (this.fileToDeleteIndex !== null) {
			this.onSingleFileDeleted.emit({ fieldName: this.fieldName, index: this.fileToDeleteIndex });
			this.files.splice(this.fileToDeleteIndex, 1);
		}
		this.confirmingDelete = false;
		this.fileToDeleteIndex = null;
	}

	cancelFileDeletion() {
		this.confirmingDelete = false;
		this.fileToDeleteIndex = null;
	}
}
