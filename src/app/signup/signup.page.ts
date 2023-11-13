import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { newUser } from '../interface/user.interface';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorInterface } from '../interface/error.interface';
import { NavController } from '@ionic/angular';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { RecaptchaComponent } from 'ng-recaptcha';
import { Capacitor } from '@capacitor/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  template: `<re-captcha
    (resolved)="resolved($event)"
    siteKey="YOUR_SITE_KEY"
  ></re-captcha>`,
})
export class SignupPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private storage: Storage
  ) {}
  image: any;
  test: any;
  newUser: newUser = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    captchaResponse: undefined,
    profilePicture: '',
  };

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.newUser.captchaResponse = captchaResponse;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  ngOnInit() {
    this.newUser = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      captchaResponse: undefined,
      profilePicture: '',
    };
  }

  showPassword() {
    const input = document.getElementById('password') as HTMLInputElement;
    const button = document.getElementById('show_password') as HTMLInputElement;
    if (input.type == 'password') {
      input.type = 'text';
      button.name = 'eye-off';
    } else {
      input.type = 'password';
      button.name = 'eye';
    }
  }

  showRepeatPassword() {
    const input = document.getElementById(
      'repeat_password'
    ) as HTMLInputElement;
    const button = document.getElementById(
      'show_repeat_password'
    ) as HTMLInputElement;
    if (input.type == 'password') {
      input.type = 'text';
      button.name = 'eye-off';
    } else {
      input.type = 'password';
      button.name = 'eye';
    }
  }

  async takePicture() {
    try {
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        width: 500,
      });
      console.log(image);
      this.newUser.profilePicture = image.dataUrl;
      this.test = image;
      console.log(this.newUser.profilePicture);
      // const blob = this.dataURLtoBlob(this.newUser.profilePicture as string);
      // const url = await this.uploadPicture(blob, image);
      // console.log(url);
      // this.newUser.profilePicture = url;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadPicture(blob: any, imageData: any) {
    console.log('la wea loca' + imageData);
    try {
      const currentDate = Date.now();
      const filePath = `profilePictures/${currentDate}.${imageData.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (error) {
      throw error;
    }
  }

  dataURLtoBlob(dataurl: string) {
    let arr = dataurl.split(','),
      match = arr[0].match(/:(.*?);/),
      mime = match ? match[1] : '',
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
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
    if (!this.newUser.captchaResponse) {
      this.alert
        .create({
          header: 'Error',
          message: 'Please verify that you are not a robot',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }
    const blob = this.dataURLtoBlob(this.newUser.profilePicture as string);
    const url = await this.uploadPicture(blob, this.test);
    console.log(url);
    this.newUser.profilePicture = url;
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
        console.log(response);
        this.navigation.navigateForward('/login');
      });
  }
}
