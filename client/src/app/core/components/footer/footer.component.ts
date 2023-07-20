import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
	standalone: true,
	imports: [RouterModule, CommonModule],
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
	constructor(public us: UserService) {}
}
