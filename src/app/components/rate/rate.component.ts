import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rate',
    templateUrl: './rate.component.html',
    styleUrls: [ './rate.component.scss' ]
})
export class RateComponent implements OnInit {

    public rateEuroRub: number = 1;

    constructor() { }

    ngOnInit(): void { }

}
