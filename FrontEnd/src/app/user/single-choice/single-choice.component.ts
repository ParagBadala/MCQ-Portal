import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-single-choice',
  templateUrl: './single-choice.component.html',
  styleUrls: ['./single-choice.component.css']
})
export class SingleChoiceComponent implements OnInit, OnDestroy {

  addQuestionForm: FormGroup;
  options: FormArray;
  correctSingleAnswer: any;
  categories = [];
  public destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.userService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.categories = data[0].category;
      }
    )
    this.addQuestionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      options: new FormArray([this.createOption()], Validators.minLength(3)),
      correctAnswer: new FormControl('', Validators.required),
      difficultyLevel: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    })
  }


  createOption(): FormGroup {
    return this.formBuilder.group({
      option: new FormControl('', Validators.required)
    })
  }

  addOption() {
    this.options = this.addQuestionForm.get('options') as FormArray;
    this.options.push(this.createOption());
  }

  deleteOption(i) {
    this.options = this.addQuestionForm.get('options') as FormArray;
    if (this.correctSingleAnswer && this.options.length > 1) {
      if (this.options.at(i).value.option == this.correctSingleAnswer.option) {
        this.correctSingleAnswer = null;
        this.addQuestionForm.controls.correctAnswer.setValue(null);
      }
    }
    if (this.options.length > 1) {
      this.options.removeAt(i);
    }
    else {
      alert("This field is mandatory");
    }
  }

  selectSingleAnswer(index) {
    this.options = this.addQuestionForm.get('options') as FormArray;
    if (this.options.value[index].option != "") {
      this.correctSingleAnswer = this.options.value[index];
      this.addQuestionForm.controls['correctAnswer'].setValue(this.options.value[index].option)
    }
    else {
      alert("Please first provide answer!!!!")
      return false;
    }
  }

  onSubmit() {
    console.log(this.addQuestionForm);
    this.userService.postQuestion(this.addQuestionForm, "single").pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        console.log(data)
        alert("Question Submitted Successfully!");
        this.options = this.addQuestionForm.get('options') as FormArray;
        this.addQuestionForm.reset();
        this.correctSingleAnswer = "";
        while (this.options.length !== 0) {
          this.options.removeAt(0);
        }
        this.addOption();
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
