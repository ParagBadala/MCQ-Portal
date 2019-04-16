import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,NavigationStart, Event as NavigationEvent } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    
   }

  ngOnInit() {
    // history.pushState({},"user","http://localhost:4200/")
    
  }

  addQuestion(){
    // this.router.navigate(['add-questions'], {relativeTo: this.activatedRoute})
    this.router.navigate(['add-questions'], {relativeTo: this.activatedRoute.parent})
  }

  listAllQuestions(){
    this.router.navigate(['manage-questions'], {relativeTo: this.activatedRoute.parent});
  }

  createTest(){
    this.router.navigate(['create-test'], {relativeTo: this.activatedRoute.parent});
  }

  assignedTests(){
    this.router.navigate(['assigned-tests'], {relativeTo: this.activatedRoute.parent});
  }

  
}
