import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public uid = environment.user_id;
  private _baseUrl = environment._baseUrl
  private _sendUrl = '/api/send-msg';
  private _receiveUrl = '/api/receive-msg/';

  constructor(private http: HttpClient) {
    console.log('this ', environment)
   }

  public sendMsg(Obj): Observable<any> {
    return this.http.post<any>(this._baseUrl + this._sendUrl, Obj, httpOptions)
  }

  public receiveMsg(): Observable<any> {
    return this.http.get<any>(this._baseUrl + this._receiveUrl + this.uid);
  }

  public receiveMsgAdmin(): Observable<any> {
    return this.http.get<any>(this._baseUrl + this._receiveUrl + '104341')
  }


}
