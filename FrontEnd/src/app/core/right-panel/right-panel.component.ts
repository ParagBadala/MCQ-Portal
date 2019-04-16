import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/shared/test.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css']
})
export class RightPanelComponent implements OnInit {

  public display;
  public messageRoom;
  public window = false;

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.testService.getdisplay().subscribe(
      (data) => {
        this.display = data;
      }
    )
    this.chatListDisplay()
  }

  public chatListDisplay() {
    this.testService.getMessageRoom().subscribe(
      (data) => {
        this.messageRoom = data;
        this.window = data
      }
    )
  }
 
}
