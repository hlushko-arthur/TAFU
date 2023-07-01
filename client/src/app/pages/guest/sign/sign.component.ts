import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';

type SignUser = User & { password: string; passwordCheck: string };

@Component({
	templateUrl: './sign.component.html',
	styleUrls: ['./sign.component.scss']
})
export class SignComponent {
	activeForm = 'login';

	user: SignUser = {} as SignUser;

	constructor(public config: ConfigService, private _us: UserService) {}

	signup(): void {
		this._us.signup(this.user);
	}

	login(): void {
		this._us.login(this.user);
	}

	get isLoginButtonDisabled(): boolean {
		return !this.user.email || !this.user.password;
	}

	get isSignButtonDisabled(): boolean {
		return (
			!this.user.email ||
			!this.user.fullName ||
			!this.user.password ||
			!this.user.passwordCheck ||
			!this.user.speciality ||
			this.user.password !== this.user.passwordCheck
		);
	}
}
