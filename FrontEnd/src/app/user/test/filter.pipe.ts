import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let filter = args ? args.toLowerCase():null;
    return filter ? value.filter(
      (user)=>{return user.toLowerCase().indexOf(filter)!=-1}
      ):value;;
  }

}
