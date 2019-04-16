import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterService } from 'src/app/shared/filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  public level;
  public category;
  public filterOptions;
  public Obj = {};
  private destroy$ : Subject<boolean> = new Subject<boolean>()

  constructor(private filterService:FilterService) { }

  ngOnInit() {
    this.filterService.getFilterByCategory().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.filterOptions = data
    })
  }

  checked(i,j) {
    let type = this.filterOptions[i].type;
    let label = this.filterOptions[i].value[j].label
    if(!this.filterOptions[i].value[j].checked){
      this.filterOptions[i].value[j].checked=true;
      if(Object.keys(this.Obj).includes(type)){
        this.Obj[type].push(label);
      }
      else{
        this.Obj[type]=[label];
      }
    }
    else{
      this.filterOptions[i].value[j].checked=false;
      let k = 0;
      for(let item of this.Obj[type]){
        if(item == label){
          this.Obj[type].splice(k,1);
        }
        k++;
      }
    }
    this.filterService.setFilter(this.Obj);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
