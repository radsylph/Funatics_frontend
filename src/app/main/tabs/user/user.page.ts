import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor(private actionSheetCtrl: ActionSheetController) { }

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
      ],
    });

    await actionSheet.present();
  }

  ngOnInit() {
  }

}
