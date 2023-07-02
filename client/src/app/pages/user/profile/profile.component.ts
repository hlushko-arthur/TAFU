import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/interfaces/user.interface';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	user: User = {} as User;

	isHttpLoading = false;

	constructor(public us: UserService, public config: ConfigService) {}

	ngOnInit(): void {
		this.user = JSON.parse(JSON.stringify(this.us.user));
	}

	onFileUpload(event: Event, type: 'avatar' | 'document'): void {
		const file = (event.target as HTMLInputElement)?.files?.[0];

		if (file) {
			this.us.uploadImage(file, type).then((resp) => {
				this.us.user[type] = resp.data.filepath;

				this.user[type] = resp.data.filepath;

				localStorage.setItem('user', JSON.stringify(this.us.user));
			});
		}
	}

	// onUserChange(): void {
	// 	this.config.afterWhile(
	// 		'onUserChange',
	// 		() => {
	// 			this.us.update(this.user);
	// 		},
	// 		1000
	// 	);
	// }

	updateUser(): void {
		this.isHttpLoading = true;

		this.us.update(this.user).then(() => {
			console.log('then');

			this.us.user = JSON.parse(JSON.stringify(this.user));
		});
	}

	get isUserHasChanges(): boolean {
		return JSON.stringify(this.us.user) === JSON.stringify(this.user);
	}
}
