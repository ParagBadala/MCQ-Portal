import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { interval, Subject } from 'rxjs';
import { takeUntil, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-message-room',
  templateUrl: './message-room.component.html',
  styleUrls: ['./message-room.component.css']
})
export class MessageRoomComponent implements OnInit {

  public chats = [];
  public userMsgId = new Map();
  public userList = []
  public messages = [];
  public showDiv = true;
  public showWindow = false;
  public windowName;
  public userId;
  public adminMsg;
  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.receiveMsg()
    interval(5000).pipe(takeUntil(this.destroy$), flatMap(() => this.chatService.receiveMsgAdmin())).subscribe(
      (data) => {
        this.chats = data;
        this.chats.forEach(user => {
          if(!this.userMsgId.has(user.sender) && user.sender !== "104341"){
            this.userMsgId.set(user.sender, true);
            this.userList.push({
              'empId': user.sender,
              'name': user.name
            });
          }
        })
      })
  }

  public receiveMsg() {
    this.chatService.receiveMsgAdmin().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.chats = data;
        this.chats.forEach(user => {
          if(!this.userMsgId.has(user.sender) && user.sender !== "104341"){
            this.userMsgId.set(user.sender, true);
            this.userList.push({
              'empId': user.sender,
              'name': user.name
            });
          }
        })
    })
  }

  public sendMsg() {
    if(!(this.adminMsg == undefined || this.adminMsg == null || this.adminMsg.trim() == '')){
      this.adminMsg = this.adminMsg.trim();
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
        "sender":"104341",
        "receiver":this.userId,  
        "msg": this.adminMsg,
        "timestamp": new Date().setDate(new Date().getDate()),
        "type":"text/plain",
        "extra":[],
        "name": "Admin"
      }
      this.chatService.sendMsg(Obj).pipe(takeUntil(this.destroy$)).subscribe((data)=>{
        this.messages.push(Obj)
      })
      this.adminMsg='';
    }
  }

  public showChat() {
    this.showDiv = ! this.showDiv;
   }
  
   public openChatWindow(obj) {
     this.messages = []
     this.showWindow = true;
      for(let i=0;i<this.chats.length;i++){
        if(obj.empId == this.chats[i]['sender'] || obj.empId == this.chats[i]['receiver']){
         this.messages.push(this.chats[i])
        }
      }
     this.windowName = obj.name;
     this.userId = obj.empId
   }
   
}
