import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Core
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// config
import { WacomModule } from 'wacom';
import { environment } from 'src/environments/environment';
import { FooterComponent } from './core/components/footer/footer.component';

const routes: Routes = [
	{
		path: '',
		canActivate: [GuestGuard],
		children: [
			{
				path: '',
				// canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Sign'
					}
				},
				loadChildren: () =>
					import('./pages/guest/sign/sign.module').then(
						(m) => m.SignModule
					)
			}
		]
	},
	{
		path: 'user',
		canActivate: [AuthenticatedGuard],
		component: FooterComponent,
		children: [
			{
				path: 'profile',
				// canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Profile'
					}
				},
				loadChildren: () =>
					import('./pages/user/profile/profile.module').then(
						(m) => m.ProfileModule
					)
			},
			{
				path: 'table',
				// canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Table'
					}
				},
				loadChildren: () =>
					import('./pages/user/list/list.module').then(
						(m) => m.ListModule
					)
			}
		]
	},
	{
		path: 'admin',
		canActivate: [AdminGuard],
		component: FooterComponent,
		children: [
			{
				path: 'tools',
				// canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Profile'
					}
				},
				loadChildren: () =>
					import('./pages/admin/admin-tools/admin-tools.module').then(
						(m) => m.AdminToolsModule
					)
			}
		]
	}
];

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		WacomModule.forRoot({
			store: {},
			http: {
				url: environment.url
			},
			socket: environment.production,
			meta: {
				useTitleSuffix: true
				// defaults: {
				// 	title: 'Web Art Work',
				// 	titleSuffix: ' | Web Art Work',
				// 	'og:image': 'https://webart.work/api/user/cdn/waw-logo.png'
				// }
			},
			modal: {
				modals: {
					/* modals */
				}
			}
		}),
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			preloadingStrategy: PreloadAllModules
		})
	],
	providers: [AuthenticatedGuard, GuestGuard, AdminGuard],
	bootstrap: [AppComponent]
})
export class AppModule {}
