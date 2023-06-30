import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TableComponent } from "./table.component";

const routes: Routes = [{
	path: '',
	component: TableComponent
}]
@NgModule({
	imports: [RouterModule.forChild(routes)],
	declarations: [TableComponent]
})

export class TableModule {}