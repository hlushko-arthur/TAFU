import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

export interface User {
	name: string;
	speciality: string;
}

type SignUser = User & { password: string; passwordCheck: string };

@Component({
	templateUrl: './sign.component.html',
	styleUrls: ['./sign.component.scss']
})
export class SignComponent {
	user: SignUser = {} as SignUser;

	constructor(public config: ConfigService, private _http: HttpClient) {}

	signup(): void {}

	get isSignButtonDisabled(): boolean {
		return (
			!this.user.name ||
			!this.user.password ||
			!this.user.passwordCheck ||
			!this.user.speciality ||
			this.user.password !== this.user.passwordCheck
		);
	}
}
