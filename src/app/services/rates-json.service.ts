import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Currency } from '../interfaces/currency';


@Injectable({
    providedIn: 'root'
})
export class RatesJsonService {

    /* JSON-эндпоинт для получения курса Евро к Рублю */
    private endpoint: string = 'https://www.cbr-xml-daily.ru/daily_json.js';


    /* Инициализация сервиса */
    constructor(
        private httpClient: HttpClient
    ) { }


    /* Метод для получения курсов валют к Рублю */
    getRates$(): Observable<Map<string, Currency>> {
        return this.httpClient.get(this.endpoint, { responseType: 'json' })
            .pipe(
                map((data: any) => this.processData(data))
            );
    }

    /* Метод для обработки данных в ответах сервера */
    private processData(data: any): Map<string, Currency> {

        /* Создание структуры Map, где в качестве ключей используются буквенные коды валют charCode, а в качестве значений используется весь объект валюты */
        const currenciesMap: Map<string, Currency> = new Map<string, Currency>();

        for (const charCode in data.Valute) {
            currenciesMap.set(charCode, data.Valute[charCode] as Currency);
        }

        return currenciesMap;
    }

}
