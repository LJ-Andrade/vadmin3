import { Component, computed, EventEmitter, inject, Input, Output, Signal, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CheckboxModule } from 'primeng/checkbox'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { SkeletonComponent } from '../skeleton/skeleton.component'
import { ToolbarModule } from 'primeng/toolbar'
import { Results } from '@src/app/interfaces/results.interface'
import { PaginatorModule } from 'primeng/paginator'
import { DialogModule } from 'primeng/dialog'
import { PanelModule } from 'primeng/panel'
import { NotificationService } from '@src/app/services/notification.service'
import { CrudService } from '@src/app/services/crud.service'
import { FormSize, SectionConfig } from '@src/app/interfaces/crud.interface'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroup } from 'primeng/inputgroup'
import { SelectModule } from 'primeng/select'
// import { UtilsService } from '@src/app/services/utils.service'
import { RelationLabelPipe } from '@src/app/pipes/relation-label.pipe';
import { HelpersService } from '@src/app/services/herlpers.service'
import { EventBusService } from '@src/app/services/event.bus.service'


@Component({
	selector: 'app-crud-manager',
	templateUrl: './crud-manager.component.html',
	standalone: true,
	imports: [ CommonModule, SkeletonComponent,	 ToolbarModule, CheckboxModule, FormsModule, ReactiveFormsModule,
		 InputGroupAddonModule, InputTextModule, InputGroup, PaginatorModule, ButtonModule, 
		 DialogModule, PanelModule, SelectModule, RelationLabelPipe
	]
})

export class CrudManagerComponent {

	notificationService: NotificationService = inject(NotificationService);
	crudService: CrudService = inject(CrudService);
	helpersService: HelpersService = inject(HelpersService);
	eventBusService: EventBusService = inject(EventBusService);

	@Input() sectionConfig: SectionConfig = { model: '', icon: '', nameSingular: '', namePlural: '', formSize: 'LARGE' };
	@Input() listData: any[] = [];
	@Input() listConfig: any = {};
	@Input() apiDataResponse!: Signal<Results<any>>
	@Input() relations: any = {};
	@Input() listVisibility: boolean = true;
	@Input() creationFormVisibility: boolean = true;
	@Input() searchForm: FormGroup = new FormGroup({});

	@Output() rowsSelected = new EventEmitter<any[]>();
	@Output() requestRead = new EventEmitter<{[key: string]: any}>();
	@Output() requestCreation = new EventEmitter<void>();
	@Output() requestList = new EventEmitter<void>();
	@Output() requestEdit = new EventEmitter<any>();

	selectedRows = signal<any[]>([]);
	selectedRowsCount = computed(() => this.selectedRows().length);
	activeData: any = {}
	currentData: any[] = []; // Check why I made this for,
	displayDeleteConfirmation: boolean = false;
	recordsToDelete: any[] = [];
	creationFormTitle: string = 'Creando ' + this.sectionConfig.nameSingular;
	currentPage: number = 1;

	searchOptionsVisibility: boolean = false;
	advancedSearchOptionsVisibility: boolean = false;
	advancedSearchAvailable: boolean = true;

	originalFormSize: FormSize = this.sectionConfig.formSize;
	formIsShrinked: boolean = false;


	ngOnInit() {
		this.searchOptionsVisibility = this.helpersService.loadSetting('searchVisibility', false);
		this.ensureSearchFormControls();
		this.originalFormSize= this.sectionConfig.formSize;
		this.creationFormTitle = 'Creando ' + this.sectionConfig.nameSingular
	}

	ensureSearchFormControls() {
		if (!this.searchForm || !this.listData) return;
		this.listData.forEach(column => {
			if (column.search && !this.searchForm.contains(column.name)) {
				this.searchForm.addControl(column.name, new FormControl(''));
			}
		});
	}
	
	emitRequestRead() {
		this.requestRead.emit({ page: this.currentPage })
	}

	emitRequestList() {
		this.requestList.emit()
		this.eventBusService.emit('resetMainForm');
	}

	emitRequestCreation() {
		this.requestCreation.emit()
		this.creationFormTitle = 'Creating ' + this.sectionConfig.nameSingular
		this.toggleSearchOptions(false)
	}

	emitRequestEdit(record: any) {
		this.requestEdit.emit(record);
		this.creationFormTitle = 'Editing ' + this.sectionConfig.nameSingular
		this.toggleSearchOptions(false)
	}

//#region Search

	submitSearch() {
		let searchParams: any = {};

		for (const key in this.searchForm.value) {
			const value = this.searchForm.value[key];

			if (value !== null && value !== undefined && value !== '') {
				searchParams[key] = value;
			}
		}

		this.requestRead.emit(searchParams);
	}


