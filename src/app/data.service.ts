import { Injectable } from '@angular/core';
import { delay } from 'q';
import { async } from '@angular/core/testing';
import { Provider } from './models';

@Injectable()
export class DataService {

	private unselectedProviders:Array<Provider> = [
	  {
		id: '1',
		name: 'John',
		address: '123 Greenway Blvd',
		phone: '8991234321'
	  },
	  {
		id: '2',
		name: 'Mary',
		address: '443 Windwhisper Road',
		phone: '2233211903'
	  },
	  {
		id: '3',
		name: 'Jason',
		address: '9992 Pumpkin Hollow',
		phone: '4343219384'
	  }
	];

	async getProviders() {
		await delay(1500); // Simulating an API call
		return this.unselectedProviders
	}
}