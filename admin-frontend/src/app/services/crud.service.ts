import { Injectable, computed, inject, signal } from '@angular/core';
import { Results } from '@src/app/interfaces/results.interface';
import { DataService } from '@src/app/services/data.service';
import { NotificationService } from '@src/app/services/notification.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class CrudService extends DataService  {

	notificationService: NotificationService = inject(NotificationService);
	dataService: DataService = inject(DataService);

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

	public apiDataResponse = this.#state;
	
	public clearResults() {
		this.#state.set({ loading: true, results: [], relations: [], pagination: undefined, error: '' })
	}

	public read(url: string, params: any = {}, debug: boolean = false) {
		
		this.dataService.httpFetch(url, params)
			.subscribe({
				next: (res: any) => {
					this.#state.set({
						loading: false,
						results: res.data,
						relations: this.#state().relations,
						pagination: this.dataService.makePagination(res.meta),
						error: ''
					})
					if (debug) console.log("State ", this.#state());
				},
				error: (error: any) => {
					console.log("Error on users ", error)
				},
				complete: () => {
				}
			});
	}

	public appendRelation(name: string, data: any) {
		this.#state.update(state => ({
			...state,
			relations: {
				...state.relations,
				[name]: data
			}
		}));

		// console.log("Relations ", this.#state())
	}

	save(data: any, model: string): Observable<any>  {
		
		this.#state.update(state => ({ ...state, loading: true }))
		
		if (data.id == null) {
			return this.create(data, model);
		} else {
			return this.update(data, model);
		}

	}

	create(data: any, model: string): Observable<any>  {
		

		return new Observable(observer => {
			this.httpPost(model, data).subscribe({
				next: (res: any) => {
					res.meta = { operation: 'create' }
					observer.next(res);
				},
				error: (error: any) => {
					this.#state.update(state => ({ ...state, loading: false }))
					observer.error(error);
				},
				complete: () => {
					this.#state.update(state => ({ ...state, loading: false }))
					observer.complete();

				}
			});
		});

	}

	update(data: any, model: string): Observable<any>  {
		return new Observable(observer => {
			this.httpPut(model+'/'+data.id, data).subscribe({
				next: (res: any) => {
					res.meta = { operation: 'update' }
					observer.next(res);
				},
				error: (error: any) => {
					observer.error(error);
				},
				complete: () => {
					this.#state.update(state => ({ ...state, loading: true }))
					observer.complete();
				}
			});
		});
	}

	delete(id: number, route: string) {

		return new Observable(observer => {
			this.httpDelete(route+'/'+id).subscribe({
				next: (res: any) => {
					observer.next(res);
				},
				error: (error: any) => {
					console.log("Error on crudService ", error);
					observer.error(error);
				},
				complete: () => {
					observer.complete();
				}
			});
		});
	}


	getFormData(data: any, isEdit: boolean = false): any {
		let formData = new FormData();

		if (data == undefined) {
			console.error("Data is undefined on save method.")
			return formData
		}

		for(let key in data) {
			let value = data[key]

			if (Array.isArray(value)) {
				formData.append(key, JSON.stringify(data[key]))
			} else {
				formData.append(key, value);
			}
		}

		if(isEdit) {
			formData.append('_method', 'PUT')
		}

		return formData
	}


}
