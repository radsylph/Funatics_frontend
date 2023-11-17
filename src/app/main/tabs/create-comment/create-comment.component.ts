import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CreateTweetInterface } from 'src/app/interface/tweet.interface';
import { Capacitor } from '@capacitor/core';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss'],
})
export class CreateCommentComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private storage: Storage
  ) {}

  newComment: CreateTweetInterface = {
    title: '',
    content: '',
    image: '',
  };

  test: any;

  ngOnInit() {
    this.newComment = {
      title: '',
      content: '',
      image: '',
    };
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
      this.newComment.image = image.dataUrl;
      this.test = image;
      console.log(this.newComment.image);
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

  async createComment() {
    const id = await Preferences.get({ key: 'tweetId' });

    try {
      const blob = this.dataURLtoBlob(this.newComment.image as string);
      const url = await this.uploadPicture(blob, this.test);
      console.log(url);
      this.newComment.image = url;
    } catch (error) {
      console.log(error);
    }
    console.log(this.newComment);
    try {
      await this.http
        .post(
          `https://funaticsbackend-production.up.railway.app/funa/comment/${id.value}`,
          this.newComment
        )
        .subscribe((res: any) => {
          this.alert
            .create({
              header: 'Success',
              message: 'Your comment has been created',
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
