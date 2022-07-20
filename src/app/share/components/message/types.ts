import { TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
export type XmMessgeType = 'success' | 'info' | 'warning' | 'error';

export interface XmMessageOptions{
  type?: XmMessgeType;
  duration?: number;
  showClose?: boolean;
  pauseOnHover?:boolean;
  maxStack?: number;
  animate?: boolean;
}

export interface XmMessageItemData{
  messageId: string;
  content: string | TemplateRef<void>;
  onClose: Subject<void>;
  state:'enter' | 'leave';
  options?: XmMessageOptions;
}
