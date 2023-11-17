import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CreateTweetInterface } from 'src/app/interface/tweet.interface';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private storage: Storage
  ) {}

  newTweet: CreateTweetInterface = {
    title: '',
    content: '',
  };

  test: any;

  ownerToken: any;

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
  }

  async getToken() {
    await Preferences.get({ key: 'Ownertoken' }).then((res) => {
      this.ownerToken = res.value;
    });
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
      this.newTweet.image = image.dataUrl;
      this.test = image;
      console.log(this.newTweet.image);
    } catch (error) {
      console.log(error);
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

  async ngOnInit() {
    this.getToken();
    const id = await Preferences.get({ key: 'tweetId' });

    try {
      this.http
        .get(
          `https://funaticsbackend-production.up.railway.app/funa/get/${id.value}`
        )
        .subscribe((res: any) => {
          console.log(res);
          this.newTweet.title = res.tweet.title;
          this.newTweet.content = res.tweet.content;
          this.newTweet.image = res.tweet.image;
          console.log(this.newTweet);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async editPost() {
    const id = await Preferences.get({ key: 'tweetId' });
    if (this.newTweet.title == '') {
      this.alert
        .create({
          header: 'Error',
          message: 'You need to have a title atlas',
          buttons: ['Ok'],
        })
        .then((res) => {
          res.present();
        });
    }
    try {
      const blob = this.dataURLtoBlob(this.newTweet.image as string);
      const url = await this.uploadPicture(blob, this.test);
      console.log(url);
      this.newTweet.image = url;
    } catch (error) {
      console.log(error);
    }
    console.log(this.newTweet);
    try {
      this.http
        .put(
          `https://funaticsbackend-production.up.railway.app/funa/edit/${id.value}`,
          this.newTweet
        )
        .subscribe((res: any) => {
          this.alert
            .create({
              header: 'Success',
              message: 'Your tweet has been edited',
              buttons: ['Ok'],
            })
            .then((res) => {
              res.present();
            });
          this.navigation.navigateForward('/main/tabs/home');
        });
    } catch (error) {
      console.log(error);
    }
  }
}
