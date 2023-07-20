import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from 'src/app/core/pipes/search.pipe';
import { CoreModule } from 'src/app/core/core.module';

const routes: Routes = [
	{
		path: '',
		component: ListComponent
	}
];

@NgModule({
	imports: [
		CoreModule,
		CommonModule,
		FormsModule,
		RouterModule.forChild(routes)
	],
	declarations: [ListComponent]
})
export class ListModule {}
