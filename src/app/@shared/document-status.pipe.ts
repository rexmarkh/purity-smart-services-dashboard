import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentStatus'
})
export class DocumentStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 1:
        return 'Not uploaded';
      case 2:
        return 'Need to be verified';
      case 3:
        return 'Approved';  
      case 4:
        return 'Rejected';  
    }
  }
}
