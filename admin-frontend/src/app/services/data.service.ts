import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Pagination } from '../interfaces/results.interface';
import { environment } from '@src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	private http = inject(HttpClient);

	protected defaultOptions = {
		headers: new HttpHeaders({
			// 'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem(environment.tokenKeyName)}`
		})
	};

	
	testConnection(): void {
		this.http.get(`${environment.apiUrl}health`)
			.subscribe({
				next: (res: any) => {
					console.log(res);
				},
				error: (err: any) => {
					console.log(err);
				}
			});

	}

	getQueryString(params: any): string {
		if (params && Object.keys(params).length > 0) {
			const queryString = Object.keys(params).map(function (key) {
				if (Array.isArray(params[key]) && params[key].length > 0)
					return key + '[]=' + params[key].join('&' + key + '[]=');
				return key + '=' + params[key];
			}).join('&');
			return queryString ? `?${queryString}` : '';
		}
		return '';
	}

	httpFetch<T>(url: string, params?: any, options?: any): Observable<any> {
		return this.http.get<T>(`${environment.apiUrl}${url}${this.getQueryString(params)}`, options ?? this.defaultOptions);
	}

	// httpPost<T>(url: string, body: any, options?: any): Observable<any> {
	// 	return this.http.post<T>(`${environment.apiUrl}${url}`, body, options ?? this.defaultOptions);
	// }
 
	// httpPut<T>(url: string, body: any, options?: any): Observable<any> {
	// 	return this.http.put<T>(`${environment.apiUrl}${url}`, body, options ?? this.defaultOptions);
	// }
	
	httpPost<T>(url: string, body: any, options?: any): Observable<any> {
		return this.http.post<T>(
			`${environment.apiUrl}${url}`,
			body,
			options ?? { headers: this.getHeadersForBody(body) }
		);
	}
	
	httpPut<T>(url: string, body: any, options?: any): Observable<any> {
		return this.http.put<T>(
			`${environment.apiUrl}${url}`,
			body,
			options ?? { headers: this.getHeadersForBody(body) }
		);
	}

	httpDelete<T>(url: string, options?: any): Observable<any> {
		return this.http.delete<T>(`${environment.apiUrl}${url}`, options ?? this.defaultOptions);
	}


	getDataFromModel<T>(model: string, params?: any): Observable<any> {
		return this.httpFetch<T>(model + this.getQueryString(params));
	}

	makePagination<T>(paginationData: Pagination<T>): any {
		// console.log("Pagination data: ", paginationData);
		if (!paginationData) {
			console.error('No pagination data provided by the server');
			return null;
		}

		return {
			current_page: paginationData.current_page,
			first_page_url: paginationData.first_page_url,
			from: paginationData.from,
			last_page: paginationData.last_page,
			last_page_url: paginationData.last_page_url,
			links: paginationData.links,
			next_page_url: paginationData.next_page_url,
			path: paginationData.path,
			list_regs_per_page: paginationData.per_page,
			prev_page_url: paginationData.prev_page_url,
			to: paginationData.to,
			total: paginationData.total
		};
	}

	getModelData(modelName: string) {
		return this.getDataFromModel(modelName).pipe(
			map((response: any) => response.data),
			catchError((error) => {
				console.error(`Error fetching ${modelName}:`, error);
				return of([]);
			})
		);
	}

	private getHeadersForBody(body: any): HttpHeaders {
		const isFormData = body instanceof FormData;
	
		return isFormData
			? new HttpHeaders({
				'Authorization': `Bearer ${localStorage.getItem(environment.tokenKeyName)}`
			})
			: this.defaultOptions.headers;
	}
}
