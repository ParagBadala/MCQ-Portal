import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategory',
  pure: false
})
export class FilterCategoryPipe implements PipeTransform {

  transform(items: Array<any>, filter: {[key: string]: any }): Array<any> {
    console.log(items)
    console.log(Object.keys(filter))
    return items.filter(item => {
        let notMatchingField = Object.keys(filter)
                                     .find(key => item[key] !== filter[key]);

        return !notMatchingField; // true if matches all fields
    });
}
}
