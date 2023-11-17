import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { identity, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

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

  comments: TweetInterface[] = [];
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  LikeToggleIcon = 'flame-outline';

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
  }

  goBack() {
    this.navigation.back();
  }

  async deleteTweet(id: any) {
    try {
      this.http
        .delete(
          `https://funaticsbackend-production.up.railway.app/funa/delete/${id}`
        )
        .subscribe((res: any) => {
          console.log(res);
          this.alert
            .create({
              header: 'Tweet deleted',
              message: 'Your tweet has been deleted',
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
          this.ngOnInit();
        });
    } catch (error) {
      console.log(error);
    }
  }

  async makeComment(id:any) {
    await Preferences.set({ key: 'tweetId', value: id });
    this.navigation.navigateForward('/main/tabs/create-comment');
  }

  async viewPost(_id: string) {
    console.log('hla post');
    console.log(_id);
    await Preferences.set({ key: 'tweetId', value: _id });
    this.ngOnInit();
  }

  async EditTweet(id: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.alert
              .create({
                header: 'Delete tweet',
                message: 'Are you sure you want to delete this tweet?',
                buttons: [
                  {
                    text: 'Yes',
                    handler: () => {
                      this.deleteTweet(id);
                    },
                  },
                  {
                    text: 'No',
                    handler: () => {},
                  },
                ],
              })
              .then((alert) => alert.present());
          },
        },
        {
          text: 'Edit',
          role: 'modification',
          handler: () => {
            console.log('Edit clicked');
            Preferences.set({ key: 'tweetId', value: id });
            this.navigation.navigateForward('/main/tabs/edit');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }

  async getToken() {
    await Preferences.get({ key: 'Ownertoken' }).then((res) => {
      this.ownerToken = res.value;
    });
    console.log('owner: ' + this.ownerToken);
  }

  async toggleLike(tweet: any, _id: any) {
    try {
      await this.http
        .put(
          `https://funaticsbackend-production.up.railway.app/funa/like/${_id}`,
          {}
        )
        .subscribe((res: any) => {
          console.log(res.message);
          if (res.message === 'Post unliked') {
            console.log('unliked');
            tweet.likes--;
            tweet.isLiked = false;
          } else if (res.message === 'Post liked') {
            console.log('liked');
            tweet.likes++;
            tweet.isLiked = true;
          }
        });
    } catch (error) {
      console.log(error);
      this.alert
        .create({
          header: 'Error',
          message: 'Something went wrong with the like',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
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
          this.Tweet = res.tweetsWithIsLiked;
          console.log(this.Tweet);
        });
    } catch (error: any) {
      console.log(error.status);
      if (error.status == 500) {
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

    try {
      await this.http
        .get(
          `https://funaticsbackend-production.up.railway.app/funa/comments/${id.value}`
        )
        .subscribe((res: any) => {
          console.log(res);
          this.comments = res.commentsWithIsLiked;
          // this.comments = res.tweetsWithIsLiked;
        });
    } catch (error) {
      console.log(error);
    }
  }
}
