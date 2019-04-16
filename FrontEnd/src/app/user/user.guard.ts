import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { TestPortalComponent } from './test-portal/test-portal.component';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanDeactivate<TestPortalComponent> {

  constructor(private userService: UserService) { }

  canDeactivate(component: TestPortalComponent) : Observable<boolean> | Promise<boolean> | boolean {
    if (component.isOpened && confirm(`Navigate away will submit your test?`)) {
      console.log("Guard Called")
      let result = component.autoSubmit();
      console.log(result)
      let data =this.userService.submitResponse(result).toPromise().then(()=>true)                                 
      return data;
    }
    else if(component.isSubmited)
      return true;
    else
      return false
  }
}
