import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { newUser } from 'src/app/interface/user.interface';

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
  User: newUser = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    profilePicture: '',
    captchaResponse: '',
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

  // async getLikes(tweet: any) {
  //   try {
  //     this.http
  //       .get(`https://funaticsbackend-production.up.railway.app/funa/like`)
  //       .subscribe((res: any) => {
  //         this.likes = res.likes;
  //         console.log('test' + res);
  //         this.likes.map((like: any) => {
  //           console.log(like);
  //           if (like.owner == this.ownerToken) {
  //             console.log('liked');
  //             tweet.LikeToggleIcon = 'flame';
  //           } else {
  //             console.log('unliked');
  //             tweet.LikeToggleIcon = 'flame-outline';
  //           }
  //         });
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
    this.http
      .get('https://funaticsbackend-production.up.railway.app/funa/get')
      .pipe(
        catchError((error) => {
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
          return throwError(error);
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        this.ownerToken = res.OwnerInitial;
        this.AllTweets = res.tweets;
        this.AllTweets.map((tweet: any) => {
          tweet.LikeToggleIcon = 'flame-outline';
          return tweet;
        });
      });
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

  async viewPost(_id: string) {
    console.log(_id);
    console.log('hola');
    Preferences.set({ key: 'tweetId', value: _id });
    this.navigation.navigateForward('/main/tabs/post');
  }

  viewUser(_id: string) {
    console.log('hla user');
    console.log(_id);
    this.navigation.navigateForward('/main/tabs/user');
  }

  async setToken() {
    await Preferences.set({ key: 'Ownertoken', value: this.ownerToken });
    console.log('owner: ' + this.ownerToken);
  }
}
