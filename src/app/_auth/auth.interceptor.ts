import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import {catchError, EMPTY, finalize, Observable} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {UserAuthService} from "../service/user-auth.service";
import {MessageService} from "primeng/api";


@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private userAuthService: UserAuthService,
        private router: Router,
        public messageService: MessageService,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.headers.get('No-Auth') === 'True') {
            return next.handle(req.clone());
        }

        const token = this.userAuthService.getToken();

        req = this.addToken(req, token);


        return next.handle(req).pipe(
            catchError(
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.userAuthService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Session Expired',
                            detail: 'Please log in again'
                        });
                        this.router.navigate(['/pages/login'])
                    } else if (err.status === 403) {
                        this.router.navigate(['/forbidden']);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Failed',
                            detail: err.error.message
                        });
                    }
                    return EMPTY;
                }
            ),
        );
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            }
        );
    }

}
