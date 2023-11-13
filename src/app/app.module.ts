import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './service/auth.interceptor';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA6_fRObe50jnovhZHP8WhGHY5Lnr8_Wt0',
  authDomain: 'funatics-1699583872359.firebaseapp.com',
  projectId: 'funatics-1699583872359',
  storageBucket: 'funatics-1699583872359.appspot.com',
  messagingSenderId: '866418440256',
  appId: '1:866418440256:web:e88a321a59bd85f00b07a5',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'funatics-1699583872359',
        appId: '1:866418440256:web:e88a321a59bd85f00b07a5',
        storageBucket: 'funatics-1699583872359.appspot.com',
        apiKey: 'AIzaSyA6_fRObe50jnovhZHP8WhGHY5Lnr8_Wt0',
        authDomain: 'funatics-1699583872359.firebaseapp.com',
        messagingSenderId: '866418440256',
      })
    ),
    provideStorage(() => getStorage()),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
