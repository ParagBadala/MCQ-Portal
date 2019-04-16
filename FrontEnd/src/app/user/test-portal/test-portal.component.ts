import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TestService } from 'src/app/shared/test.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-test-portal',
  templateUrl: './test-portal.component.html',
  styleUrls: ['./test-portal.component.css']
})


export class TestPortalComponent implements OnInit, OnDestroy {

  currentQuestion;
  startIndex: Number;
  maxQuestion: any;
  currentIndex;
  response = [];
  responseObj;
  numbers = [];
  clickedIndex: number;
  isapplied = [];
  testDetails;
  public minute;
  public second;
  public uid;
  public tid;
  public time;
  public t;
  public s;
  public isStarted = false;
  public isSubmited = false;
  public count = 0;
  public show = true;
  public random;
  public questions;
  
  private destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute ,private userService: UserService, private testService: TestService,@Inject(DOCUMENT) private document: any) {
  }


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    window.event.returnValue = false;
    if (event.keyCode == 116 || (event.ctrlKey && event.keyCode == 82) || event.keyCode == 116) {
      if (this.count < 2) {
        alert('Warning Test will be submitted on reload')
        this.count++;
      }
      else {
        this.submitTest()
      }
    }
  }

  @HostListener('document:contextmenu', ['$event']) onRightClickHandler(event: KeyboardEvent) {
    window.event.returnValue = false;
  }

  ngOnInit() {
    //  this.fullScreen();
    this.testService.getQuestions().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      console.log(data);
      this.questions = data;
    })

    this.testService.getTestQuestions().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.setTestData(data);
    })
    
    this.testService.getindex().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      console.log(data)
      this.currentQuestion = this.questions[data];
      console.log(this.response);
      if(!this.response[data]){
        this.responseObj = {
          q_id: this.currentQuestion._id,
          answer: []
        }
        this.response[data] = this.responseObj;
      }
      this.currentIndex = data;
    })

    this.testService.getRandom().pipe(takeUntil(this.destroy$)).subscribe((data)=>{
      this.random = data;
    })

    this.testService.setdisplay(this.show)
  }

  // fullScreen() {
  //   let elem = document.documentElement;
  //   let methodToBeInvoked = elem.requestFullscreen ||
  //     elem.webkitRequestFullScreen || elem['mozRequestFullscreen']
  //     ||
  //     elem['msRequestFullscreen'];
  //   if (methodToBeInvoked) methodToBeInvoked.call(elem);
  // }

  setTestData(testData) {
    if (testData.progress ? true : false) {
      this.testService.setQuestion(testData.sent_question);
      this.currentQuestion = this.questions[0];
      this.minute = Math.floor(testData.time_lapsed / 60000);
      this.second = Math.floor((testData.time_lapsed % 60000) / 1000);
      this.testService.setRandom(testData.index)
      this.response = testData.response;
      for (let i = 0; i < this.response.length; i++) {
        if (this.response[i] != null) {
          if (this.response[i].answer.length > 0) {
            this.isapplied[i] = true;

          }
        }
      }
      this.testService.setapplied(this.isapplied)
    }
    else {
      this.currentQuestion = this.questions[0];
      this.currentQuestion = testData.startQuest;
      this.testDetails = this.testService.testObj;
      this.shuffle(this.currentQuestion.options);
      this.startIndex = testData.index;
      this.responseObj = {
        q_id: this.currentQuestion._id,
        answer: []
      }
      this.response.push(this.responseObj);
      this.testService.setRandom(this.startIndex);
      this.minute = Math.floor(this.testDetails.duration / 60000);
      this.second = (this.testDetails.duration % 60000) / 1000;

    }
    this.maxQuestion = this.testService.testObj.totalQuest;
    this.uid = this.userService.uid
    this.tid = this.userService.test_id
    this.fillNumber();
    this.startCountdown()
    this.saveResponse();
    this.isStarted = true;
  }

  get isOpened() {
    return this.isStarted;
  }

  public fillNumber() {
    for (let i = 0; i < this.maxQuestion; i++) {
      this.numbers.push(i);
    }
  }

  public nextQuestion(str) {
    let temp;
    if (str == "next") {
      temp = this.currentIndex + 1;
    }
    else {
      temp = this.clickedIndex;
    }
    if (!this.questions[temp]) {
      var i = Math.floor(Math.random() * (this.maxQuestion))
      if (this.random.includes(i)) {
        this.nextQuestion(str);
      }
      else {
        this.testService.setRandom(i);
        this.testService.getNextQuestion(i).pipe(takeUntil(this.destroy$)).subscribe(
          (data) => {
            this.currentQuestion = data;
            this.shuffle(this.currentQuestion.options);
            this.questions[temp] = data
            this.testService.setQuestion(this.questions);
            this.responseObj = {
              q_id: this.currentQuestion._id,
              answer: []
            }
            this.response[temp] = this.responseObj;
            this.currentIndex = temp;
            this.testService.setindex(this.currentIndex)
          }
        )
      }
    }
    else {
      this.currentIndex = temp;
      this.testService.setindex(this.currentIndex)
      this.currentQuestion = this.questions[this.currentIndex];
    }
  }

  public prevQuestion() {
    if (!this.questions[this.currentIndex - 1]) {
      var i = Math.floor(Math.random() * (this.maxQuestion))
      if (this.random.includes(i)) {
        this.prevQuestion();
      }
      else {
        this.testService.setRandom(i);
        this.testService.getNextQuestion(i).pipe(takeUntil(this.destroy$)).subscribe(
          (data) => {
            this.currentQuestion = data;
            this.shuffle(this.currentQuestion.options);
            this.currentIndex--;
            this.responseObj = {
              q_id: this.currentQuestion._id,
              answer: []
            }
            this.response[this.currentIndex] = this.responseObj;
            this.questions[this.currentIndex] = data
            this.testService.setQuestion(this.questions)
            this.testService.setindex(this.currentIndex)
          }
        )
      }
    }
    else {
      this.currentIndex--;
      this.testService.setindex(this.currentIndex)
      this.currentQuestion = this.questions[this.currentIndex]
    }
  }

  public saveResponse() {
    let Obj = {
      response: this.response,
      index: this.random,
      questions: this.questions,
      uid: this.uid,
      tid: this.tid,
      time: null
    }
    this.t = this.timer(Obj);
  }

  public timer(Obj) {
    return setInterval(() => {
      this.time = this.minute * 60000 + this.second * 1000;
      Obj.response = this.response;
      Obj.index = this.random;
      Obj.questions = this.questions;
      Obj.time = this.time
      this.userService.save(Obj).pipe(takeUntil(this.destroy$)).subscribe()
    }, 30000)
  }

  public saveResponseByUser() {
    let Obj = {
      response: this.response,
      index: this.random,
      questions: this.questions,
      uid: this.uid,
      tid: this.tid,
      time: this.minute * 60000 + this.second * 1000
    }
    this.userService.save(Obj).pipe(takeUntil(this.destroy$)).subscribe()
  }

  public submitTest() {
    console.log("Submit Test")
    this.userService.submitResponse(this.response).pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        if(confirm('Do you want to submit the test?')){
          alert("Test submitted successfully!")
          this.isStarted = false;
          this.isSubmited = true;
          this.router.navigate(['assigned-tests'], {relativeTo: this.activatedRoute.parent})
        }
      }
    )
  }

  public autoSubmit() {
    return this.response;
  }

  public changeResponse(value, event) {
    if (this.currentQuestion.q_type == 'single') {
      this.response[this.currentIndex].answer[0] = value;
      this.isapplied[this.currentIndex] = true;
      this.testService.setapplied(this.isapplied)
    }
    if (this.currentQuestion.q_type == 'multiple') {
      if (event.target.checked) {
        this.response[this.currentIndex].answer.push(value);
        this.isapplied[this.currentIndex] = true;
        this.testService.setapplied(this.isapplied)
      }
      else {
        var index = this.response[this.currentIndex].answer.indexOf(value);
        if (index !== -1) {
          this.response[this.currentIndex].answer.splice(index, 1);
          this.isapplied[this.currentIndex] = false;
          this.testService.setapplied(this.isapplied)
        }
      }
    }
  }

  public shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  public buttonClicked(idx) {
    this.clickedIndex = idx;
    this.nextQuestion('button');
  }

  public startCountdown() {
    this.s = setInterval(() => {
      if (this.minute == 0 && this.second == 0) {
        this.submitTest();
      }
      else {
        this.second = this.checkSecond(--this.second);
        if (this.second == 59) {
          this.minute = this.minute - 1
        }
      }
    }, 1000);

  }

  public checkSecond(sec) {
    if (sec < 0) { sec = 59 }
    else { sec = sec }
    return sec;
  }

  ngOnDestroy() {
    clearInterval(this.t);
    clearInterval(this.s);
    this.show= !this.show;
    this.testService.setdisplay(this.show)
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
