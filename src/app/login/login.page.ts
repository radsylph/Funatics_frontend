import { Component, OnInit } from '@angular/core';
import { existingUser } from '../interface/user.interface';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface } from '../interface/error.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  existingUser: existingUser = {
    user_info: '',
    password: '',
  };

  ngOnInit() {
    this.existingUser = {
      user_info: '',
      password: '',
    };
  }

  async Login() {
    if (this.existingUser.user_info == '' || this.existingUser.password == '') {
      this.alert
        .create({
          header: 'Error',
          message: 'Please fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    this.http
      .post(
        'https://funaticsbackend-production.up.railway.app/auth/login',
        this.existingUser
      )
      .pipe(
        catchError((error) => {
          console.log(error);
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
      .subscribe((response) => {
        console.log(response);
        this.alert
          .create({
            header: 'Success',
            message: 'User logged successfully',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
      });
    this.navigation.navigateForward('/main/tabs/home');
  }
}
