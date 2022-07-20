import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, TemplateRef, Input } from '@angular/core';

@Component({
  selector: 'xm-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit {
  @Input() xmSeparator:TemplateRef<any> | string = '>';
  constructor() { }

  ngOnInit(): void {
  }

}
