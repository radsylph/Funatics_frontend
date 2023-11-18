import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface } from '../interface/error.interface';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  user: string = '';

  async resetPassword() {
    const email = this.user;
    this.http
      .post(
        'https://funaticsbackend-production.up.railway.app/auth/reset_password',
        { email }
      )
      .pipe(
        catchError((error) => {
          const errorsMessages = error.error.errors;
          const newErrors: Array<String> = [];
          console.log(errorsMessages);
          errorsMessages.forEach((element: ErrorInterface) => {
            newErrors.push(element.msg);
          });
          console.log(newErrors);
          this.alert
            .create({
              header: 'you have the following errors',
              message: newErrors.join(', '),
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();
            });
          return throwError(error);
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        this.alert
          .create({
            header: 'Reset password',
            message: 'Check your email',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
      });
  }

  ngOnInit() {}
}
