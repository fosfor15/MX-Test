import { Component, OnInit } from '@angular/core';
import { RateService } from 'src/app/service/rate.service';

import { Currency } from 'src/app/interfaces/currency';


@Component({
    selector: 'app-rate',
    templateUrl: './rate.component.html',
    styleUrls: [ './rate.component.scss' ]
})
export class RateComponent implements OnInit {

    /* Курс Евро к Рублю */
    private _rateEuroRub: number = 1;

    /* Геттер курса Евро к Рублю для безопасного чтения курса */
    public get rateEuroRub(): any {
        return this._rateEuroRub;
    }

    /* Сеттер для записи курса Евро к Рублю */
    private set rateEuroRub(currenciesMap: Map<string, Currency>) {
        this._rateEuroRub = currenciesMap.get('EUR')!.Value;
    }


    /* Инициализация компонента */
    constructor(
        private rateService: RateService
    ) { }

    ngOnInit(): void {
        this.getRates();
    }


    /* Метод для чтения и обработки курсов валют */
    private getRates(): void {
        this.rateService.getRate$()
            .subscribe((currenciesMap: Map<string, Currency>) => {
                console.log('currenciesMap :>> ', currenciesMap);
                this.rateEuroRub = currenciesMap;
                console.log('this.rateEuroRub :>> ', this.rateEuroRub);
            })
    }

}
