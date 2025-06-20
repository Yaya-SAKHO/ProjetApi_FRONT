import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique'
})
export class UniquePipe implements PipeTransform {
  transform(value: any[], property: string): any[] {
    if (!value || !property) return value;
    
    return value.filter((item, index, self) => 
      index === self.findIndex(t => {
        const prop1 = typeof t[property] === 'string' ? t[property] : t[property]._id;
        const prop2 = typeof item[property] === 'string' ? item[property] : item[property]._id;
        return prop1 === prop2;
      })
    );
  }
}