import { Injectable } from '@angular/core';
import FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FileSaverService {
  public getFileSaver(res: BlobPart, fileName: string) {
    const file = new File([res], fileName, { type: 'application/pdf' });
    FileSaver.saveAs(file);
  }
}