	// submitSearch() {
	// 	let searchParams: any = {};
	// 	for (const key in this.searchForm.value) {
	// 		if (this.searchForm.value[key] !== null) {
	// 			searchParams[key] = this.searchForm.value[key]
	// 		}
	// 	}
	// 	this.requestRead.emit(searchParams)
	// }

	toggleSearchOptions(show: boolean = true) {
		if (show) {
			this.searchOptionsVisibility = true;
			this.advancedSearchOptionsVisibility = false;
		} else {
			this.searchOptionsVisibility = false;
			this.advancedSearchOptionsVisibility = false;
		}

		// SYNC FIX
		this.helpersService.saveSetting('searchVisibility', this.searchOptionsVisibility);
	}


	toggleAdvancedSearchOptions() {
		this.advancedSearchOptionsVisibility = !this.advancedSearchOptionsVisibility;
	}


	resetAdvancedSearchOptions() {
		this.requestRead.emit()
		this.searchForm.reset()
	}
//#endregion Search


//#region Row Selection

	toggleRowSelection(row: any): void {
		this.updateSelected();
		this.rowsSelected.emit(this.selectedRows());
	}


	toggleAllRows(event: any): void {
		if (event.target.checked) {

			this.currentData = this.apiDataResponse().results.filter(row => {
			row.selected = true;
			return true;
			});
		} else {
			this.deselectAllRows();
			this.currentData = [];
		}
		this.updateSelected();
		this.rowsSelected.emit(this.selectedRows());

		console.log(this.currentData)
	}

	updateSelected(): void {
		this.selectedRows.set(this.apiDataResponse().results.filter(row => row.selected));
	}

	deselectAllRows(): void {
		this.apiDataResponse().results.forEach(row => (row.selected = false));
		this.selectedRows.set([]);
		this.rowsSelected.emit(this.selectedRows());
	}

//#endregion


//#region Delete

	addSelectedToDeleteQueue() {
		this.recordsToDelete = []
		this.recordsToDelete = this.selectedRows()
		this.showDeleteConfirmation()
	}

	deleteSingleRecord(record: {}) {
		this.recordsToDelete = []
		this.recordsToDelete.push(record)
		this.showDeleteConfirmation()
	}

	async confirmDelete() {
		let allSuccessful: boolean = true;

		for (let record of this.recordsToDelete) {
			if(this.listConfig.unDeleteableIds.includes(record['id'])) {
				this.notificationService.error('You cannot delete the record: ' + record.name, '');
			} else {
				const success = await this.performDelete(record['id']);
				if (!success) {
					allSuccessful = false;
				}
			}
		}

		if (allSuccessful) {
			this.notificationService.success('All records were successfully deleted', '');
			this.selectedRows.set([])
		} else {
			this.notificationService.error('Some records could not be deleted', '');
		}
	}

	performDelete(id: number): Promise<boolean> {
		return new Promise((resolve) => {
			this.crudService.delete(id, this.sectionConfig.model)
			.subscribe({
				next: (res: any) => {
					this.emitRequestRead();
					resolve(true);
				},
				error: (error: any) => {
					this.crudService.notificationService.error('Error deleting the record', '');
					resolve(false);
				},
				complete: () => {
					this.closeDeleteConfirmation();
				}
			});
		});

	}
	
	closeDeleteConfirmation() {
		this.displayDeleteConfirmation = false;
	}

	showDeleteConfirmation() {
		this.displayDeleteConfirmation = true;
	}

//#endregion Delete


//#region Style

	changeFormSize() {
		if (this.sectionConfig.formSize === 'LARGE' || this.sectionConfig.formSize === 'MEDIUM') {
			this.sectionConfig.formSize = 'SMALL';
			this.formIsShrinked = true;
		} else {
			this.sectionConfig.formSize = this.originalFormSize;
			this.formIsShrinked = false;
		}
	}

//#endregion Style

//#region Pagination


	onPageChange(page?: number, rows?: number) {
		if (page !== undefined && rows !== undefined) {
			const currentPage = page + 1;
			const perPage = rows;
			// const url = `${this.sectionConfig.model}?page=${currentPage}&list_regs_per_page=${perPage}`;
			localStorage.setItem('perPage', perPage.toString());
			this.requestRead.emit({ page: currentPage })
			this.currentPage = currentPage;
		}
	}

//#endregion Pagination

	getRelationLabel(relationName: string, relationId: any, displayField: string): string {
		
		const relationList = this.crudService.apiDataResponse().relations[relationName];
		if (!relationList || !relationId) return '';

		const match = relationList.find((rel: any) => rel.id == relationId);
		return match ? match[displayField] : '';
	}

	relationsReady(): boolean {
		return this.listData.every(item => {
		  if (!item.isRelation) return true;
		  return !!this.crudService.apiDataResponse().relations[item.relationName];
		});
	}
}