import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatepickerModule } from 'src/app/modules/date-picker/date-picker.module';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent
	}
];

@NgModule({
	imports: [
		DatepickerModule,
		CommonModule,
		FormsModule,
		RouterModule.forChild(routes)
	],
	declarations: [ProfileComponent]
})
export class ProfileModule {}
