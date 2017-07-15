import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {Web3Service} from '../shared/services/web3.service';
import {MetaCoinService} from '../shared/services/meta-coin.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Web3Service, MetaCoinService],
  bootstrap: [AppComponent]
})
export class AppModule { }
