import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { TestService } from 'src/app/shared/test.service';
import { FilterService } from 'src/app/shared/filter.service';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css']
})
export class ManageQuestionsComponent implements OnInit, OnDestroy {

  questions: [];
  public editQuest;
  public updatedQuest: string;
  public updatedOptions = []
  public deleteQuest: any;
  public answer: string;
  public level: string;
  public filterSelected = {} ;
  public show = true
  public destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private userService: UserService, private testService:TestService, private filterService:FilterService) { }

  ngOnInit() {
    this.getAllQuestion();
    this.testService.getSelectedFilter().subscribe((data)=>{
      if(data !== "")
      this.filterSelected = data;
      console.log(this.filterSelected)
    })

    this.filterService.getFilteredData().subscribe((data)=>{
      this.questions = data;
    })

    this.testService.setdisplayFilter(this.show)
  }

  getAllQuestion() {
    this.userService.getQuestionByUser().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.questions = data;
        this.filterService.setData(this.questions);
      }
    )
  }

  public editQuestion(i) {
    this.editQuest = this.questions[i];
    this.updatedQuest = this.editQuest.question_description;
    this.updatedOptions = this.editQuest.options;
    this.answer = this.editQuest.correct;
    this.level = this.editQuest.q_difficulty;
    console.log(this.level)
    console.log(this.editQuest)
  }

  public correctAnswer(event) {
    console.log(event)
    if (event.target.checked)
      this.answer = event.target.value;
  }

  public updatedQuestion() {
    this.editQuest.question_description = this.updatedQuest;
    this.editQuest.options = this.updatedOptions;
    this.editQuest.correct = this.answer;
    this.editQuest.q_difficulty = this.level;
    this.userService.updateQuestion(this.editQuest).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        console.log(data)
      }
    )
  }

  public deleteQuestion(i) {
    this.deleteQuest = this.questions[i];
    console.log(this.deleteQuest._id)
    this.userService.deleteQuestion(this.deleteQuest._id).pipe(takeUntil(this.destroy$)).subscribe(
      (data)=>{
        alert('Question deleted')
        this.getAllQuestion();
        console.log(data)
      }
    )
  }

  ngOnDestroy() {
    console.log("Destory Called")
    this.show = !this.show
    this.testService.setdisplayFilter(this.show)
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
