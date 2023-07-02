import { Component } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
	constructor(public us: UserService, public config: ConfigService) {}

	onFileUpload(event: Event, type: 'avatar' | 'document'): void {
		const file = (event.target as HTMLInputElement)?.files?.[0];

		console.log(file);

		if (file) {
			this.us.uploadImage(file, type).then((resp) => {
				this.us.user[type] = resp.data.filepath;

				console.log(this.us.user);

				localStorage.setItem('user', JSON.stringify(this.us.user));
			});
		}
	}
}
