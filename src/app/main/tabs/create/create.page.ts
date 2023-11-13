import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CreateTweetInterface } from 'src/app/interface/tweet.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  newTweet: CreateTweetInterface = {
    title: '',
    content: '',
  };

  ngOnInit() {
    this.newTweet = {
      title: '',
      content: '',
    };
  }

  CreatePost() {
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
      this.http
        .post(
          'https://funaticsbackend-production.up.railway.app/funa/create',
          this.newTweet
        )
        .subscribe((res: any) => {
          this.alert
            .create({
              header: 'Success',
              message: 'Your tweet has been created',
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
