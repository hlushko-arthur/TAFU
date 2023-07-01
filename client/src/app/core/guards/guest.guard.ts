import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class GuestGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(): boolean {
		if (localStorage.getItem('user')) {
			this.router.navigateByUrl('/user/table');

			return false;
		} else {
			return true;
		}
	}
}
