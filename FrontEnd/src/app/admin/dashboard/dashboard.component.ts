import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  public reviewQuestion() {
    this.router.navigate(['review-question'], {relativeTo: this.activatedRoute.parent})
  }

  public listAllQuestions() {
    this.router.navigate(['all-question'], {relativeTo: this.activatedRoute.parent})

  }

  public addCategory(){
    this.router.navigate(['add-category'], {relativeTo: this.activatedRoute.parent})
  }

  public result() {
    this.router.navigate(['result'], {relativeTo: this.activatedRoute.parent});
  }

}
