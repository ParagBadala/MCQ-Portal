import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit, OnDestroy {

  public testDetails = [];
  private destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.allTest()
  }

  public viewResult(testId) {
    this.adminService.viewResult(testId)  
  }

  public allTest() {
    this.adminService.getTestDetails().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.testDetails = data
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
