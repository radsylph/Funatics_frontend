import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { HttpClient } from '@angular/common/http';
import { userProfile, newUser } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  constructor(
    private actionSheetCtrl: ActionSheetController,
    private http: HttpClient
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
    } catch (error) {}
  }
}
