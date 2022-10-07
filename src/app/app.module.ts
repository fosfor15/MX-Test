import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
import { RateComponent } from './components/rate/rate.component';


registerLocaleData(localeRu, 'ru-RU');


@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        RateComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'ru-RU' }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
