import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class QnaService {
    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    constructor(private httpClient: HttpClient) {
    }

    loadAllQna(page?:number, size?:number) {
        let params = new HttpParams();
        if (page) {
            params = params.append("page", page);
        }
        if (size) {
            params = params.append("size", size);
        }
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/v1/qna/find-all`, {
            params : params
        })
    }

}
