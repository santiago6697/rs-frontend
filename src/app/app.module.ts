import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { ApiRequestService } from './services/api-request.service';

import { MapService } from './services/map.service';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// import { MapBoxModule } from 'angular-mapbox/module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // MapBoxModule.forRoot('pk.eyJ1Ijoic2FudGlhZ282Njk3IiwiYSI6ImNqejIybWFzYjAxejUzbXBmZ3J0dTBycHAifQ.l7h62D2gGH2mQyec49J2Kg')
  ],
  providers: [
    ApiRequestService,
    MapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
