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
			this.lastSearchParams = {}; // Limpiar los parámetros de búsqueda
		}

		public clearSearchParams() {
			this.lastSearchParams = {};
		}

		private lastSearchParams: any = {};

		public read(url: string, params: any = {}) {
			// Si la búsqueda está vacía, limpiar los parámetros
			const hasSearch = Object.values(params).some(v => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0));

			// ✅ Reemplazo directo y simple:
			this.lastSearchParams = hasSearch ? { ...params } : {}; // ← Reemplaza totalmente el objeto, no lo mergea

			this.dataService.httpFetch(url, this.lastSearchParams)
				.subscribe({
					next: (res: any) => {
						this.#state.set({
							loading: false,
							results: res.data,
							relations: this.#state().relations,
							pagination: this.dataService.makePagination(res),
							error: ''
						});
					},
					error: (error: any) => {
						console.log("Error on users ", error);
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


			// SYNC FIX
			const id = data instanceof FormData ? data.get('id') : data.id;

			if (id == null || id === '' || id === 'null') {
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

		// SYNC FIX
		update(data: any, model: string): Observable<any>  {
			const id = data instanceof FormData ? data.get('id') : data.id;
		
			return new Observable(observer => {
				this.httpPost(`${model}/${id}`, data).subscribe({
					next: (res: any) => {
						res.meta = { operation: 'update' };
						observer.next(res);
					},
					error: (error: any) => {
						// SYNC FIX
						this.#state.update(state => ({ ...state, loading: false }))
						observer.error(error);
					},
					complete: () => {
						// SYNC FIX
						this.#state.update(state => ({ ...state, loading: false }))
						observer.complete();
					}
				});
			});
		}
		

		// update(data: any, model: string): Observable<any>  {
		// 	return new Observable(observer => {
		// 		this.httpPut(model+'/'+data.id, data).subscribe({
		// 			next: (res: any) => {
		// 				res.meta = { operation: 'update' }
		// 				observer.next(res);
		// 			},
		// 			error: (error: any) => {
		// 				observer.error(error);
		// 			},
		// 			complete: () => {
		// 				this.#state.update(state => ({ ...state, loading: true }))
		// 				observer.complete();
		// 			}
		// 		});
		// 	});
		// }

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

		setPerPageAndReload(perPage: number, model: string) {
			localStorage.setItem('perPage', String(perPage));
			this.read(model, { list_regs_per_page: perPage, page: 1 });
		}
	}

