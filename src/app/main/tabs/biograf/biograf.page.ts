import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { CreateTweetInterface } from 'src/app/interface/tweet.interface';
import { Capacitor } from '@capacitor/core';
import { ErrorInterface } from 'src/app/interface/error.interface';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { userProfile, newUser } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-biograf',
  templateUrl: './biograf.page.html',
  styleUrls: ['./biograf.page.scss'],
})
export class BiografPage implements OnInit {
  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private storage: Storage
  ) {}

  test: any;
  originalProfilePicture: string | undefined;
  User: userProfile = {
    name: '',
    lastname: '',
    username: '',
    profilePicture: '',
    _id: '',
  };

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
      this.User.profilePicture = image.dataUrl;
      this.test = image;
      console.log(this.User.profilePicture);
    } catch (error) {
      console.log(error);
    }
  }

  dataURLtoBlob(dataurl: string) {
    if (!dataurl || typeof dataurl !== 'string' || dataurl.length === 0) {
      return null;
    }
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

  async updateUser() {
    this.http
      .put(
        'https://funaticsbackend-production.up.railway.app/auth/editUser',
        this.User
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
            header: 'User updated',
            message: 'Your user has been updated',
            buttons: ['OK'],
          })
          .then((alert) => {
            alert.present();
          });
        this.navigation.navigateForward('/main/tabs/user');
      });
  }

  async ngOnInit() {
    try {
      await this.http
        .get('https://funaticsbackend-production.up.railway.app/auth/getUser')
        .subscribe((res: any) => {
          console.log(res);
          this.User = res.user;
          this.originalProfilePicture = res.user.profilePicture;
          console.log(this.User);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
