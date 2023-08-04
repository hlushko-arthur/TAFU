import { Component } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'wacom';

type SignUser = User & {
	password: string;
	passwordCheck: string;
	resetPin?: string;
};

@Component({
	templateUrl: './sign.component.html',
	styleUrls: ['./sign.component.scss']
})
export class SignComponent {
	activeForm: 'sign' | 'login' | 'reset' | 'newPassword' = 'login';

	user: SignUser = {} as SignUser;

	timer = 60;

	timerInterval: ReturnType<typeof setInterval> | undefined;

	constructor(private _us: UserService, private _alert: AlertService) {}

	signup(): void {
		this._us.signup(this.user);
	}

	login(): void {
		this._us.login(this.user);
	}

	resetPassword(): void {
		if (!this.user.email) {
			this._alert.show({
				text: 'Введіть email'
			});

			return;
		}

		this._us.resetPassword(this.user.email);

		this.activeForm = 'reset';

		this.startTimer();
	}

	async checkResetPin(): Promise<void> {
		const check = await this._us.checkResetPin(
			this.user.email,
			this.user.resetPin as string
		);

		if (check) {
			this.activeForm = 'newPassword';
		} else {
			this._alert.error({
				text: 'Неправильний код, спробуйте ще раз'
			});
		}
	}

	async changePassword(): Promise<void> {
		const check = await this._us.changePassword(
			this.user.email,
			this.user.password
		);

		if (check) {
			this._alert.success({
				text: 'Пароль успішно змінено'
			});

			this.activeForm = 'login';
		}
	}

	startTimer(): void {
		this.timer = 10;

		this.timerInterval = setInterval(() => {
			if (!this.timer) {
				clearInterval(this.timerInterval);

				return;
			}

			this.timer--;
		}, 1000);
	}

	get isLoginButtonDisabled(): boolean {
		return !this.user.email || !this.user.password;
	}

	get isSignButtonDisabled(): boolean {
		return (
			!this.user.email ||
			!this.user.password ||
			!this.user.passwordCheck ||
			this.user.password !== this.user.passwordCheck
		);
	}
}
