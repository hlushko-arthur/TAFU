import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from './date-picker.component';
import { DatepickerCalendarComponent } from './date-picker-calendar/date-picker-calendar.component';
import { DateFormatPipe } from 'src/app/core/pipes/date-format.pipe';

@NgModule({
	imports: [CommonModule, FormsModule],
	declarations: [
		DatepickerComponent,
		DatepickerCalendarComponent,
		DateFormatPipe
	],
	exports: [DatepickerComponent],
	providers: [DatePipe]
})
export class DatepickerModule {}
