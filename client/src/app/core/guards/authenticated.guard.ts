import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(): boolean {
		if (localStorage.getItem('waw_user')) {
			return true;
		} else {
			this.router.navigateByUrl('/sign');

			return false;
		}
	}
}
