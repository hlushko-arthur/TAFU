import { FileService, AlertService } from 'wacom';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
		private _http: HttpClient
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
		const token = localStorage.getItem('token') as string;

		const headers = new HttpHeaders().set('Authorization', token);

		console.log(headers);

		this._http.get('/api/user/get', { headers }).subscribe((resp) => {
			if (resp) {
				this.users = resp as User[];
			}
		});
	}

	signup(payload: object): void {
		this._http.post('/api/user/sign', payload).subscribe((resp: any) => {
			if (!resp) {
				this._alert.error({
					text: 'Цей email вже використовується'
				});
			} else {
				localStorage.setItem('token', resp.token as string);

				this._router.navigateByUrl('/user/table');
			}
		});
	}

	login(payload: object): void {
		this._http.post('/api/user/login', payload).subscribe((resp: any) => {
			if (!resp) {
				this._alert.warning({
					text: 'Пароль або емейл введено невірно'
				});
			} else {
				localStorage.setItem('token', resp.token as string);

				this._router.navigateByUrl('/user/table');
			}
		});
	}

	logout(): void {
		localStorage.removeItem('token');

		this._router.navigateByUrl('/');
	}
}
