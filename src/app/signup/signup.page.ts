import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { newUser } from '../interface/user.interface';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface } from '../interface/error.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  newUser: newUser = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
  };

  ngOnInit() {
    this.newUser = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
    };
  }

  async signup() {
    if (
      this.newUser.name == '' ||
      this.newUser.lastname == '' ||
      this.newUser.username == '' ||
      this.newUser.email == '' ||
      this.newUser.password == '' ||
      this.newUser.repeat_password == ''
    ) {
      this.alert
        .create({
          header: 'Error',
          message: 'Please fill all the fields',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    if (this.newUser.password != this.newUser.repeat_password) {
      this.alert
        .create({
          header: 'Error',
          message: 'The passwords does not match',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    if (this.newUser.password.length < 6) {
      this.alert
        .create({
          header: 'Error',
          message: 'Password must be at least 6 characters long',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    console.log(this.newUser);
    await this.http
      .post(
        'https://funaticsbackend-production.up.railway.app/auth/create',
        this.newUser
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
      .subscribe((response) => {
        console.log(response);
        this.alert
          .create({
            header: 'Success',
            message: 'User created successfully',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        this.navigation.navigateForward('/login');
      });
  }
}
