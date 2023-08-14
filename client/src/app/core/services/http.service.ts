import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private _httpClient: HttpClient, private _router: Router) {}

	post(url: string, payload: object): Promise<any> {
		url = environment.serverUrl + url;

		return new Promise((resolve, reject) => {
			this._httpClient.post<unknown>(url, payload).subscribe(
				(resp) => {
					resolve(resp);
				},
				(error: { error: { message: string } }) => {
					this.checkTokenState(error);

					reject(error);
				}
			);
		});
	}

	get(url: string): Promise<any> {
		url = environment.serverUrl + url;

		return new Promise((resolve, reject) => {
			this._httpClient.get<unknown>(url).subscribe(
				(resp) => {
					resolve(resp);
				},
				(error: { error: { message: string } }) => {
					this.checkTokenState(error);

					reject(error);
				}
			);
		});
	}

	checkTokenState(error: { error: { message: string } }): void {
		if (
			error.error.message === 'Invalid token' ||
			error.error.message === 'Expired token' ||
			error.error.message === 'Unauthorized'
		) {
			localStorage.removeItem('user');

			this._router.navigateByUrl('/');
		}
	}
}
