import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { IUsers } from "../_models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    
    constructor(private http: HttpClient) {}
    
    url = "http://localhost:5001";

    logIn(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post(`${this.url}/User/Login`, body, {headers: headers, responseType: "json"});
    };
    
    register(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post(`${this.url}/User/Register`, body, {headers: headers, responseType: "json"});
    };
    
    getAll() {
        return this.http.get<IUsers>(`${this.url}/User/GetAll`);
    }

    getInfo() {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        return this.http.get(`${this.url}/User/GetInfo`, {headers: headers});
    }

    getById(id: number) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        let queryParams = new HttpParams().set('id', id)
        return this.http.get(`${this.url}/User/GetInfo`, {headers: headers, params: queryParams});
    }
    
    update(body: any) {
        var headers = new HttpHeaders({
            'Accept': 'application/json',
        });
        return this.http.put(`${this.url}/User/Update`, body, {headers: headers, responseType: "json"});
    }
    delete(id: number) {
        return this.http.delete(`${this.url}/User/Delete`)
    }
    
}