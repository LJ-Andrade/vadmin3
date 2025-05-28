import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiQueryService {
  
  
  constructor(private http: HttpClient) {}

  runQuery(prompt: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any[]>(environment.apiUrl + 'ai-query', { prompt }, { headers });
  }

  runRawChat(prompt: string) {
    return this.http.post<{ response: string }>(environment.apiUrl + 'ai-chat', { prompt });
  }
}
