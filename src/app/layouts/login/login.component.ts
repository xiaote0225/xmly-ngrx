import { MessageService } from './../../share/components/message/message.service';
import { storageKeys } from 'src/app/configs';
import { WindowService } from 'src/app/services/tools/window.service';
import { trigger, transition, style, animate,AnimationEvent } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef, Renderer2, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { empty, merge, of, pluck, Subscription, switchMap } from 'rxjs';
import { OverlayRef, OverlayService } from 'src/app/services/tools/overlay.service';
import { UserService } from 'src/app/services/apis/user.service';
import { ContextService } from 'src/app/services/business/context.service';

@Component({
  selector: 'xm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('modalAni',[
      transition(':enter',[
        style({
          opacity:0,
          transform:'translateY(100%)'
        }),
        animate('.2s',style({
          opacity:1,
          transform:'translateY(0)'
        }))
      ]),
      transition(':leave',[
        animate('.3s',style({
          opacity:0,
          transform:'translateY(-100%)'
        }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit,AfterViewInit,OnChanges {

  @Input() show = false;
  @Output() hide = new EventEmitter<void>();
  visible = false;
  remember = true;
  formValues = this.fb.group({
    phone: ['', [
      Validators.required,
      Validators.pattern(/^1\d{10}$/)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  private overlayRef!:OverlayRef | null;
  private overlaySub!:Subscription | null;
  @ViewChild('modalWrap',{static:false}) private modalWrap!:ElementRef;
  constructor(
    private overlayService:OverlayService,
    private el:ElementRef,
    private rd2:Renderer2,
    private fb:FormBuilder,
    @Inject(PLATFORM_ID) private platformId:object,
    private userService:UserService,
    private winServe:WindowService,
    private contextService:ContextService,
    private messageServe:MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.show){
      this.create();
    }else{
      this.visible = false;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.showOverlay();
  }

  get formControls(){
    const controls = {
      phone: this.formValues.get('phone'),
      password:this.formValues.get('password')
    };
    return {
      phone:{
        control: controls.phone,
        showErr: controls.phone?.touched && controls.phone.invalid,
        errors: controls.phone?.errors!
      },
      password:{
        control: controls.password,
        showErr: controls.password?.touched && controls.password.invalid,
        errors: controls.password?.errors!
      }
    }
  }

  create(){
    if(isPlatformBrowser(this.platformId)){
      this.overlayRef = this.overlayService.create({fade:true,center:true,responseEvent:true,backgroundColor:'rgba(0, 0, 0, .32)'})!;
      console.log('overlayRef-------------------------',this.overlayRef);
      this.overlaySub = merge(
        this.overlayRef.backdropClick(),
        this.overlayRef.backdropKeyup().pipe(
          pluck('key'),
          switchMap(key => {
            return key.toUpperCase() === 'ESCAPE' ? of(key) : empty();
          })
        )
      ).subscribe(() => {
        console.log('listen events');
        // this.hideOverlay();
        this.hide.emit();
      });
      this.visible = true;
      setTimeout(() => {
        this.rd2.appendChild(this.overlayRef?.container,this.modalWrap.nativeElement);
      },0);
    }
  }


  // dispose():void{
  //   if(this.overlayRef){
  //     this.visible = false;
  //   }
  //   // if(this.overlaySub){
  //   //   this.overlaySub.unsubscribe();
  //   //   this.overlaySub = null;
  //   // }
  //   // if(this.overlayRef){
  //   //   this.overlayRef?.dispose();
  //   //   this.overlayRef = null;
  //   // }
  // }

  submit():void{
    console.log('-------------------submit');
    console.log('submit',this.formValues.value)
    if(this.formValues.valid){
      this.userService.login(this.formValues.value).subscribe(({user,token}) => {
        this.contextService.setUser(user);
        // console.log(res);
        this.winServe.setStorage(storageKeys.auth,token);
        if(this.remember){
          this.winServe.setStorage(storageKeys.remember,'true');
        }
        this.hide.emit();
        this.messageServe.success('登陆成功');
        // this.winServe.alert('登陆成功');
      },error => {
        console.error('error',error);
        // alert(error.error.message || '登陆失败');
        this.messageServe.error(error.error.message || '登陆失败');
      });
    }
  }


  animationDone(event:AnimationEvent):void{
    if(event.toState === 'void'){
      if(this.overlaySub){
        this.overlaySub.unsubscribe();
        this.overlaySub = null;
      }
      if(this.overlayRef){
        this.overlayRef?.dispose();
        this.overlayRef = null;
      }
    }
  }
}
