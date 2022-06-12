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
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/customer/product/all`, {params})
            .pipe(map((data) => data || []))
    }

    loadProductDetailByName(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/productview/`, {params})
            .pipe(map((data) => data || []))
    }

    loadAllProductCategoryForDropdowns() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/customer/product-category/all`,)
            .pipe(map((data) => data || []))
    }

    loadBestSeller() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/customer/best-seller`,)
            .pipe(map((data) => data || []))
    }

}
