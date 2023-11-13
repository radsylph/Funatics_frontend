import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpClient,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  async getToken() {
    try {
      const token = await Preferences.get({ key: 'token' });
      return token.value;
    } catch (error) {
      return    console.log(error);
    }
  }

  intercept(req: any, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedRoutes = [
      'https://funaticsbackend-production.up.railway.app/auth/register',
      'https://funaticsbackend-production.up.railway.app/auth/login',
    ];

    if (excludedRoutes.includes(req.url)) {
      return next.handle(req);
    }

    return from(this.getToken()).pipe(
      switchMap((token: any) => {
        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(cloned);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
