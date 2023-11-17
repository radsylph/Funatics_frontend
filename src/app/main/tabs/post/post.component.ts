import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { identity, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  Tweet: TweetInterface = {
    _id: '',
    title: '',
    content: '',
    owner: {
      profilePicture: '',
      _id: '',
      name: '',
      lastname: '',
      username: '',
    },
    likes: 0,
    comments: 0,
    image: '',
    edited: false,
    isComment: false,
    PostToComment: '',
    createdAt: '',
    updatedAt: '',
  };
  ownerToken: any;

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  LikeToggleIcon = 'flame-outline';

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
  }

  async getToken() {
    await Preferences.get({ key: 'Ownertoken' }).then((res) => {
      this.ownerToken = res.value;
    });
    console.log('owner: ' + this.ownerToken);
  }

  toggleLike(): void {
    if (this.LikeToggleIcon == 'flame-outline') {
      this.LikeToggleIcon = 'flame';
    } else {
      this.LikeToggleIcon = 'flame-outline';
    }
  }

  viewUser(_id: string) {
    console.log('hla user');
    console.log(_id);
    this.navigation.navigateForward('/main/tabs/user');
  }

  async ngOnInit() {
    await this.getToken();
    const id = await Preferences.get({ key: 'tweetId' });
    console.log(id.value);
    try {
      this.http
        .get(
          `https://funaticsbackend-production.up.railway.app/funa/get/${id.value}`
        )
        .subscribe((res: any) => {
          console.log(res);
          this.Tweet = res.tweet;
        });
    } catch (error: any) {
      console.log(error.status);
      if (error.status == 500) {
        console.log('hola');
        this.deleteToken();
        this.alert
          .create({
            header: 'Session terminated',
            message: 'Please login again',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        this.navigation.navigateForward('/login');
      } else if (error.status == 401) {
        this.alert
          .create({
            header: 'Unauthorized',
            message: 'Please login to see this page',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
        this.navigation.navigateForward('/login');
      }
    }
  }
}
