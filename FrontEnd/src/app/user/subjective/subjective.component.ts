import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-subjective',
  templateUrl: './subjective.component.html',
  styleUrls: ['./subjective.component.css']
})
export class SubjectiveComponent implements OnInit {

  addQuestionForm: FormGroup;
  categories= [];
  public destroy$: Subject<Boolean> = new Subject<Boolean>();
  
  constructor(private userService: UserService, private router:Router) { }

  ngOnInit() {
    this.userService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(
      (data)=>{
        this.categories=data[0].category;
      }
    )
    this.addQuestionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      difficultyLevel: new FormControl('',Validators.required),
      category: new FormControl('',Validators.required)
    })
  }

  onSubmit(){
    console.log(this.addQuestionForm);
    this.userService.postQuestion(this.addQuestionForm,"subjective").pipe(takeUntil(this.destroy$)).subscribe(
      (data)=>{
        console.log(data)
        alert("Question Submitted Successfully!");
        this.addQuestionForm.reset();
      }
    );
  }

}
