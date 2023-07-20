import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Pipe({
	name: 'search'
})
export class SearchPipe implements PipeTransform {
	transform(array: User[], search: string, keys?: string[]): User[] {
		if (!array || !search) {
			return array;
		}

		if (!keys) {
			keys = Object.keys(array[0]);
		}

		return array.filter((item) => {
			return keys?.some((key: string) => {
				const propertyValue = item[key as keyof User];

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
