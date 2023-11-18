import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { userProfile } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public alertButtons = ['Filter'];
  public alertInputs = [
    {
      label: 'Most recent',
      type: 'radio',
      value: 'most_recent',
    },
    {
      label: 'Older',
      type: 'radio',
      value: 'older',
    },
    {
      label: 'More popular',
      type: 'radio',
      value: 'more_popular',
    },
    {
      label: 'Less popular',
      type: 'radio',
      value: 'less_popular',
    },
  ];
  searchTerm: string = '';
  AllTweets: TweetInterface[] = [];
  AllUsers: userProfile[] = [];
  actualSecition: string = 'Post';
  ownerToken: any;

  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async getTweets() {
    try {
      await this.http
        .get('https://funaticsbackend-production.up.railway.app/funa/get')
        .subscribe((res: any) => {
          console.log(res);
          this.AllTweets = res.tweets;
        });
    } catch (error) {
      console.log(error);
      this.alert
        .create({
          header: 'Error',
          message: 'Something went wrong with the tweets',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
    }
  }

  async getUsers() {
    try {
      await this.http
        .get(
          'https://funaticsbackend-production.up.railway.app/auth/getAllUsers'
        )
        .subscribe((res: any) => {
          console.log(res);
          this.AllUsers = res.users;
        });
    } catch (error) {
      console.log(error);
      this.alert
        .create({
          header: 'Error',
          message: 'Something went wrong with the users',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
    }
  }

  test() {
    console.log(this.searchTerm);
  }

  handleAlertDismiss(event: any) {
    console.log(event.detail);
    const value = event.detail.data.values;
    console.log(value);
    switch (value) {
      case 'most_recent':
        this.AllTweets.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        this.AllUsers.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case 'older':
        this.AllTweets.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        this.AllUsers.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
        break;
      case 'more_popular':
        this.AllTweets.sort((a, b) => (a.likes < b.likes ? 1 : -1));
        this.AllUsers.sort((a, b) => (a.followers < b.followers ? 1 : -1));
        break;
      case 'less_popular':
        this.AllTweets.sort((a, b) => (a.likes > b.likes ? 1 : -1));
        this.AllUsers.sort((a, b) => (a.followers > b.followers ? 1 : -1));
        break;
    }
  }

  get filteredTweets() {
    if (this.searchTerm) {
      return this.AllTweets.filter((tweet) =>
        tweet.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      return this.AllTweets;
    }
  }

  get filteredUsers() {
    if (this.searchTerm) {
      return this.AllUsers.filter((user) =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      return this.AllUsers;
    }
  }

  changeSection(ev: any) {
    console.log('se ha cambiado a ' + ev.detail.value);
    if (ev.detail.value === 'Post') {
      this.getTweets();
      this.actualSecition = 'Post';
    } else if (ev.detail.value === 'People') {
      this.actualSecition = 'People';
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
    await Preferences.set({ key: 'userId', value: _id });
    this.navigation.navigateForward('/main/tabs/user-withoutconfg');
  }

  async doRefresh(event: any) {
    location.reload();
  }

  async viewUserConfig() {
    // await Preferences.set({ key: 'userId', value: _id });
    this.navigation.navigateForward('/main/tabs/user');
  }

  async setToken() {
    await Preferences.set({ key: 'Ownertoken', value: this.ownerToken });
    console.log('owner: ' + this.ownerToken);
  }

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

  async makeComment(id: any) {
    await Preferences.set({ key: 'tweetId', value: id });
    this.navigation.navigateForward('/main/tabs/create-comment');
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

  ngOnInit() {
    this.getTweets();
    this.getUsers();
  }
}
