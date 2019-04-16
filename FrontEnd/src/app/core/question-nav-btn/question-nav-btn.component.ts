import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestService } from 'src/app/shared/test.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-question-nav-btn',
  templateUrl: './question-nav-btn.component.html',
  styleUrls: ['./question-nav-btn.component.css']
})
export class QuestionNavBtnComponent implements OnInit, OnDestroy {

  public numbers = [];
  public maxQuestion;
  public testObj;
  public currentIndex;
  public isapplied;
  public questions;
  public random = [];

  public destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.testObj = this.testService.testObj;
    this.maxQuestion = this.testObj.totalQuest;
    this.testService.getQuestions().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.questions = data;
    })
    this.testService.getindex().pipe(takeUntil(this.destroy$)).subscribe((data)=>{this.currentIndex = data; console.log('current index : '+this.currentIndex) });
    this.testService.getapplied().pipe(takeUntil(this.destroy$)).subscribe((data)=>{this.isapplied = data; console.log(this.isapplied)});
    this.testService.getRandom().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      console.log(data);
      this.random = data;
    })
    this.fillNumber();
  }

  public fillNumber() {
    for (let i = 0; i < this.maxQuestion; i++) {
      this.numbers.push(i);
    }
  }

  public buttonClicked(idx) {
    if(!this.questions[idx]){
      var i = Math.floor(Math.random() * (this.maxQuestion))
      if(this.random.includes(i)){
        this.buttonClicked(idx);
      }
      else{
        this.testService.setRandom(i);
        this.testService.getNextQuestion(i).pipe(takeUntil(this.destroy$)).subscribe((data) => {
          console.log(data)                                                 
          this.questions[idx] = data;
          this.testService.setQuestion(this.questions);
          this.testService.setindex(idx);
        })
      }
    }
    else{
      this.testService.setindex(idx);
    }
  }

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
