import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) { }

  public data = [];
  public dataCopy = [];
  public filteredData = [];
  public filter = {};
  public str; // change name afterwards
  public flag = true;
  public count = 0;

  private _baseUrl  = environment._baseUrl;
  private _getFilterCategoryUrl = '/api/filterCategory';

  private _filteredData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filteredData$ = this._filteredData.asObservable();

  public getFilterByCategory() {
    return this.http.get(this._baseUrl + this._getFilterCategoryUrl)
  }

  public getFilterByUserName() {
    this.http.get('')
  }

  public setFilteredData() {
    this._filteredData.next(this.filteredData)
  }

  public getFilteredData(){
    return this.filteredData$;
  }

  public setFilter(filterObject) {
    console.log(Object.keys(this.filter).length)
    console.log(Object.keys(filterObject).length)
    if (Object.keys(this.filter).length > 0 && (Object.keys(this.filter).length < Object.keys(filterObject).length)) {
      this.str = "filteredData";
      console.log("Inside Filtered Data IF")
    }
    else {
      this.str = "data";
      console.log("else")
    }
    this.filter = Object.assign({}, filterObject);
    this.filterData();
  }

  public setData(data) {
    this.data = data;
  }

  public filterData() {
    console.log("Filtered func called")
    let keys = Object.keys(this.filter);
    let temp = [];
    this.dataCopy = this.filteredData
    if (this.str == "filteredData") {
      for (let item of this.filteredData) {
        for (let key of keys) {
          if(this.flag == false){
            break;
          }
          this.count = 0;
          this.filter[key].filter(check => {
            if (this.count > 0) {
              return
            }
            else {
              if (item[key] == check) {
                this.flag = true;
                this.count++;
              }
              else {
                this.flag = false;
              }
            }
            
          })

        }
        if (this.flag == true) {
          temp.push(item);
        }
        this.flag = true;
      }
      this.filteredData = temp;
    }
    else if (this.str == "data") {
      for (let item of this.data) {
        for (let key of keys) {
          if(this.flag == false){
            break;
          }
          this.count = 0;
          this.filter[key].filter(check => {
            if (this.count > 0) {
              return;
            }
            else {
              if (item[key] == check) {
                this.flag = true;
                this.count++;
              }
              else {
                this.flag = false;
              }
            }
          })
        }
        if (this.flag == true) {
          temp.push(item);
        }
        this.flag = true;
      }
      this.filteredData = temp;
    }
    console.log(this.filteredData);
    this.setFilteredData()
  }

}
