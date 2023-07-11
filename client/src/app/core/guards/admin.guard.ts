import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(): boolean {
		if (localStorage.getItem('user')) {
			const user = JSON.parse(localStorage.getItem('user') as string);

			if (user.admin) {
				return true;
			}

			this.router.navigate(['/user/table']);

			return false;
		} else {
			console.log(1);

			this.router.navigate(['/']);

			return false;
		}
	}
}
