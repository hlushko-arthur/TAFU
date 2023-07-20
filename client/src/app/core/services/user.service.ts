import { AlertService } from 'wacom';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpService } from './http.service';
import {
	ServerResponse,
	ServerResponseError
} from '../interfaces/server.interface';

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
					this.users = resp.data as User[];
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async fetch(_id: string): Promise<User> {
		let user = {} as User;

		await this._http
			.get(`/api/user/fetch/${_id}`)
			.then((resp: ServerResponse) => {
				user = resp.data as User;
			});

		console.log(user);

		return user;
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

	update(user: User): any {
		this._alert.destroy();

		this._alert.info({
			text: 'Profile is updating...'
		});

		return this._http
			.post('/api/user/update', user)
			.then((resp: ServerResponse | ServerResponseError) => {
				if (resp.status) {
					this._alert.destroy();

					this._alert.success({
						text: 'Profile has been succesfully updated'
					});
				} else {
					this._handleError(resp as ServerResponseError);
				}
			})
			.catch(this._handleError);
	}

	async uploadImage(
		file: File,
		type: 'avatar' | 'document',
		userId: string
	): Promise<any> {
		const formData: FormData = new FormData();

		formData.append('file', file, file.name);

		formData.append('type', type);

		formData.append('_id', userId);

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

	private _setAuthorizedUser(user: User & { token?: string }): void {
		const cookieValue = `Authorization=${user.token as string}; path=/`;

		document.cookie = cookieValue;

		delete user.token;

		this.user = user;

		localStorage.setItem('user', JSON.stringify(user));

		this._router.navigateByUrl('/user/profile');
	}

	private _handleError(err: { message: string }): void {
		this._alert.destroy();

		this._alert.warning({
			text: `Something went wrong. ${err.message}`
		});
	}
}
