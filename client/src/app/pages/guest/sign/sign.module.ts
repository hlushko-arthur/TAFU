import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignComponent } from './sign.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
	{
		path: '',
		component: SignComponent
	}
];

@NgModule({
	imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
	declarations: [SignComponent]
})
export class SignModule {}
