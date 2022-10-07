import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RateComponent } from './components/rate/rate.component';


@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        AppComponent,
        RateComponent
    ],
    providers: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
