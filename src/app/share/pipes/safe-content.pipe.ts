import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

type ContentType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';
type MethodType = 'bypassSecurityTrustHtml' | 'bypassSecurityTrustStyle' | 'bypassSecurityTrustScript' | 'bypassSecurityTrustUrl' | 'bypassSecurityTrustResourceUrl';
const funcMap:{[key:string]:MethodType} = {
  html: 'bypassSecurityTrustHtml',
  style: 'bypassSecurityTrustStyle',
  script: 'bypassSecurityTrustScript',
  url: 'bypassSecurityTrustUrl',
  resourceUrl: 'bypassSecurityTrustResourceUrl'
}

@Pipe({
  name: 'safeContent'
})
export class SafeContentPipe implements PipeTransform {
  constructor(private domSanitizer:DomSanitizer){

  }
  transform(value: string, type: ContentType = 'html'): any {
    const methodStr:MethodType =  funcMap[type];
    return this.domSanitizer[methodStr](value);
  }

}
