import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit, OnDestroy {

  singleAnswerQuestion : Boolean = false;
  multipleAnswerQuestion : Boolean = false;
  subjectiveQuestion : Boolean = false;

  constructor() { }

  ngOnInit() {}

  addSingleAnswerQuestion() {
    this.singleAnswerQuestion=true;
    this.multipleAnswerQuestion=false;
    this.subjectiveQuestion=false;
  }

  addMultipleAnswerQuestion() {
    this.singleAnswerQuestion = false;
    this.multipleAnswerQuestion = true;
    this.subjectiveQuestion = false;
  }

  addSubjectiveQuestion(){
    this.singleAnswerQuestion = false;
    this.multipleAnswerQuestion = false;
    this.subjectiveQuestion = true;
  }


  ngOnDestroy() {
    this.singleAnswerQuestion = null;
    this.multipleAnswerQuestion = null;
    this.subjectiveQuestion = null;
  }

}
