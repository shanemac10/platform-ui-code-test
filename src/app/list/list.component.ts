import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Provider } from '../models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	public selectedProviders:Array<Provider> = [];
	public unselectedProviders:Array<Provider> = [];
	public allProviders:Array<Provider> = [];
	public loading:Boolean = false;

  constructor(private dataService:DataService) {}

  ngOnInit() {
	this.getProviders();
  }

  async getProviders():Promise<void> {
	this.localStorageGetProviders();
	if(!this.unselectedProviders.length) this.loading = true; // Used to display a loading spinner on the Available Providers list if it's empty.
	this.allProviders = await this.dataService.getProviders(); // Full list of all providers from the API.
	this.setUnselectedProviders();
	this.loading = false;
	this.updateSelectedProviders(); // In case any info has changed on the Provider, like address or phone, etc.
	this.localStorageSetProviders();
  }

  selectProvider(index:number):void {
	if(!this.unselectedProviders[index]) return;
	this.selectedProviders.push(this.unselectedProviders[index]);
	this.unselectedProviders.splice(index,1);
	this.localStorageSetProviders();
  }

  unselectProvider(index:number):void {
	if(!this.selectedProviders[index]) return;
	this.unselectedProviders.push(this.selectedProviders[index]);
	this.selectedProviders.splice(index,1);
	this.setUnselectedProviders();
	this.localStorageSetProviders();
  }

  localStorageSetProviders():void {
	localStorage.setItem('selectedProviders',JSON.stringify(this.selectedProviders));
	localStorage.setItem('unselectedProviders', JSON.stringify(this.unselectedProviders));
  }

  localStorageGetProviders():void {
	this.selectedProviders = JSON.parse(localStorage.getItem('selectedProviders') || '[]');
	this.unselectedProviders = JSON.parse(localStorage.getItem('unselectedProviders') || '[]');
  }

  updateSelectedProviders():void {
	if(!this.selectedProviders.length) return;
	let newSelectedProviders:Array<Provider> = []; // ForEach does not operate in place, so we push to a new array instead.
	this.selectedProviders.forEach(provider => {
		provider = this.allProviders.find(allProvider => allProvider.id == provider.id) || provider;
		newSelectedProviders.push(provider);
	});
	this.selectedProviders = newSelectedProviders;
  }

  setUnselectedProviders():void {
	this.unselectedProviders = this.allProviders.filter(allProvider => !this.selectedProviders.find(selProvider => allProvider.id == selProvider.id)); // Filter out selected providers from the list of all providers, into unselected providers.
  }

  launchMap(address:String):String {
	let url = encodeURI(`https://www.google.com/maps/search/?api=1&query=${address}`)
	window.open(url);
	return url; // Return is for unit test only.
  }
}
