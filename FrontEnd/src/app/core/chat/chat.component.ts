import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { interval, Subject } from 'rxjs';
import { flatMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  public chat;
  public uid;
  public chatHistory;
  public showDiv = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.uid = this.chatService.uid;
    console.log(this.uid);
    this.receiveMsg();
    interval(5000).pipe(takeUntil(this.destroy$), flatMap(()=>this.chatService.receiveMsg())).subscribe((data)=>{
      console.log(data);
      this.chatHistory = data;
    })
    
  }

  public receiveMsg() {
    this.chatService.receiveMsg().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        console.log(data);
        this.chatHistory = data
      }
    )
  }

  public message() {
    if(!(this.chat == undefined || this.chat == null || this.chat.trim() == '')){
      this.chat = this.chat.trim();
      // let Obj = {
      //   "user":this.uid,
      //   "msgObj":[{
      //     "sender":this.uid,
      //     "receiver":"admin",
      //     "contentType": "text/plain",
      //     "msg": this.chat,
      //     "timestamp": new Date().setDate(new Date().getDate())
      //     }],
      //   "type":"text/plain",
      //   "extra":[]
      // }
      let Obj = {
        "sender":this.uid,
        "receiver": "104341",
        "msg": this.chat,
        "timestamp": new Date().setDate(new Date().getDate()),
        "type":"text/plain",
        "extra":[]
      }
      this.chatService.sendMsg(Obj).subscribe((data)=>{
        this.receiveMsg()
      })
      this.chat='';
    }
  }

  public showChat() {
   this.showDiv = ! this.showDiv;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
