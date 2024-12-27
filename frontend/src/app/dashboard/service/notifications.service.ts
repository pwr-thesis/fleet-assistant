import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseUrl = environment.apiUrl + '/notification'; 

  constructor(private http: HttpClient) {}

  sendNotification(notification: { title: string; message: string; email: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}`, notification);
  }

  getUserNotifications(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
