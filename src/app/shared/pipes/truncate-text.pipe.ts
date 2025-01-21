// truncate-text.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string, maxCharCount: number): string {
    if (!value || value.length <= maxCharCount) {
      return value;
    }
    return value.substring(0, maxCharCount) + '...';
  }
}
