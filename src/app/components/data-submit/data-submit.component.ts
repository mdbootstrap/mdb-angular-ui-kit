import { Component, EventEmitter } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

const URL = 'http://localhost:4200/data-submit';

@Component({
  selector: 'app-data-submit',
  templateUrl: './data-submit.component.html',
  styleUrls: ['./data-submit.component.scss']
})
export class DataSubmitComponent {
  public uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'doc', 'compress', 'xls', 'pdf', 'ppt']
  });

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    console.log(file);
  }
}


