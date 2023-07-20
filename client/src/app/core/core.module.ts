// import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { PhoneComponent } from './components/phone/phone.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
	imports: [FormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
	declarations: [PhoneComponent, SearchPipe],
	exports: [PhoneComponent, SearchPipe],
	providers: [provideNgxMask()]
})
export class CoreModule {}
