import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule, Routes } from '@angular/router';

//material imports
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material';
import { MatIconModule } from "@angular/material/icon";


import { AppComponent } from './app.component';
import { UchiYosoComponent } from './uchiYoso/uchi-yoso.component';
import { JisuushiComponent } from './jisuushi/jisuushi.component';

const appRoutes: Routes = [
  { path: 'uchi-yoso', component: UchiYosoComponent },
  { path: 'jisuushi', component: JisuushiComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    UchiYosoComponent,
    JisuushiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
