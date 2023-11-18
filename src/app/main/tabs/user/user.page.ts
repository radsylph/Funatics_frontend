import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { userProfile, newUser } from 'src/app/interface/user.interface';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
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
    email: '',
    profilePicture: '',
    _id: '',
  };

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete account',
          role: 'destructive',
          data: {
            action: 'delete',
          },
          handler: () => {
            this.deleteUser();
          },
        },
        {
          text: 'Sign off',
          role: 'Sign off',
          data: {
            action: 'Edit',
          },
          handler: () => {
            this.singOff();
          },
        },
        {
          text: 'change password',
          role: 'Change password',
          data: {
            action: 'Edit',
          },
          handler: () => {
            if (this.User.email) {
              this.resetPassword(this.User.email);
            }
          },
        },
      ],
    });

    await actionSheet.present();
  }

  editUser() {
    this.navigation.navigateForward('/main/tabs/biograf');
  }

  ngOnInit() {
    try {
      this.http
        .get('https://funaticsbackend-production.up.railway.app/auth/getUser')
        .subscribe((res: any) => {
          console.log(res);
          this.User = res.user;
          console.log(this.User);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async singOff() {
    await Preferences.remove({ key: 'token' });
    this.navigation.navigateForward('/login');
  }

  async deleteUser() {
    await Preferences.remove({ key: 'token' });
    try {
      await this.http
        .delete(
          'https://funaticsbackend-production.up.railway.app/auth/deleteUser'
        )
        .subscribe((res: any) => {
          this.alert
            .create({
              header: 'User deleted',
              message: 'Your user has been deleted',
              buttons: ['OK'],
            })
            .then((alert) => alert.present())
            .then(() => {
              this.navigation.navigateForward('/login');
            });
        });
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(email: string) {
    try {
      await this.http
        .post(
          'https://funaticsbackend-production.up.railway.app/auth/reset_password',
          { email }
        )
        .subscribe((res: any) => {
          console.log(res);
          this.alert
            .create({
              header: 'Reset password',
              message: 'Check your email',
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
          this.singOff();
        });
    } catch (error) {
      console.log(error);
      this.alert
        .create({
          header: 'Error',
          message: 'Something went wrong',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
    }
  }
}
