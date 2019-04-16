import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { Router, ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private _baseUrl = environment._baseUrl 
  private _getAllQuestion = '/api/get-allQuestion';
  private _reviewUrl = '/api/status-question';
  private _statusUrl = '/api/change-status';
  private _addCatUrl = '/api/add-cat';
  private _resultUrl = '/test/result';
  private _viewResultUrl = '/test/viewUserList/'
  private _userListUrl = '/api/get-user'
  public _loginStatus = false;
  public userList;
  constructor(private _http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) { }

  /** Helper Function */
  get loggedIn(): any {
    console.log(this._loginStatus)
    return this._loginStatus;
  }

  set loggedIn(data) {
    this._loginStatus = data
    console.log(this._loginStatus)
  }

  /** Http methods */
  public allQuestion(): Observable<any> {
    return this._http.get<any>(this._baseUrl + this._getAllQuestion);
  }

  public reviewQuestion(): Observable<any> {
    return this._http.get<any>(this._baseUrl + this._reviewUrl)
  }

  public changeStatus(Obj): Observable<any> {
    console.log(Obj)
    return this._http.patch<any>(this._baseUrl + this._statusUrl, Obj)
  }

  public addCategory(cName): Observable<any> {
    return this._http.post<any>(this._baseUrl + this._addCatUrl, cName)
  }

  public checkCategory() {

  }

  public getTestDetails(): Observable<any> {
    return this._http.get<any>(this._baseUrl + this._resultUrl);
  } 
  public viewResult(testId) {
    this._http.get<any>(this._baseUrl + this._viewResultUrl + testId).subscribe(
      (data) => {
        this.userList = data
        console.log(this.userList)
        this.router.navigateByUrl('admin/view-result');
      }
    )
  }

  public getUserList(): Observable<any> {
    return this._http.get<any>(this._baseUrl + this._userListUrl)
  }

}
