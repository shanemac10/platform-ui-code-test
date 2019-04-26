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
	this.localStorageSetProviders();
  }

  async getProviders():Promise<void> {
	this.localStorageGetProviders();
	if(!this.unselectedProviders.length) this.loading = true; // Used to display a loading spinner on the Available Providers list if it's empty.
	this.allProviders = await this.dataService.getProviders(); // Full list of all providers from the API.
	this.unselectedProviders = this.allProviders.filter(allProvider => !this.selectedProviders.find(selProvider => allProvider.id == selProvider.id)); // Filter out selected providers from the list of all providers, into unselected providers.
	this.loading = false;
	if(this.selectedProviders.length) this.updateSelectedProviders(); // In case any info has changed on the Provider, like address or phone, etc.
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
	this.unselectedProviders.sort((a:Provider,b:Provider) => (b.id > a.id) ? -1:1); // Resorting the unselectedProviders list by id, so they will be in their original order. In real life this list would probably be sorted by some other metric on the back end, and I would probably opt to call getProviders again if the sort was not easy to do here.
	this.localStorageSetProviders();
  }

  localStorageSetProviders():void {
	localStorage.setItem('selectedProviders',JSON.stringify(this.selectedProviders));
	localStorage.setItem('unselectedProviders', JSON.stringify(this.unselectedProviders));
  }

  localStorageGetProviders():void {
	this.selectedProviders = JSON.parse(localStorage.getItem('selectedProviders') || '[]'); // Check local storage for previous user selected providers.
	this.unselectedProviders = JSON.parse(localStorage.getItem('unselectedProviders') || '[]'); // Check local storage for previous user unselected providers as well.
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

  launchMap(address:String):String {
	let url = encodeURI(`https://www.google.com/maps/search/?api=1&query=${address}`)
	window.open(url);
	return url; // Return is for unit test only.
  }
}
