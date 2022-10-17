import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, timer, switchMap, catchError } from 'rxjs';

import { RatesXmlService } from 'src/app/services/rates-xml.service';
import { RatesJsonService } from 'src/app/services/rates-json.service';

import { Currency } from 'src/app/interfaces/currency';


@Component({
    selector: 'app-rate-euro',
    templateUrl: './rate-euro.component.html',
    styleUrls: [ './rate-euro.component.scss' ]
})
export class RateEuroComponent implements OnInit, OnDestroy {

    /* Курс Евро к Рублю */
    private _rateEuroRub: number = 1;

    /* Геттер курса Евро к Рублю для безопасного чтения курса */
    public get rateEuroRub(): any {
        return this._rateEuroRub;
    }

    /* Сеттер для записи курса Евро к Рублю из структуры Map */
    private set rateEuroRub(currenciesMap: Map<string, Currency>) {
        this._rateEuroRub = currenciesMap.get('EUR')!.Value;
    }

    /* Массив сервисов для получения курса валют к Рублю */
    private ratesServices: Array<any> = [];

    /* Подписка на чтение курсов валют каждые 10 секунд */
    private ratesSub!: Subscription;


    /* Инициализация компонента */
    constructor(
        private ratesXmlService: RatesXmlService,
        private ratesJsonService: RatesJsonService
    ) {
        this.ratesServices = Array.from(arguments);
    }

    ngOnInit(): void {
        /* Запуск чтения курсов валют */
        this.getRates();

        /* Установка порядка опроса сервисов */
        this.setRatesServicesOrder([ 1, 2 ]);
    }


    /* Метод запуска чтения курсов валют каждые 10 секунд */
    private getRates(): void {
        this.ratesSub = timer(0, 1e4)
            .pipe(
                switchMap(() =>
                    this.getRatesByService$(0)
                )
            )
            .subscribe((currenciesMap: Map<string, Currency>) => {
                this.rateEuroRub = currenciesMap;
            });
    }

    /* Метод для чтения курсов валют по одному сервису */
    private getRatesByService$(ratesServiceId: number): Observable<Map<string, Currency>> {
        return this.ratesServices[ratesServiceId].getRates$()
            .pipe(
                catchError(() =>
                    this.getRatesByService$( ++ratesServiceId % this.ratesServices.length )
                )
            );
    }

    /**
     * Метод установки порядка опроса сервисов
     * @param order – массив порядка опроса, где элемент массива order представляет порядковый номер опроса сервиса, который соответствует индексу элемента order
     * @todo – необходимы проверки на повторение порядковых номеров и на превышение длины массива order
     */
    public setRatesServicesOrder(order: Array<number>): void {
        this.ratesServices = this.ratesServices.reduce(
            (intRatesServices: Array<number>, ratesService: any, i: number) => {
                intRatesServices[ --order[i] ] = ratesService;
                return intRatesServices;
            }, new Array(this.ratesServices.length)
        );
    }


    /* Уничтожение компонента */
    ngOnDestroy(): void {
        this.ratesSub.unsubscribe();
    }

}
