import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { userProfile, newUser } from 'src/app/interface/user.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-withoutbtn',
  templateUrl: './user-withoutbtn.page.html',
  styleUrls: ['./user-withoutbtn.page.scss'],
})
export class UserWithoutbtnPage implements OnInit {

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private http: HttpClient,
    private navigation: NavController
  ) {}
  User: userProfile = {
    name: '',
    lastname: '',
    username: '',
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
        },
      ],
    });

    await actionSheet.present();
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
}
