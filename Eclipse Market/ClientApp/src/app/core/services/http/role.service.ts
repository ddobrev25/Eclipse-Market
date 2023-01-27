import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import {
  RoleAddRequest,
  RoleGetAllResponse,
  RoleUpdateRequest,
} from '../../models/role.model';
import { DeleteRequest } from '../../models/user.model';
import { PenTestService } from 'src/app/pen-test-service.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private httpWithoutInterceptor: HttpClient;
  private url = this.penTest.url;

  constructor(private http: HttpClient, private httpBackend: HttpBackend, private penTest: PenTestService) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  getAll() {
    var headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    return this.http.get<RoleGetAllResponse>(`${this.url}/Role/GetAll`, {
      headers: headers,
    });
  }
  add(body: RoleAddRequest) {
    var headers = new HttpHeaders({
      Accept: 'application/json',
      SkipLoader: ``,
    });
    return this.http.post(`${this.url}/Role/Add`, body, { headers: headers });
  }
  update(body: RoleUpdateRequest) {
    var headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-type': 'application/json',
      SkipLoader: ``,
    });
    return this.http.put(`${this.url}/Role/Update`, body, { headers: headers });
  }
  delete(body: DeleteRequest) {
    var headers = new HttpHeaders({
      'Content-type': 'application/json',
      SkipLoader: ``,
    });
    return this.http.delete(`${this.url}/Role/Delete`, {
      headers: headers,
      body: body,
    });
  }
}
