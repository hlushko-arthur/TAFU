import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
	{
		path: '',
		component: ListComponent
	}
];

@NgModule({
	imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
	declarations: [ListComponent]
})
export class ListModule { }
