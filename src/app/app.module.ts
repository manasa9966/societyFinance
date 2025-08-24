import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    NgbModule,
    AngularFireModule.initializeApp({
      projectId: "society-finance-67af2",
      appId: "1:68770534547:web:10329f3dd79df4d90e6966",
      storageBucket: "society-finance-67af2.firebasestorage.app",
      apiKey: "AIzaSyBlNmgqXqIc9zgdMa_QpDWeqJkGRKbR48E",
      authDomain: "society-finance-67af2.firebaseapp.com",
      messagingSenderId: "68770534547"
    }),
    AngularFireDatabaseModule
  ],
  providers: [
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp({"projectId":"society-finance-67af2","appId":"1:68770534547:web:10329f3dd79df4d90e6966","storageBucket":"society-finance-67af2.firebasestorage.app","apiKey":"AIzaSyBlNmgqXqIc9zgdMa_QpDWeqJkGRKbR48E","authDomain":"society-finance-67af2.firebaseapp.com","messagingSenderId":"68770534547"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
