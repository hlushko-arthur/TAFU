import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user.interface';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
	user: User = {} as User;

	oldUser: User = {} as User;

	isHttpLoading = false;

	isEditingEnabled = false;

	userId: string;

	constructor(
		public us: UserService,
		public config: ConfigService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _location: Location
	) {
		this.userId = this._activatedRoute.snapshot.params['id'];

		this._location.onUrlChange((url) => {
			if (url.startsWith('/user/profile/')) {
				const userId = url.split('/')[3];

				if (userId !== this.userId) {
					this.userId = userId;

					this.loadUser();

					return;
				}
			}
		});

		this.loadUser();
	}

	ngOnDestroy(): void {
		this._location.ngOnDestroy();
	}

	async loadUser(): Promise<void> {
		if (!this.userId) {
			this.userId = this.us.user._id;

			this._router.navigate([`/user/profile/${this.userId}`]);

			return;
		}

		this.user = await this.us.fetch(this.userId);
	}

	ngOnInit(): void {
		this.user = JSON.parse(JSON.stringify(this.us.user));
	}

	onFileUpload(event: Event, type: 'avatar' | 'document'): void {
		const file = (event.target as HTMLInputElement)?.files?.[0];

		if (file) {
			this.us.uploadImage(file, type, this.user._id).then((resp) => {
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

		this.isEditingEnabled = false;

		this.us.update(this.user).then(() => {
			if (this.user._id === this.us.user._id) {
				this.us.user = JSON.parse(JSON.stringify(this.user));

				localStorage.setItem('user', JSON.stringify(this.user));
			}
		});
	}

	deleteFile(type: 'avatar' | 'document'): void {
		this.user[type] = '';

		this.us.update(this.user);
	}

	startEditing(): void {
		this.oldUser = JSON.parse(JSON.stringify(this.user));

		this.isEditingEnabled = true;
	}

	cancelEditing(): void {
		const user = JSON.parse(JSON.stringify(this.oldUser));

		this.user = user;

		this.isEditingEnabled = false;
	}

	get isUserHasChanges(): boolean {
		return JSON.stringify(this.us.user) === JSON.stringify(this.user);
	}

	get isUserCanEdit(): boolean {
		return !(
			(this.us.user.admin && this.isEditingEnabled) ||
			this.us.user._id === this.user._id
		);
	}
}
