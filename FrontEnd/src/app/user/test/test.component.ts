import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public tName: string;
  public Category = [];
  public tCategory: string
  public tLevel: string;
  public tDuration: number;
  public tId: string;
  public totalQuestion: number;
  public createdBy: string;
  public participants = [];
  public tempParticipants = [];
  public status: string;
  public startTime: string;
  public startTimestamp: Date;
  public listFilter: string;
  public users = [];
  public groups = []
  public selectedUser: string;
  public isValid: Boolean = true;
  public participatedGroup = [];
  public selectedGroup;
  public showUsers;
  public showGroups;
  public showTitle;
  public grpMembers = [];

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(
      (data) => {
        this.Category = data[0].category;
    })
    
    this.userService.getUser().pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        this.users = res;
        console.log(res)
    })

    this.userService.getUserGroups().pipe(takeUntil(this.destroy$)).subscribe(
      (data)=>{
        console.log(data)
        this.groups = data;
      })
  }

  public addParticipants() {
    // this.participants.push(this.selectedUser)
    if (this.selectedUser === 'All Users') {
      this.participants = Object.assign([], this.users);
      this.tempParticipants = Object.assign([], this.users);
    } else {
      for (var i = 0; i < this.users.length; i++) {
        let uname = this.users[i].firstName + ' ' + this.users[i].lastName
        if (uname === this.selectedUser) {
          this.participants.push(this.users[i]);
          this.tempParticipants.push(this.users[i]);
          this.users.splice(i, 1);
          this.selectedUser = null;
        }
      }
    }
    console.log(this.tempParticipants);
    console.log(this.participants)
    this.showUsers = true;
  }

  public addGroup() {
    for (var i = 0; i < this.groups.length; i++) {
      let gname = this.groups[i].groupName;
      if (gname === this.selectedGroup) {
        this.participatedGroup.push(this.groups[i]);
        for( let group of this.participatedGroup) {
          this.grpMembers = group.groupMembers;
        }
        console.log(this.grpMembers);
        console.log(this.users);
        for( let member of this.grpMembers) {
          // this.users = this.users.filter(user => user.empId !== g.empId);
          this.participants.push(member)
          // this.tempParticipants.push(member)
        }
        this.groups.splice(i, 1);
        this.selectedGroup = null;
      }
    }
    console.log(this.participants);
    this.showGroups = true;
  }

  public removeParticipants(idx) {
    let user = this.participants.splice(idx, 1);
    // console.log(this.participants)
    this.users.push(user[0]);
    console.log(this.participants);
    if ( this.participants.length === 0) {
      this.showUsers  = false;
      } else {
        this.showUsers = true;
      }
    this.participants.splice(idx, 1);
    let tempUser = this.tempParticipants.splice(idx, 1);
    this.users.push(tempUser[0]);
  }

  public removeGroupParticipated(idx) {
    let group = this.participatedGroup.splice(idx, 1);
    group['groupMembers'].forEach(member =>{
      this.participants = this.participants.filter(user => user.empId !== member.empId);
    })
    this.groups.push(group[0]);
    if ( this.participatedGroup.length === 0) {
      this.showGroups  = false;
      } else {
        this.showGroups = true;
      }
      // this.grpMembers.forEach(member => this.users.push(member));
      console.log(this.users);
  }

  public postTest() {
    this.tDuration = this.tDuration * 60000;
    var Obj = {
      t_id: this.tId,
      t_name: this.tName,
      t_category: this.tCategory,
      t_level: this.tLevel,
      t_duration: this.tDuration,
      total_question: this.totalQuestion,
      created_by: "Parag Badala",
      participants: this.participants,
      status: "active",
      start_time: this.startTimestamp
    }
    console.log(this.participants)
    this.userService.postTest(Obj).pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        console.log(res)
        this.tDuration = null;
        this.tName = "";
        this.tCategory = "";
        this.tLevel = "";
        this.totalQuestion = null;
        this.participants = [];
        this.startTime = null;
        alert('Test Created Successfully')
        this.router.navigate([''], {relativeTo: this.activatedRoute.parent})
      }
    )
  }

  displayTime() {
    this.startTimestamp = new Date(this.startTime)
    console.log(this.startTimestamp)
  }

  checkDuplicate(event) {
    this.isValid = true;
    this.userService.getTestById(event).pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.length != 0) {
        this.isValid = false;
      }
    }
    )
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
