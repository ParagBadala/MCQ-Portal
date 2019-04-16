import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  public test_id;
  public uid = environment.user_id;
  public testObj;
  public testQuestions;
  public random = [];
  public questions = [];

  private _testQuestions: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public testQuestions$ = this._testQuestions.asObservable();

  private _questions: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public questions$ = this._questions.asObservable();

  private _currentQuestion: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentQuestion$ = this._currentQuestion.asObservable();

  private _show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public show$ = this._show.asObservable();

  private _showFilter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showFilter$ = this._showFilter.asObservable();

  private _idx: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public idx$ = this._idx.asObservable();

  private _applied: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public applied$ = this._applied.asObservable();

  private _selectedFilter: BehaviorSubject<any> = new BehaviorSubject<any>("");
  public selectedFilter$ = this._selectedFilter.asObservable();

  private _random: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public random$ = this._random.asObservable();

  private _adminStatus: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public adminStatus$ = this._adminStatus.asObservable();

  constructor(private http:HttpClient, private router:Router) { }

  public setTestQuestion(data){
    this._testQuestions.next(data);
  }

  public getTestQuestions(){
    return this.testQuestions$;
  }

  public setQuestion(data){
    const currentValue = this._questions.value;
    let updatedValue;
    if(isArray(data)){
      updatedValue = [...data];
    }
    else{
      updatedValue = [...currentValue, data]
    }
    this._questions.next(updatedValue);
  }

  public getQuestions(){
    return this.questions$;
  }

  public getNextQuestion(num): Observable<any> {
    return this.http.get(environment._baseUrl + `/api/next-question/?user_id=${this.uid}&num=${num}&test_id=${this.test_id}`);
  }

  public setdisplay(value) {
    this._show.next(value);
  }

  public getdisplay() {
    return this.show$
  }

  public setdisplayFilter(value) {
    this._showFilter.next(value);
  }

  public getdisplayFilter() {
    return this.showFilter$
  }

  public setindex(value) {
    this._idx.next(value)
  }

  public getindex() {
    return this.idx$
  }

  public setapplied(value) {
    this._applied.next(value);
  }

  public getapplied() {
  return this.applied$;    
  }

  public setRandom(value){
    const currentValue = this._random.value;
    let updatedValue;
    if(isArray(value)){
      updatedValue = [...value];
    }
    else{
      updatedValue = [...currentValue, value]
    }
    this._random.next(updatedValue);
  }

  public getRandom(){
    return this.random$;
  }

  public fetchQuestions(Obj, test_id): Observable<any> {
    this.test_id = test_id;
    
    this.testObj = Obj; 
    console.log("inside fetch")
    return this.http.get(environment._baseUrl + `/api/test-question/?uId=${this.uid}&level=${Obj.level}&category=${Obj.category}&tNQ=${Obj.totalQuest}&tid=${this.test_id}&time=${Obj.duration}`).pipe(
      map(
        (data:{"startQuest":"","index":""}) => {
          console.log(data)
          this.setQuestion(data.startQuest)
          this.setTestQuestion(data);
          this.router.navigateByUrl('/user/start-test');
        }
      )
    )
  }

  public setCurrentQuestion(index){
    this._currentQuestion.next(this.questions[index]);
  }

  public getCurrentQuestion(){
    return this.currentQuestion$;
  }

  public setSelectedFilter(value){
    this._selectedFilter.next(value)
  }

  public getSelectedFilter(){
    return this.selectedFilter$;
  }

  public setMessageRoom(value) {
    console.log("testService setMessageRoom invoked")
    this._adminStatus.next(value)
  }

  public getMessageRoom() {
    return this.adminStatus$;
  }

}
