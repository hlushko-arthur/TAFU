// import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { PhoneComponent } from './components/phone/phone.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
	imports: [FormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
	declarations: [PhoneComponent],
	exports: [PhoneComponent],
	providers: [provideNgxMask()]
})
export class CoreModule {}
