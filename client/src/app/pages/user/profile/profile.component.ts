import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
	constructor(public us: UserService) {}
}
