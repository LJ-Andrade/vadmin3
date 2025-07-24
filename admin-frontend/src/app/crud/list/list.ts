import { Component, computed, inject, Input, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CheckboxModule } from 'primeng/checkbox'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { SkeletonComponent } from '@components/skeleton/skeleton.component'
import { ToolbarModule } from 'primeng/toolbar'
import { Results } from '@src/app/interfaces/results.interface'
import { PaginatorModule } from 'primeng/paginator'
import { DialogModule } from 'primeng/dialog'
import { PanelModule } from 'primeng/panel'
import { NotificationService } from '@src/app/services/notification.service'
import { FormSize, SectionConfig } from '@src/app/interfaces/crud.interface'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroup } from 'primeng/inputgroup'
import { SelectModule } from 'primeng/select'
import { RelationLabelPipe } from '@src/app/pipes/relation-label.pipe'
import { HelpersService } from '@src/app/services/herlpers.service'
import { SplitButtonModule } from 'primeng/splitbutton'
import { DataService } from '@src/app/services/data.service'
import { Observable } from 'rxjs'

@Component({
	selector: 'app-list',
	templateUrl: './list.html',
	standalone: true,
	imports: [
		CommonModule, SkeletonComponent, ToolbarModule, CheckboxModule, FormsModule, ReactiveFormsModule,
		InputGroupAddonModule, InputTextModule, InputGroup, PaginatorModule, ButtonModule,
		DialogModule, PanelModule, SelectModule, RelationLabelPipe, SplitButtonModule,
	]
})

export class AppList {
	dataService: DataService = inject(DataService)
	notificationService: NotificationService = inject(NotificationService)
	helpersService: HelpersService = inject(HelpersService)

	@Input() sectionConfig: SectionConfig = {
		model: '', icon: '', nameSingular: '', namePlural: '',
		formSize: 'LARGE', gender: 'M'
	}
	@Input() listData: any[] = []
	@Input() listConfig: any = {}

	selectedRows = signal<any[]>([])
	selectedRowsCount = computed(() => this.selectedRows().length)
	currentData: any[] = []
	recordsToDelete: any[] = []
	currentPage = 1
	displayDeleteConfirmation = false
	
	searchForm: FormGroup = new FormGroup({})
	searchOptionsVisibility = false
	advancedSearchOptionsVisibility = false
	advancedSearchAvailable = true

	// originalFormSize: FormSize = this.sectionConfig.formSize
	formIsShrinked = false

	currentFilters: { [key: string]: any } = {}
	batchDeleteButtonVisible = false

