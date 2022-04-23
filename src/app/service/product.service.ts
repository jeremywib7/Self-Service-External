import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable, Subscription} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    constructor(private httpClient: HttpClient) {
    }

    loadAllProducts(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/customer/all/table`, {params})
            .pipe(map((data) => data || []))
    }

    loadProductDetailByName(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/productview/`, {params})
            .pipe(map((data) => data || []))
    }

}
