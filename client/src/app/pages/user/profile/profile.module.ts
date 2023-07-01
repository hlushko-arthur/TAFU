import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
	{
		path: '',
		component: ProfileComponent
	}
];

@NgModule({
	imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
	declarations: [ProfileComponent]
})
export class ProfileModule {}
