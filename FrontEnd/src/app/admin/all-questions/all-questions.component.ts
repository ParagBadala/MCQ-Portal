import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TestService } from 'src/app/shared/test.service';
import { FilterService } from 'src/app/shared/filter.service';

@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.css']
})
export class AllQuestionsComponent implements OnInit {

  public destroy$: Subject<Boolean> = new Subject<Boolean>();
  public questions;
  public show = true;
  public filterSelected = {}
  constructor(private adminService: AdminService, private testService: TestService, private filterService:FilterService) { }

  ngOnInit() {
    this.fetchAllQuestion();
    this.testService.getSelectedFilter().subscribe((data)=>{
      if(data !== "")
      this.filterSelected = data;
      console.log(this.filterSelected)
    })

    this.filterService.getFilteredData().subscribe((data)=>{
      console.log(data)
      this.questions = data;
    })

    this.testService.setdisplayFilter(this.show)
  }

  public fetchAllQuestion() {
    this.adminService.allQuestion().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.questions = data;
        this.filterService.setData(this.questions);
      }
    )
  }

  ngOnDestroy() {
    this.show=false;
    this.testService.setdisplayFilter(this.show)
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    
  }

}
