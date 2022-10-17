import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import * as X2JS from 'x2js';
const x2js = new X2JS();

import { Currency } from '../interfaces/currency';


@Injectable({
    providedIn: 'root'
})
export class RatesXmlService {

    /* XML-эндпоинт для получения курса Евро к Рублю */
    private endpoint: string = 'https://www.cbr-xml-daily.ru/daily_utf8.xml';


    /* Инициализация сервиса */
    constructor(
        private httpClient: HttpClient
    ) { }


    /* Метод для получения курсов валют к Рублю */
    getRates$(): Observable<Map<string, Currency>> {
        return this.httpClient.get(this.endpoint, { responseType: 'text' })
            .pipe(
                map((data: string) => this.processData(data))
            );
    }

    /* Метод для обработки данных в ответах сервера */
    private processData(data: string): Map<string, Currency> {

        /* Создание структуры Map, где в качестве ключей используются буквенные коды валют charCode, а в качестве значений используется весь объект валюты */
        const currenciesMap: Map<string, Currency> = new Map<string, Currency>();

        const dataObj = x2js.xml2js(data) as { ValCurs: any };

        dataObj.ValCurs.Valute.forEach((currency: Currency) => {
            /* Преобразование значения курса к числовому типу */
            currency = {
                ...currency,
                Value: parseFloat( String(currency.Value).replace(',', '.') )
            };

            currenciesMap.set(currency.CharCode, currency);
        });

        return currenciesMap;
    }


}
