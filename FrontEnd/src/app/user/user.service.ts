import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { TestService } from '../shared/test.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _baseUrl = environment._baseUrl;
  private _postUrl = "/api/post-question";
  private _getUrl = "/api/get-question/";
  private _updateUrl = "/api/update-question/"
  private _getCategory = "/category/get-categories"
  private _getUserUrl = "/api/get-user";
  private _getUserGroupUrl = "/api/get-userGroup/"
  private _postTestUrl = "/test/post-test";
  private _testDetailUrl = '/test/get-allTest/';
  private _deleteUrl = '/api/delete/'
  

  public testObj;
  public testQuestions;
  public tempTestQuestion;
  public test_id;
  public uid = environment.user_id;
  public destroy$: Subject<Boolean> = new Subject<Boolean>();
  // public uid = "5c482d96f336ecffa49125d2";

  constructor(private http: HttpClient, private router: Router, private testService:TestService) { }

  public postQuestion(data, type): Observable<any> {
    var options = [];
    var answers = [];
    if (type == "single") {
      options = this.controlsToArray(data.controls.options);
      answers.push(data.controls.correctAnswer.value);
    }

    if (type == "multiple") {
      options = this.controlsToArray(data.controls.options);
      answers = this.controlsToArray(data.controls.correctAnswer);
    }

    if (type == "subjective") {
      let obj = {
        question_description: data.controls.question.value,
        submitted_by: this.uid,
        // approved_by: "Pawan Parihar",
        q_type: type,
        q_difficulty: data.controls.difficultyLevel.value,
        status: "inactive",
        category: data.controls.category.value
      }
      return this.http.post(this._baseUrl + this._postUrl, obj, httpOptions);
    }

    let obj = {
      question_description: data.controls.question.value,
      options: options,
      correct: answers,
      submitted_by: this.uid,
      // approved_by: "Pawan Parihar",
      q_type: type,
      q_difficulty: data.controls.difficultyLevel.value,
      status: "inactive",
      category: data.controls.category.value
    }
    return this.http.post(this._baseUrl + this._postUrl, obj, httpOptions);
  }

  controlsToArray(controls) {
    var array = [];
    for (var i = 0; i < controls.length; i++) {
      array.push(controls.at(i).value.option);
    }
    return array;
  }

  getQuestionByUser(): Observable<any> {
    return this.http.get(this._baseUrl + this._getUrl + this.uid)
  }

  public updateQuestion(data) {
    return this.http.patch(this._baseUrl + this._updateUrl, data);
  }

  public getCategories(): Observable<any> {
    return this.http.get(this._baseUrl + this._getCategory)
  }

  public getUser(): Observable<any> {
    return this.http.get(this._baseUrl + this._getUserUrl);
  }

  public getUserGroups(): Observable<any> {
    return this.http.get(this._baseUrl + this._getUserGroupUrl + this.uid);
  }

  public postTest(data): Observable<any> {
    return this.http.post(this._baseUrl + this._postTestUrl, data);
  }

  public fetchTestDetails(): Observable<any> {
    return this.http.get(this._baseUrl + this._testDetailUrl + this.uid);
  }


  public fetchQuestions(Obj, test_id){
    this.test_id = test_id;
    this.testService.fetchQuestions(Obj, test_id).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public getNextQuestion(num): Observable<any> {
    return this.http.get(this._baseUrl + `/api/next-question/?user_id=${this.uid}&num=${num}&test_id=${this.test_id}`);
  }

  public submitResponse(data): Observable<any> {
    var Obj = [
      {
        user_id: this.uid
      },
      {
        test_id: this.test_id,
        answers: data,
        result: null
      }
    ]
    return this.http.post(this._baseUrl + '/test/submit', Obj, httpOptions)
  }

  public getTestById(testId): Observable<any> {
    return this.http.get<any>(this._baseUrl + '/test/check?id=' + testId)
  }

  public save(Obj): Observable<any> {
    return this.http.post<any>(this._baseUrl + '/test/save', Obj, httpOptions)
  }

  public deleteQuestion(Obj): Observable<any> {
    return this.http.delete<any>(this._baseUrl+ this._deleteUrl+ Obj)
  }

}
