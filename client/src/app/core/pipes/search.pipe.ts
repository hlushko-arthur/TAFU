import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'search'
})
export class SearchPipe implements PipeTransform {
	transform(
		array: { [key: string]: any }[],
		search: string,
		keys?: string[]
	): IStudent[] {
		if (!array || !search) {
			return array;
		}

		if (!keys) {
			keys = Object.keys(array[0]);
		}

		return array.filter((item) => {
			return keys?.some((key: string) => {
				const propertyValue = item[key];

				if (propertyValue && typeof propertyValue === 'string') {
					return propertyValue
						.toLowerCase()
						.includes(search.toLowerCase());
				}

				return false;
			});
		});
	}
}
