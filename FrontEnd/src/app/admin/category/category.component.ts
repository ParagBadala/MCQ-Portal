import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public isValid = true;
  public cat: string;
  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  // public checkDuplicate(event){
  //   this.isValid = true;
  //       this.adminService.checkCategory(event).subscribe(data=> {
  //         if(data.length!=0){
  //           this.isValid = false;
  //           }
  //         }
  //       )
  // }

  public addCat() {
    var Obj = {
      cat: this.cat
    }
    this.adminService.addCategory(Obj).subscribe(
      (data) => {
        console.log(data)
      }
    );
  }

}
