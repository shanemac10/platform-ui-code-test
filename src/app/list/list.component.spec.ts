import { ListComponent } from './list.component';
import { DataService } from '../data.service';
import { Provider } from '../models';

describe('ListComponent', () => {
  let component: ListComponent;

  beforeEach(async () => {
	component = new ListComponent(new DataService);
	await component.getProviders();
  });

  it('should create', () => {
	expect(component).toBeTruthy();
  });

  describe('unselected providers', () => {
    it('should have an initial length of 3', () => {
      expect(component.unselectedProviders.length).toEqual(3);
    });

    it('should have an id', () => {
      expect(component.unselectedProviders[0].id).toEqual('1');
    });

    it('should have a name', () => {
      expect(component.unselectedProviders[0].name).toEqual('John');
    });

    it('should have an address', () => {
      expect(component.unselectedProviders[0].address).toEqual('123 Greenway Blvd');
    });

    it('should have a phone', () => {
      expect(component.unselectedProviders[0].phone).toEqual('8991234321');
    });
  });

  describe('selected providers', () => {
    it('should have no initial length', () => {
      expect(component.selectedProviders.length).toEqual(0);
    });
  });

  describe('selecting a provider at index 0', () => {
	it('should remove provier at index 0 from unselectedProviders list and add it to selectedProviders list', () => {
		component.selectProvider(0);
		expect(component.unselectedProviders.length).toEqual(2);
		expect(component.selectedProviders.length).toEqual(1);
	});
  });

  describe('unselecting a provider at index 0', () => {
	it('should remove provider at index 0 from selectedProviders list and add it to unselectedProviders list', () => {
		component.unselectProvider(0);
		expect(component.unselectedProviders.length).toEqual(3);
		expect(component.selectedProviders.length).toEqual(0);
	});
  });

  describe('unselectedProviders list will sort by id when provider is moved from selectedProvider list', () => {
	it('should have an id', () => {
		expect(component.unselectedProviders[0].id).toEqual('1');
	});

	it('should have a name', () => {
		expect(component.unselectedProviders[0].name).toEqual('John');
	});
  });

  describe('lauchMap should return a properly URL-escaped address when given a normal string address', () => {
	it('should return a working google maps link with query URI encoded', () => {
		let testAddress = '123 Greenway Blvd';
		let escapedAddress = 'https://www.google.com/maps/search/?api=1&query=123%20Greenway%20Blvd'
		let returnedAddress = component.launchMap(testAddress);
		expect(returnedAddress).toEqual(escapedAddress);
		// A google map for '123 Greenway Blvd' should open in a new tab as well.
	});
  });

  describe('if the list of All Providers has updated information it should update the localy stored information as well', () => {
	  it('should update the address', () => {
		component.selectProvider(0);
		let originalAddress = component.allProviders[0].address
		component.allProviders[0].address = 'THIS IS A TEST';
		component.updateSelectedProviders();
		expect(component.selectedProviders[0].address).toEqual('THIS IS A TEST');
		component.allProviders[0].address = originalAddress;
		component.updateSelectedProviders();
		expect(component.selectedProviders[0].address).toEqual(originalAddress);
		component.unselectProvider(0);
	  });
  });
});
