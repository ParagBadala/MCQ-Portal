import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.css']
})
export class MultipleChoiceComponent implements OnInit {

  addQuestionForm: FormGroup;
  correctMultipleAnswer = [];
  correctAnswer: FormArray;
  options: FormArray;
  categories = [];


  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.userService.getCategories().subscribe(
      (data) => {
        this.categories = data[0].category;
      }
    )
    this.addQuestionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      options: new FormArray([this.createOption()], Validators.minLength(3)),
      correctAnswer: new FormArray([], Validators.required),
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
    if (this.options.length > 1) {
      this.options.removeAt(i);
      var index = this.correctMultipleAnswer.indexOf(this.options.value[i].option);
      this.correctMultipleAnswer.splice(index, 1);
      this.correctAnswer.removeAt(index);
    }
    else {
      alert("This option is mandatory!!!")
    }
  }

  changeAnswer(event, index) {
    this.options = this.addQuestionForm.get('options') as FormArray;
    console.log(event)
    console.log(index)
    if (event.target.checked) {
      this.correctMultipleAnswer.push(this.options.value[index].option);
      console.log(this.correctMultipleAnswer);
      this.correctAnswer = this.addQuestionForm.get('correctAnswer') as FormArray;
      this.correctAnswer.push(this.createAnswer(this.options.value[index]));
    }
    else {
      var i = this.correctMultipleAnswer.indexOf(this.options.value[index].option);
      this.correctMultipleAnswer.splice(i, 1);
      this.correctAnswer.removeAt(i);
    }
  }

  createAnswer(answer): FormGroup {
    var temp = this.formBuilder.group({
      option: new FormControl('', Validators.required)
    })
    temp.controls['option'].setValue(answer.option)
    return temp;
  }

  onSubmit() {
    console.log(this.addQuestionForm);
    this.userService.postQuestion(this.addQuestionForm, "multiple").subscribe(
      (data) => {
        console.log(data)
        alert("Question Submitted Successfully!");
        this.addQuestionForm.reset();
        this.options = this.addQuestionForm.get('options') as FormArray;
        this.correctAnswer = this.addQuestionForm.get('correctAnswer') as FormArray;
        while (this.options.length !== 0) {
          this.options.removeAt(0);
        }
        while (this.correctAnswer.length !== 0) {
          this.correctAnswer.removeAt(0);
        }
        this.correctMultipleAnswer = [];
        this.addOption();
      }
    );
  }

  stopChecking(event, index) {
    this.options = this.addQuestionForm.get('options') as FormArray;
    if (this.options.value[index].option == "") {
      alert("Please first provide answer!!!!")
      event.preventDefault();
    }
  }

}
