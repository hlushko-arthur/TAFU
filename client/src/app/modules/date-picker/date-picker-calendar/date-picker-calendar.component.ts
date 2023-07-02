import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ConfigService } from 'src/app/core/services/config.service';

interface Day {
	date: string;
	isOtherMonth: boolean;
	isDisabled?: boolean;
}

interface Week {
	days: Day[];
}

type MomentDate = moment.Moment;

@Component({
	templateUrl: './date-picker-calendar.component.html',
	styleUrls: ['./date-picker-calendar.component.scss']
})
export class DatepickerCalendarComponent implements OnInit {
	selectedDates: string[] = [];

	isMultiple = false;

	isRange = false;

	currentDate: MomentDate = moment();

	weeks!: Week[];

	hoverDate: string;

	disableUnder: string;

	today = moment().format('YYYY-MM-DD');

	onSelectedDatesChange = (_dates: string[]): void => undefined;

	close = (): void => undefined;

	constructor(private _config: ConfigService) {}

	ngOnInit(): void {
		if (this.selectedDates[0]) {
			this.currentDate = moment(this.selectedDates[0]);
		} else {
			this.currentDate = moment(this.today);
		}

		console.log(this.currentDate);

		this.generateCalendar();
	}

	prevMonth(): void {
		const date = moment(this.currentDate).subtract(1, 'month');

		this.currentDate = date;

		this.generateCalendar();
	}

	nextMonth(): void {
		const date = moment(this.currentDate).add(1, 'month');

		this.currentDate = date;

		this.generateCalendar();
	}

	selectDate(date: string): void {
		const dateObj = moment(date);

		if (
			this.isRange &&
			this.selectedDates.length === 1 &&
			dateObj.isBefore(this.selectedDates[0])
		) {
			this.selectedDates = [date];

			return;
		}

		if (this.isRange && this.selectedDates.length === 2) {
			this.selectedDates = [];
		}

		if (!this.isRange && !this.isMultiple) {
			this.selectedDates = [date];
		} else if (this.isMultiple && this.selectedDates.includes(date)) {
			this.selectedDates.splice(this.selectedDates.indexOf(date), 1);
		} else {
			this.selectedDates.push(date);
		}

		this.sortSelectedDates();

		this.onSelectedDatesChange(this.selectedDates);

		if (
			(this.isRange && this.selectedDates.length === 2) ||
			(!this.isRange && !this.isMultiple)
		) {
			this.close();
		}

		this.generateCalendar();
	}

	sortSelectedDates(): void {
		this.selectedDates.sort((a, b) => (moment(a).isAfter(b) ? 1 : -1));
	}

	isDateDisabled(date: Date): boolean {
		return date && date < new Date();
	}

	isDateInRange(date: string): boolean {
		if (
			new Date(date).getTime() >=
				new Date(this.selectedDates[0]).getTime() &&
			new Date(date).getTime() <=
				new Date(this.hoverDate || this.selectedDates[1]).getTime()
		) {
			return true;
		} else {
			return false;
		}
	}

	generateCalendar(): void {
		const firstDayOfMonth = this.currentDate.clone().startOf('month');

		const daysInMonth = this.currentDate.daysInMonth();

		const daysInPrevMonth = this.currentDate
			.clone()
			.startOf('month')
			.subtract(1, 'month')
			.daysInMonth();

		const dayOfWeek = firstDayOfMonth.isoWeekday();

		this.weeks = [];

		let week: Week = { days: [] };

		// add previous month's days to the first week
		for (
			let i = daysInPrevMonth - dayOfWeek + 2;
			i <= daysInPrevMonth;
			i++
		) {
			const year =
				this.currentDate.month() === 0
					? this.currentDate.year() - 1
					: this.currentDate.year();

			const month =
				year === this.currentDate.year()
					? this.currentDate.month() - 1
					: this.currentDate.month();

			const date = moment([year, month, i]);

			week.days.push({
				date: date.format('YYYY-MM-DD'),
				isOtherMonth: true,
				isDisabled: this._isDisabled(date)
			});
		}

		// add current month's days
		for (let i = 1; i <= daysInMonth; i++) {
			const date = moment([
				this.currentDate.year(),
				this.currentDate.month(),
				i
			]);

			week.days.push({
				date: date.format('YYYY-MM-DD'),
				isOtherMonth: false,
				isDisabled: this._isDisabled(date)
			});

			if (week.days.length === 7) {
				this.weeks.push(week);

				week = { days: [] };
			}
		}

		// add next month's days to the last week

		let day = 1;

		const addNextMonthsDays = (): void => {
			for (; week.days.length < 7; day++) {
				const year =
					this.currentDate.month() === 11
						? this.currentDate.year() + 1
						: this.currentDate.year();

				const month =
					year === this.currentDate.year()
						? this.currentDate.month() + 1
						: this.currentDate.month();

				const date = moment([year, month, day]);

				week.days.push({
					date: date.format('YYYY-MM-DD'),
					isOtherMonth: true,
					isDisabled: this._isDisabled(date)
				});
			}
		};

		addNextMonthsDays();

		this.weeks.push(week);

		if (this.weeks.length < 6) {
			week = { days: [] };

			addNextMonthsDays();

			this.weeks.push(week);
		}
	}

	private _isDisabled(date: moment.Moment): boolean {
		if (!this.disableUnder) return false;

		const disableUnder = moment(this.disableUnder);

		if (date.unix() < disableUnder.unix()) {
			return true;
		} else {
			return false;
		}
	}
}
