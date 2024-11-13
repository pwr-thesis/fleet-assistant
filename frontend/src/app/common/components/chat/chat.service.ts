/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private endpoint = environment.azureEndpoint;
    private apiKey = environment.azureApiKey;

    constructor(private http: HttpClient) {}

    sendMessage(messages: any[]): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
        });

        const body = {
            messages: messages,
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
        };

        return this.http.post<any>(this.endpoint, body, { headers });
    }
}
