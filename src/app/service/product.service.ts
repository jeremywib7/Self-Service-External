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

    public uploadImage(productId: string, imageFiles: File[]) {

        if (imageFiles) {

            const formData: FormData = new FormData();
            formData.append('productId', productId);
            imageFiles.forEach((obj) => {
                formData.append('files', obj);
            });

            return this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/product/upload`, formData, {
                reportProgress: true,
                observe: 'events'
            });

        }

        return null;
    }

    downloadProductImage(params: HttpParams): Observable<HttpEvent<Blob>> {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/images/product/download/file`, {
            params,
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        });
    }

    public getUUID() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/uuid`);
    }

    //aka set to unassigned
    removeProductInCategory(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/remove`, {params});
    }

    loadAllProducts(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/customer/all/table`, {params})
            .pipe(map((data) => data || []))
    }

    loadProductCategories() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/all`)
            .pipe(map((data: any) => data || []))
    }

    loadProductsByNameAutoComplete(searchValue: string) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByNameAutoComplete?name=` + searchValue)
            .pipe(map((data) => data || []))
    }

    loadProductsSearchByName(searchValue: string) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByName?name=` + searchValue)
            .pipe(map((data) => data || []))
    }

    loadProductDetailByName(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/productview/`, {params})
            .pipe(map((data) => data || []))
    }

    loadProductsByFilter(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory`, {params})
            .pipe(map((data) => data || []))
    }

}
