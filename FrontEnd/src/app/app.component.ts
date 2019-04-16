import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from './admin/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quiz-app';
  public loggedInUser: any;
  public adminLoggedIn: boolean = false;

  model ={
    username :'',
    password:''
  };

  constructor(private router: Router, private route: ActivatedRoute, private adminService: AdminService) {

  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    // environment.user_id = this.loggedInUser ? this.loggedInUser['empId'] : null;
  }

  public adminLogin(form) {
    console.log(form)
    if(form.Name == 'admin' && form.Password == 'admin'){
      // window.open('./admin');
      window.open(environment._adminUrl);
      this.adminService.loggedIn = true;
      this.adminLoggedIn = this.adminService.loggedIn;
      console.log(this.adminService.loggedIn);
      // window.open('/admin');
      this.router.navigate(['admin'], {relativeTo: this.route.parent});
    }
    else{
      // alert("Username or Password is incorrect.")
      console.log("Wrong Credentials")
    }
  }
}
