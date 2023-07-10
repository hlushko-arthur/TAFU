import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	specialities = ['Строковик', 'Мобілізований', 'Офіцер запасу'];

	phoneMask = '+380 (00) 000-00-00';

	// _afterWhile: { [key: string]: ReturnType<typeof setTimeout> | undefined } =
	// 	{};

	// afterWhile(key: string, cb = (): void => undefined, delay = 1000): void {
	// 	clearTimeout(this._afterWhile[key]);

	// 	this._afterWhile[key] = setTimeout(cb, delay);
	// }
}
