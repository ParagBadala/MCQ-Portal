import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/shared/test.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {

  public display;

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.testService.getdisplayFilter().subscribe(
      (data) => {
        setTimeout(() => {
        this.display = data;
      });
      }
    )
  }

}
