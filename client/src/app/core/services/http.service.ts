import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private _httpClient: HttpClient) {}

	post(url: string, payload: object): Promise<any> {
		return new Promise((resolve, reject) => {
			this._httpClient.post<unknown>(url, payload).subscribe(
				(resp) => {
					resolve(resp);
				},
				(err) => {
					console.log(err);

					reject(err);
				}
			);
		});
	}

	get(url: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this._httpClient.get<unknown>(url).subscribe(
				(resp) => {
					resolve(resp);
				},
				(err) => {
					console.log(err);

					reject(err);
				}
			);
		});
	}
}
