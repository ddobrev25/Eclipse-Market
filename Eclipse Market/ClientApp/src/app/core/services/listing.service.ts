import {
  HttpClient,
  HttpBackend,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IDelete } from '../models/delete.model';
import {
  IListingAddRequest,
  IListingGetByIdResponse,
  IListingGetRecommended,
  IListingGetResponse,
  IListingUpdateRequest,
} from '../models/listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private httpWithoutInterceptor: HttpClient;
  private url = 'http://localhost:5001';

  constructor(private http: HttpClient, private httpBackend: HttpBackend,
    private router: Router) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getAll() {
    return this.http.get<IListingGetResponse>(`${this.url}/Listing/GetAll`);
  }
  getById(id: number) {
    var headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    let queryParams = new HttpParams().set('id', id);
    return this.http.get<IListingGetByIdResponse>(
      `${this.url}/Listing/GetById`,
      { headers: headers, params: queryParams }
    );
  }
  getRecommended(count: number) {
    var headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    let queryParams = new HttpParams().set('count', count);
    return this.http.get<IListingGetRecommended>(
      `${this.url}/Listing/GetRecommended`,
      { headers: headers, params: queryParams }
    );
  }

  incrementViews(id: number) {
    const token = localStorage.getItem('token');
    if(!token) {
      this.router.navigate(['auth']);
      return;
    }

    var headers = new HttpHeaders({
      SkipLoader: ``,
    });
    let queryParams = new HttpParams().set('id', id);    
    return this.http.put(`${this.url}/Listing/IncrementViews`, null, {
      params: queryParams,
      headers: headers
    });
  }

  add(body: IListingAddRequest) {
    return this.http.post(`${this.url}/Listing/Add`, body);
  }

  update(body: IListingUpdateRequest) {
    return this.http.put(`${this.url}/Listing/Update`, body);
  }
  delete(body: IDelete) {
    return this.http.delete(`${this.url}/Listing/Delete`, { body: body });
  }
}
