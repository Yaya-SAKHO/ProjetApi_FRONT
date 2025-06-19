// src/app/shared/pipes/initials.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  }
}