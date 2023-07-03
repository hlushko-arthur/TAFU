import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	constructor(public config: ConfigService, public us: UserService) { }

	ngOnInit(): void {
		this.us.load();
	}
}
