import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
	transform(data: any, type = 'all'): any {
		const dateFormat = 'YYYY-MM-DD';

		if (!data) return '';

		// if (!isNaN(Number(data)))
		// data = moment.unix(data).format('YYYY-MM-DD HH:mm:ss');

		if (type == 'all') {
			if (typeof data == 'string') {
				data = data.replace(' ', 'T');
			}

			return moment(data).format(dateFormat + ' ' + 'HH:mm');
		} else if (type == 'date') {
			return moment(data).format(dateFormat);
		} else if (type == 'time') {
			return moment(
				(data.length == 5 && 'Mon 03-Jul-2017,' + data) || data
			).format('HH:mm');
		} else if (type == 'expire') {
			return moment().diff(moment(data), 'days');
		} else if (type === 'month') {
			return moment(data).format('MMMM');
		} else if (type === 'year') {
			console.log(data);

			return moment(data).format('YYYY');
		}
	}
}
