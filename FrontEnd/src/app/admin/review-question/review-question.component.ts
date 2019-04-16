import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';
import { TestService } from 'src/app/shared/test.service';
import { takeUntil } from 'rxjs/operators';
import { FilterService } from 'src/app/shared/filter.service';

@Component({
  selector: 'app-review-question',
  templateUrl: './review-question.component.html',
  styleUrls: ['./review-question.component.css']
})
export class ReviewQuestionComponent implements OnInit, OnDestroy {

  private destroy$: Subject<Boolean> = new Subject<Boolean>();
  public questions;
  public showQuest;
  public QuestDesc: string;
  public Options = [];
  public level: string;
  public filterSelected = {}
  public show = true;

  constructor(private adminService: AdminService, private testService: TestService, private filterService:FilterService) { }


  ngOnInit() {
    this.InactiveQuestion();
    this.testService.getSelectedFilter().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      if(data !== "")
      this.filterSelected = data;
    })
    this.filterService.getFilteredData().subscribe((data)=>{
      this.questions = data;
    })
    this.testService.setdisplayFilter(this.show);
    
  }

  public InactiveQuestion() {
    this.adminService.reviewQuestion().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.questions = data
        this.filterService.setData(this.questions);
      }
    )
  }

  public active(i) {
    let Obj = {
      q_id : this.questions[i]._id,
      status: "active"
    }
    this.adminService.changeStatus(Obj).pipe(takeUntil(this.destroy$)).subscribe(
      (data)=>{
        this.InactiveQuestion();
      }
    )
  }

  public showQuestionDesc(i) {
    this.showQuest = this.questions[i];
    this.QuestDesc = this.showQuest.question_description;
    this.Options = this.showQuest.options;
    this.level = this.showQuest.q_difficulty;
  }

  ngOnDestroy() {
    this.show=false;
    this.testService.setdisplayFilter(this.show)
    this.destroy$.next(true);
    this.destroy$.unsubscribe();   
  }

}
