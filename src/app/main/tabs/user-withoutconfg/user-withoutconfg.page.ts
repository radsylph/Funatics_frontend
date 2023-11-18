import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { userProfile, newUser } from 'src/app/interface/user.interface';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-user-withoutconfg',
  templateUrl: './user-withoutconfg.page.html',
  styleUrls: ['./user-withoutconfg.page.scss'],
})
export class UserWithoutconfgPage implements OnInit {
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private http: HttpClient,
    private navigation: NavController,
    private alert: AlertController
  ) {}
  User: userProfile = {
    name: '',
    lastname: '',
    username: '',
    profilePicture: '',
    _id: '',
    followers: 0,
    isFollowing: false,
  };

  goBack() {
    this.navigation.back();
  }

  async followUser() {
    try {
      const id = await Preferences.get({ key: 'userId' });
      await this.http
        .put(
          `https://funaticsbackend-production.up.railway.app/funa/follow/${id.value}`,
          {}
        )
        .subscribe((res: any) => {
          console.log(res);
          if (res.message === 'User unfollowed') {
            this.User.followers = (this.User.followers ?? 0) - 1;
            this.User.isFollowing = false;
          }
          if (res.message === 'User followed') {
            this.User.followers = (this.User.followers ?? 0) + 1;
            this.User.isFollowing = true;
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    this.User = {
      name: '',
      lastname: '',
      username: '',
      profilePicture: '',
      _id: '',
      followers: 0,
    };
    const id = await Preferences.get({ key: 'userId' });
    try {
      this.http
        .get(
          `https://funaticsbackend-production.up.railway.app/auth/getUser/${id.value}`
        )
        .subscribe((res: any) => {
          console.log(res);
          this.User = res.user;
          this.User.isFollowing = res.follow.isFollowing;
          console.log(this.User);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
