import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, switchMap, timer, map } from 'rxjs';

import * as X2JS from 'x2js';
const x2js = new X2JS();

import { Currency } from '../interfaces/currency';


@Injectable({
    providedIn: 'root'
})
export class RateService {

    /* Список эндпоинтов для получения курса Евро к Рублю

    ToDo:
    Предполагается что этот список может быть расширен.
    В первом случае список может быть расширен через изменение текущего свойства здесь в сервисе.
    В ином случае, если этот список должен редактироваться пользователем (администратором, а не простым клиентом), в таком случае данный функционал может быть реализован в виде отдельного компонента с элементами-контролами (формой), из которого эндпоинты могут подаваться как аргументы в методы данного сервиса. */
    private endpoints: string[] = [
        'https://www.cbr-xml-daily.ru/daily_utf8.xml',
        'https://www.cbr-xml-daily.ru/daily_json.js'
    ];


    /* Инициализация сервиса */
    constructor(
        private httpClient: HttpClient
    ) { }


    /* Метод для однократного получения курса Евро к Рублю по одному эндпоинту */
    private getRateByEndpoint$(endpoint: string): Observable<any> {
        return this.httpClient.get(endpoint, { responseType: 'text' });
    }


    /* Метод для обработки данных в ответах сервера */
    private processData(data: string): Map<string, Currency> {

        /* Создание структуры Map, где в качестве ключей используются буквенные коды валют charCode, а в качестве значений используется весь объект валюты */
        const currenciesMap: Map<string, Currency> = new Map<string, Currency>();

        /* Обработка XML-данных */
        if (data.startsWith('<?xml')) {
            const dataObj = x2js.xml2js(data) as { ValCurs: any };

            dataObj.ValCurs.Valute.forEach((currency: Currency) => {
                /* Преобразование значения курса к числовому типу */
                currency = {
                    ...currency,
                    Value: parseFloat( String(currency.Value).replace(',', '.') )
                };

                currenciesMap.set(currency.CharCode, currency);
            })
        }

        /* Обработка JSON-данных */
        else {
            const dataObj = JSON.parse(data);

            for (const charCode in dataObj.Valute) {
                currenciesMap.set(charCode, dataObj.Valute[charCode] as Currency);
            }
        }

        return currenciesMap;
    }


    /* Метод для получения курса Евро к Рублю каждые 10 секунд с возможностью переключения при недоступности источника */
    public getRate$(): Observable<any> {
        return timer(0, 1e4)
            .pipe(
                switchMap(() =>
                    this.getRateByEndpoint$(this.endpoints[1])
                ),
                map((data: string) => this.processData(data))
            );
    }

}
