import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { userProfile } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  AllTweets: TweetInterface[] = [];
  ownerToken: any;
  LikeToggleIcon = 'flame-outline';
  likes: any;
  User: userProfile = {
    name: '',
    lastname: '',
    username: '',
    profilePicture: '',
    _id: '',
  };

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async toggleLike(tweet: any, _id: any) {
    try {
      this.http
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

  async EditTweet(id: any) {
    console.log(id);
    console.log('funciona');
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

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
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

  async ngOnInit() {
    await this.LoadTweets();
    Preferences.set({ key: 'Ownertoken', value: this.ownerToken });
    await this.setToken();
    try {
      this.http
        .get(`https://funaticsbackend-production.up.railway.app/auth/getUser`)
        .subscribe((res: any) => {
          console.log(res);
          this.User = res.user;
        });
    } catch (error) {
      console.log(error);
    }
  }

  viewPost(_id: string) {
    console.log(_id);
    console.log('hola');
    Preferences.set({ key: 'tweetId', value: _id });
    this.navigation.navigateForward('/main/tabs/post');
    this.ngOnInit();
  }

  async viewUser(_id: string) {
    // console.log('hla user');
    // console.log(_id);
    await Preferences.set({ key: 'userId', value: _id });
    this.navigation.navigateForward('/main/tabs/user');
  }

  async setToken() {
    await Preferences.set({ key: 'Ownertoken', value: this.ownerToken });
    console.log('owner: ' + this.ownerToken);
  }

  changeSection(ev: any) {
    console.log('se ha cambiado a ' + ev.detail.value);
    if (ev.detail.value === 'For_You') {
      this.LoadTweets();
    } else if (ev.detail.value === 'Following') {
      this.loadFollowersTweets();
    }
  }

  async LoadTweets() {
    try {
      this.http
        .get('https://funaticsbackend-production.up.railway.app/funa/get')
        .subscribe((res: any) => {
          console.log(res);
          this.ownerToken = res.OwnerInitial;
          this.AllTweets = res.tweets;
          this.AllTweets.map((tweet: any) => {
            tweet.LikeToggleIcon = 'flame-outline';
            return tweet;
          });
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
  }

  async loadFollowersTweets() {
    try {
      this.http
        .get(
          'https://funaticsbackend-production.up.railway.app/funa/followersTweets'
        )
        .subscribe((res: any) => {
          console.log(res);
          this.ownerToken = res.OwnerInitial;
          this.AllTweets = res.tweetsWithIsLiked;
          this.AllTweets.map((tweet: any) => {
            tweet.LikeToggleIcon = 'flame-outline';
            return tweet;
          });
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
  }

  async makeComment(id: any) {
    await Preferences.set({ key: 'tweetId', value: id });
    this.navigation.navigateForward('/main/tabs/create-comment');
  }
}
