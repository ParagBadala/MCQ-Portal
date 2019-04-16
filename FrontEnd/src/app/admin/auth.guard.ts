import { Injectable } from '@angular/core';
import { Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
import { TestService } from '../shared/test.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private adminService: AdminService, private router: Router, private testService: TestService) {}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.adminService.loggedIn){
      this.router.navigate(['']);
      return false;
    }
    this.testService.setMessageRoom(true);
    console.log("Auth guard false invoked")
      return true
  }
  
}
