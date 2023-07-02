import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalService } from 'wacom';
import { DatepickerCalendarComponent } from './date-picker-calendar/date-picker-calendar.component';
import * as moment from 'moment';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
	selector: 'date-picker',
	templateUrl: './date-picker.component.html',
	styleUrls: ['./date-picker.component.scss']
})
export class DatepickerComponent implements OnInit {
	@Input() type = 'input';

	@Input() selectedDates: string[] = [];

	@Input() dateFrom: string | undefined;

	@Input() dateTo: string | undefined;

	@Input() date: string | undefined;

	@Input() isMultiple = false;

	@Input() isRange = false;

	@Input() isAllowEmptyDate = false;

	@Input() isClearable = false;

	@Input() disableUnder: string;

	@Input() disabled = false;

	@Output() dateFromChange: EventEmitter<string> = new EventEmitter<string>();

	@Output() dateToChange: EventEmitter<string> = new EventEmitter<string>();

	@Output() selectedDatesChange = new EventEmitter<string[]>();

	@Output() dateChange = new EventEmitter<string>();

	constructor(private _modal: ModalService, private _config: ConfigService) {}

	ngOnInit(): void {
		if (!this.selectedDates.length && !this.isAllowEmptyDate) {
			this.selectedDates.push(moment().format('YYYY-MM-DD'));
		}

		if (this.dateFrom && this.dateTo) {
			this.selectedDates = [this.dateFrom, this.dateTo];
		}

		if (this.date) {
			this.selectedDates = [this.date];
		}
	}

	showCalendar(): void {
		this._modal.show({
			component: DatepickerCalendarComponent,
			selectedDates: this.selectedDates,
			class: '_datepicker',
			isMultiple: this.isMultiple,
			isRange: this.isRange,
			disableUnder: this.disableUnder,
			onSelectedDatesChange: (dates: string[]) => {
				this.selectedDates = dates;

				this.selectedDatesChange.emit(dates);

				if (this.isRange) {
					this.dateFromChange.emit(dates[0]);

					this.dateToChange.emit(dates[1]);

					if (dates[0] && dates[1]) {
						this.dateChange.emit();
					}
				} else {
					this.dateChange.emit(dates[0]);
				}
			}
		});
	}

	resetDate(): void {
		this.selectedDates = [];

		if (this.isRange) {
			this.dateFromChange.emit('');

			this.dateToChange.emit('');
		}
	}
}
