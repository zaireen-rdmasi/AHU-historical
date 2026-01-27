import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // works fine with standalone components
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getData(url: string, queryParams?: HttpParams): Observable<any> {
    return this.http.get(url, { params: queryParams });
  }

  postData(url: string, data: any): Observable<any> {
    return this.http.post(url, data);
  }

  updateData(url: string, data: any): Observable<any> {
    return this.http.put(url, data); // changed to PUT for updates
  }

  deleteData(url: string): Observable<any> {
    return this.http.delete(url);
  }

  downloadFileData(url: string, data: any): Observable<any> {
    return this.http.post(url, data, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
