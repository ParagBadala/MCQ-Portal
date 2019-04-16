import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent implements OnInit, OnDestroy {

  public destroy$: Subject<Boolean> = new Subject<Boolean>();
  public testDetails = [];
  public serverMsg;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.fetchTestDetails().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        if(data.msg){
          this.serverMsg = data.msg
        }
        else{
          this.testDetails = data;
        }
      }
    )
  }

  public startTest(idx) {
    var currentDate = new Date();
    var time = new Date(this.testDetails[idx].start_time);
    var date = currentDate.getTime();
    if(date >= time.getTime()){
      if(confirm("Are you sure you want to start the test?"))
      {
        var Obj = {
          level: this.testDetails[idx].t_level,
          category: this.testDetails[idx].t_category,
          duration: this.testDetails[idx].t_duration,
          totalQuest: this.testDetails[idx].total_question
        }
        this.userService.fetchQuestions(Obj, this.testDetails[idx]._id);
      }
    }
    else{
      alert("Test not active yet!!!")
    }
  }

  ngOnDestroy() {
    this.testDetails=null;
    this.serverMsg=null;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