	#state = signal<Results<any>>({
		loading: true,
		results: [],
		relations: {},
		pagination: undefined,
		error: ''
	})

	public results = computed(() => this.#state().results)
	public relations = computed(() => this.#state().relations)
	public pagination = computed(() => this.#state().pagination)
	public loading = computed(() => this.#state().loading)
	public error = computed(() => this.#state().error)

	private lastSearchParams: any = {}

	get rowsPerPage(): number {
		return Number(localStorage.getItem('perPage')) || 10;
	}

	ngOnInit() {
		this.searchOptionsVisibility = this.helpersService.loadSetting('searchVisibility', false);
		this.ensureSearchFormControls();
		// this.originalFormSize = this.sectionConfig.formSize;
		this.fetchRelation('roles', 'roles');
		this.fetchData({ page: 1, per_page: this.rowsPerPage });
	}

	fetchData(params: any = {}) {
		params['list_regs_per_page'] = this.rowsPerPage;
		this.currentPage = params['page'];
		this.read(this.sectionConfig.model, params);
	}

	fetchRelation(model: string, field: string) {
		this.dataService.getModelData(model).subscribe(data => this.appendRelation(model, data));
	}

	appendRelation(name: string, data: any) {
		this.#state.update(state => ({
			...state,
			relations: { ...state.relations, [name]: data }
		}));
	}

	read(url: string, params: any = {}) {
		const hasSearch = Object.values(params).some(
			v => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
		);
		this.lastSearchParams = hasSearch ? { ...params } : {};

		this.dataService.httpFetch(url, this.lastSearchParams).subscribe({
			next: res => this.#state.set({
				loading: false,
				results: res.data,
				relations: this.#state().relations,
				pagination: this.dataService.makePagination(res),
				error: ''
			}),
			error: err => console.log("Error on users ", err)
		});
	}

	clearResults() {
		this.#state.set({ loading: true, results: [], relations: [], pagination: undefined, error: '' });
		this.lastSearchParams = {};
	}

	clearSearchParams() {
		this.lastSearchParams = {};
	}

	ensureSearchFormControls() {
		if (!this.searchForm || !this.listData) return;
		this.listData.forEach(column => {
			if (column.search && !this.searchForm.contains(column.name)) {
				this.searchForm.addControl(column.name, new FormControl(''));
			}
		});
	}

	requestEdit(record: any) {
		console.log("Request edit", record);
	}

	
	// ---------------- Search ----------------

	submitSearch() {
		const searchParams = this.cleanSearchParams();
		this.currentFilters = { ...searchParams };
		this.currentPage = 1;
		this.fetchData({ ...searchParams, ...this.getDefaultPaginationParams() });
	}

	onKeywordSearch(keyword: string) {
		this.currentPage = 1;
		this.currentFilters = keyword?.trim() ? { keyword: keyword.trim() } : {};
		this.fetchData({ ...this.currentFilters, ...this.getDefaultPaginationParams() });
	}

	toggleSearchOptions(show: boolean = true) {
		this.searchOptionsVisibility = show;
		this.advancedSearchOptionsVisibility = false;
		this.helpersService.saveSetting('searchVisibility', show);
	}

	toggleAdvancedSearchOptions() {
		this.advancedSearchOptionsVisibility = !this.advancedSearchOptionsVisibility;
	}

	resetAdvancedSearchOptions() {
		this.searchForm.reset();
		this.currentPage = 1;
		this.fetchData({ page: 1, per_page: this.rowsPerPage });
	}


	// ---------------- Row Selection ----------------

	toggleRowSelection(row: any): void {
		this.updateSelected();
		this.onRowsSelected(this.selectedRows());
	}

	toggleAllRows(event: any): void {
		if (event.target.checked) {
			this.results().forEach(row => row.selected = true);
			this.currentData = [...this.results()];
		} else {
			this.deselectAllRows();
			this.currentData = [];
		}
		this.updateSelected();
		this.onRowsSelected(this.selectedRows());
		console.log(this.currentData);
	}

	updateSelected(): void {
		this.selectedRows.set(this.results().filter(row => row.selected));
	}

	deselectAllRows(): void {
		this.results().forEach(row => (row.selected = false));
		this.selectedRows.set([]);
		this.onRowsSelected(this.selectedRows());
	}

	onRowsSelected(rows: any[]): void {
		this.batchDeleteButtonVisible = rows.length > 0;
	}

	// ---------------- Delete ----------------

	addSelectedToDeleteQueue() {
		this.recordsToDelete = this.selectedRows();
		this.showDeleteConfirmation();
	}

	deleteSingleRecord(record: {}) {
		this.recordsToDelete = [record];
		this.showDeleteConfirmation();
	}

	async confirmDelete() {
		let allSuccessful = true;

		for (let record of this.recordsToDelete) {
			if (this.listConfig.unDeleteableIds.includes(record['id'])) {
				this.notificationService.error('You cannot delete the record: ' + record.name, '');
			} else {
				const success = await this.performDelete(record['id']);
				if (!success) allSuccessful = false;
			}
		}

		if (allSuccessful) {
			this.notificationService.success('All records were successfully deleted', '');
			this.selectedRows.set([]);
		} else {
			this.notificationService.error('Some records could not be deleted', '');
		}
	}

	performDelete(id: number): Promise<boolean> {
		return new Promise(resolve => {
			this.delete(id, this.sectionConfig.model).subscribe({
				next: () => {
					this.fetchData({ page: this.currentPage });
					resolve(true);
				},
				error: () => {
					this.notificationService.error('Error deleting the record', '');
					resolve(false);
				},
				complete: () => this.closeDeleteConfirmation()
			});
		});
	}

	closeDeleteConfirmation() {
		this.displayDeleteConfirmation = false;
	}

	showDeleteConfirmation() {
		this.displayDeleteConfirmation = true;
	}

	delete(id: number, route: string) {
		return new Observable(observer => {
			this.dataService.httpDelete(`${route}/${id}`).subscribe({
				next: res => observer.next(res),
				error: err => {
					console.log("Error on crudService ", err);
					observer.error(err);
				},
				complete: () => observer.complete()
			});
		});
	}

	// ---------------- Style ----------------

	changeFormSize() {
		if (['LARGE', 'MEDIUM'].includes(this.sectionConfig.formSize)) {
			this.sectionConfig.formSize = 'SMALL';
			this.formIsShrinked = true;
		} else {
			this.formIsShrinked = false;
		}
	}

	// ---------------- Pagination ----------------

	onPageChange(page?: number, rows?: number) {
		if (page !== undefined && rows !== undefined) {
			const currentPage = page + 1;
			localStorage.setItem('perPage', rows.toString());
			this.fetchData({
				...this.currentFilters,
				page: currentPage,
				per_page: rows
			});
			this.currentPage = currentPage;
		}
	}

	// ---------------- Relations ----------------

	getRelationLabel(relationName: string, relationId: any, displayField: string): string {
		const relationList = this.relations()[relationName];
		if (!relationList || !relationId) return '';
		const match = relationList.find((rel: any) => rel.id == relationId);
		return match ? match[displayField] : '';
	}

	relationsReady(): boolean {
		return this.listData.every(item =>
			!item.isRelation || !!this.relations()[item.relationName]
		);
	}

	// ---------------- Helpers ----------------

	private getDefaultPaginationParams() {
		return { page: 1, per_page: this.rowsPerPage };
	}

	private cleanSearchParams(): any {
		const clean: any = {};
		for (const key in this.searchForm.value) {
			const val = this.searchForm.value[key];
			if (this.isNotEmpty(val)) {
				clean[key] = val;
			}
		}
		return clean;
	}

	private isNotEmpty(value: any): boolean {
		return value !== null && value !== undefined && value !== '';
	}
}
