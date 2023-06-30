import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"

@Injectable({
	providedIn: 'root'
})

export class HttpService {
	constructor(private _httpClient: HttpClient) {}

	post(
		url: string,
		payload: object,
	): Promise<unknown> {
		return this._httpClient.post<unknown>(url, payload).toPromise();
	}
}