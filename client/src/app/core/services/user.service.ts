import { AlertService } from 'wacom';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpService } from './http.service';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	user: User = {} as User;

	users: User[] = [];

	// _users:  = {};

	constructor(
		private _alert: AlertService,
		private _router: Router,
		private _http: HttpService
	) {
		if (localStorage.getItem('waw_user')) {
			this.user = JSON.parse(localStorage.getItem('waw_user') as string);
		}

		this.user = JSON.parse(
			(localStorage.getItem('user') as string) || '{}'
		);
	}

	load(): void {
		this._http
			.get('/api/user/get')
			.then((resp) => {
				if (resp) {
					this.users = resp as User[];
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	signup(payload: object): void {
		this._http.post('/api/user/sign', payload).then((resp: any) => {
			if (!resp) {
				this._alert.error({
					text: 'Цей email вже використовується'
				});
			} else {
				this._setAuthorizedUser(resp as User & { token: string });
			}
		});
	}

	login(payload: object): void {
		this._http.post('/api/user/login', payload).then((resp: any) => {
			if (!resp) {
				this._alert.warning({
					text: 'Пароль або емейл введено невірно'
				});
			} else {
				this._setAuthorizedUser(resp as User & { token: string });
			}
		});
	}

	async uploadImage(file: File, type: 'avatar' | 'document'): Promise<any> {
		const formData: FormData = new FormData();

		formData.append('file', file, file.name);

		formData.append('type', type);

		return await new Promise((resolve, reject) => {
			this._http
				.post(
					`/api/user/upload${type
						.charAt(0)
						.toUpperCase()}${type.substring(1)}`,
					formData
				)
				.then(
					(response) => {
						resolve(response);
					},
					(error) => {
						reject(error);
					}
				);
		});
	}

	logout(): void {
		localStorage.removeItem('user');

		this._router.navigateByUrl('/');
	}

	private _setAuthorizedUser(user: User & { token: string }): void {
		localStorage.setItem('user', JSON.stringify(user));

		const cookieValue = `Authorization=${user.token}; path=/`;

		document.cookie = cookieValue;

		this._router.navigateByUrl('/user/profile');
	}
}
