import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  items = [
    { 
    img:'https://estaticos-cdn.sport.es/clip/0c9177bb-182c-4db2-9663-d5e01821f9a9_alta-libre-aspect-ratio_default_0.jpg',
    user:'AndresAl',
    username:'radsylph',
    date:"12345678",
    twitt:'diegoarf + Juan Romero. pasen videito cuando tengan relaciones, necesito porno de calidad',
    images:'https://dx35vtwkllhj9.cloudfront.net/universalstudios/bros/images/regions/ca/updates/onesheet.jpg' 
    },
    { 
      img:'https://pbs.twimg.com/media/F-MPEnqWoAAP-ce?format=jpg&name=small',
      user:'Bruh.mp4',
      username:'nohayluz52',
      date:"12345678",
      twitt:"- Le mostraste tu última imagen a pomni.\n - ¿¿Que es.??",
      images:'https://pbs.twimg.com/media/F-LiipQWUAAFcVx?format=jpg&name=small' 
      },
  
      { 
        img:'https://www.rollingstone.com/wp-content/uploads/2020/01/SturgillSimpson.jpg',
        user:'NyxDuodecim',
        username:'Nautico00',
        date:"12345678",
        twitt:'BombRushCyberfunk',
        images:'https://pbs.twimg.com/media/F5S34BjWsAECmiz?format=jpg&name=large' 
        },
      
  
  ]

  constructor() { }

  ngOnInit() {
  }

}
