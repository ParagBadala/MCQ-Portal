import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.css']
})
export class ViewResultComponent implements OnInit, OnDestroy {

  public userList = [];
  public userName = [];
  private destroy$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.userList = this.adminService.userList
    this.adminService.getUserList().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.userList.forEach(list => {
          data.forEach(item => {
            if(item.empId == list.user_id) {
              this.userName.push(item.firstName +' '+ item.lastName)
            }
          });
        })
      }
    )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
