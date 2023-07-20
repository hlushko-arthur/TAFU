import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	search: string;

	selectedSpeciality: string;

	constructor(public config: ConfigService, public us: UserService) {}

	ngOnInit(): void {
		this.us.load();
	}

	selectSpeciality(speciality: string): void {
		this.selectedSpeciality =
			this.selectedSpeciality === speciality ? '' : speciality;
	}
}
