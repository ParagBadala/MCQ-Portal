import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin/admin.service';
import { TestService } from 'src/app/shared/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  model ={
    username :'',
    password:''
  };
  routerObservableInstance$;

  constructor(private adminService: AdminService ,private router: Router, private activatedRoute: ActivatedRoute, private testService: TestService) { }

  ngOnInit() { }


  public userLogin() {
    this.router.navigate(['user'], {relativeTo: this.activatedRoute.parent});
  }

  public adminLogin(form) {
    console.log(form)
    if(form.Name == 'admin' && form.Password == 'admin'){
      this.adminService.loggedIn = true;
      this.testService.setMessageRoom(true);
      console.log(this.adminService.loggedIn)
      this.router.navigate(['admin'], {relativeTo: this.activatedRoute.parent});
    }
    else{
      alert("Username or Password is incorrect.")
      console.log("Wrong Credentials")
    }
  }

}
