import { FileService, AlertService } from 'wacom';
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
		private _file: FileService,
		private _router: Router,
		private _http: HttpService
	) {
		this._file.add({
			id: 'userAvatarUrl',
			resize: 256,
			part: 'user',
			cb: (file: string | File) => {
				if (typeof file != 'string') return;

				this.user.thumb = file;
			}
		});

		if (localStorage.getItem('waw_user')) {
			this.user = JSON.parse(localStorage.getItem('waw_user') as string);
		}
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
				this._setUser(resp as User & { token: string });
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
				this._setUser(resp as User & { token: string });
			}
		});
	}

	logout(): void {
		localStorage.removeItem('token');

		this._router.navigateByUrl('/');
	}

	private _setUser(user: User & { token: string }): void {
		localStorage.setItem('user', JSON.stringify(user));

		const cookieValue = `Authorization=${user.token}; path=/`;

		document.cookie = cookieValue;

		this._router.navigateByUrl('/user/table');
	}
}
