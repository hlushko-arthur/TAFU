import { NgModule } from '@angular/core';
import { AdminToolsComponent } from './admin-tools.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routes: Routes = [
	{
		path: '',
		component: AdminToolsComponent
	}
];

@NgModule({
	imports: [FormsModule, CommonModule, RouterModule.forChild(routes)],
	declarations: [AdminToolsComponent]
})
export class AdminToolsModule {}
