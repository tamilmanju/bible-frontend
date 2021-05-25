import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiHeaders: any;
  authorization: any;
  constructor(private http: HttpClient,
              private titleService: Title,
              ) { }
  headers = () => {
    this.apiHeaders = new HttpHeaders();
    this.apiHeaders.headers['Access-Control-Allow'] = '*';
    this.apiHeaders.headers['X-BEARER-TOKEN'] = '';
    this.apiHeaders.headers['x-forwarded-for'] = '';
    this.apiHeaders.headers['Accept'] = 'application/json';
    this.apiHeaders.headers['X-REQUEST-TYPE'] = 'web';
    this.apiHeaders.headers['X-LANGUAGE-CODE'] = 'en';
    
    return this.apiHeaders;
  }
  callPostAPI(url: string, parameters: any) {
    return this.http.post<any>(environment.apiUrl + url, parameters, this.headers())
      .pipe(map(
        (data:any ) => {
          return data;
        }
      ));
  }
  callGetAPI(url: string) {
    return this.http.get<any>(environment.apiUrl + url, this.headers())
      .pipe(map(
        (data:any ) => {
          return data;
        }
      ));
  }
  callPutAPI(url: string, parameters: any) {
    return this.http.put<any>(environment.apiUrl + url, parameters, this.headers())
      .pipe(map(
        (data:any ) => {
          return data;
        }
      ));
  }
  successToast(data: string) {
    alert(data);
  }

  failureToast(data: string) {
    alert(data);
  }
  failureResponse(data: any, url = null) {
    if (data.error.statusCode === 422 || data.error.statusCode === 500) {
      if (typeof data.error.message === 'string' || data.error.message instanceof String) {
        this.failureToast(data.error.message);
      }
    }
  }
}

