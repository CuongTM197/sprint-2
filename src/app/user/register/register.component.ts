import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {RegisterService} from '../service/register.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  public passwordStatus = 'SHOW';
  public confirmPasswordStatus = 'SHOW';
  public buttonRegisterStatus = true;

  constructor(private registerService: RegisterService,
              private toastrService: ToastrService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$')]),
      pass: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]),
        confirmPassword: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')])
      }, this.checkSamePassword)
    });
  }

  checkSamePassword(pass: AbstractControl) {
    const value = pass.value;
    // tslint:disable-next-line:triple-equals
    if (value.password != value.confirmPassword) {
      return {confirmPass: true};
    }
    return null;
  }

  onRegister() {
    this.buttonRegisterStatus = false;
    if (this.registerForm.valid) {
      $('#field-username').css('border', 'none');
      $('#field-password').css('border', 'none');
      $('#field-confirmPassword').css('border', 'none');
      const userRegister = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.pass.password,
        confirmPassword: this.registerForm.value.pass.confirmPassword
      };
      this.registerService.goRegister(userRegister).subscribe(() => {
        setTimeout(() => {
          this.router.navigateByUrl('/login').then(() => {
            this.toastrService.success('????ng k?? th??nh c??ng!');
            this.buttonRegisterStatus = true;
          });
        }, 2000);
      }, error => {
        this.buttonRegisterStatus = true;
        switch (error.error.defaultMessage) {
          case 'usernameexists':
            this.registerForm.controls.username.setErrors({usernameexists: true});
            this.checkErrorUsername();
            break;
          case 'passwordnotsame':
            this.registerForm.controls.pass.setErrors({confirmPass: true});
            this.checkErrorConfirmPassword();
            break;
          default:
            this.toastrService.error('Vui l??ng nh???p ????ng th??ng tin!');
            break;
        }
        this.focusErrorInput();
      });
    } else {
      this.buttonRegisterStatus = true;
      this.checkErrorUsername();
      this.checkErrorPassword();
      this.checkErrorConfirmPassword();
      this.focusErrorInput();
    }
  }

  focusErrorInput() {
    if (this.registerForm.controls.username.invalid) {
      $('#username').focus();
      $('#field-username').css('border', '1px solid red');
      $('#field-password').css('border', 'none');
      $('#field-confirmPassword').css('border', 'none');
    } else if (this.registerForm.controls.pass.get('password').invalid) {
      $('#password').focus();
      $('#field-password').css('border', '1px solid red');
      $('#field-username').css('border', 'none');
      $('#field-confirmPassword').css('border', 'none');
    } else if (this.registerForm.controls.pass.get('confirmPassword').invalid || this.registerForm.controls.pass.invalid) {
      $('#confirmPassword').focus();
      $('#field-confirmPassword').css('border', '1px solid red');
      $('#field-username').css('border', 'none');
      $('#field-password').css('border', 'none');
    }
  }

  showPassword() {
    // tslint:disable-next-line:triple-equals
    if (this.passwordStatus == 'SHOW') {
      $('#password').attr('type', 'text');
      this.passwordStatus = 'HIDE';
      // tslint:disable-next-line:triple-equals
    } else if (this.passwordStatus == 'HIDE') {
      $('#password').attr('type', 'password');
      this.passwordStatus = 'SHOW';
    }
  }

  showConfirmPassword() {
    // tslint:disable-next-line:triple-equals
    if (this.confirmPasswordStatus == 'SHOW') {
      $('#confirmPassword').attr('type', 'text');
      this.confirmPasswordStatus = 'HIDE';
      // tslint:disable-next-line:triple-equals
    } else if (this.confirmPasswordStatus == 'HIDE') {
      $('#confirmPassword').attr('type', 'password');
      this.confirmPasswordStatus = 'SHOW';
    }
  }

  checkErrorUsername() {
    const dataToggleUsername = $('[data-toggle="username"]');
    if (this.registerForm.controls.username.hasError('required')) {
      dataToggleUsername.attr('data-content', 'T??n ????ng nh???p kh??ng ???????c ????? tr???ng.');
      dataToggleUsername.popover('show');
    } else if (this.registerForm.controls.username.hasError('pattern')) {
      dataToggleUsername.attr('data-content', 'T??n ????ng nh???p ph???i t??? 8 - 20 k?? t??? b???t ?????u b???ng ch??? c??i v?? kh??ng ???????c ch???a k?? t??? ?????c bi???t.');
      dataToggleUsername.popover('show');
    } else if (this.registerForm.controls.username.hasError('usernameexists')) {
      dataToggleUsername.attr('data-content', 'T??n ????ng nh???p ???? t???n t???i.');
      dataToggleUsername.popover('show');
    } else {
      dataToggleUsername.popover('hide');
    }
  }

  checkErrorPassword() {
    const dataTogglePassword = $('[data-toggle="password"]');
    if (this.registerForm.controls.pass.get('password').hasError('required')) {
      dataTogglePassword.attr('data-content', 'M???t kh???u kh??ng ???????c ????? tr???ng.');
      dataTogglePassword.popover('show');
    } else if (this.registerForm.controls.pass.get('password').hasError('pattern')) {
      dataTogglePassword.attr('data-content', 'M???t kh???u t???i thi???u t??m k?? t???, ??t nh???t m???t ch??? c??i, m???t s??? v?? m???t k?? t??? ?????c bi???t.');
      dataTogglePassword.popover('show');
    } else {
      dataTogglePassword.popover('hide');
    }
  }

  checkErrorConfirmPassword() {
    const dataToggleConfirmPassword = $('[data-toggle="confirmPassword"]');
    if (this.registerForm.controls.pass.get('confirmPassword').hasError('required')) {
      dataToggleConfirmPassword.attr('data-content', 'M???t kh???u kh??ng ???????c ????? tr???ng.');
      dataToggleConfirmPassword.popover('show');
    } else if (this.registerForm.controls.pass.get('confirmPassword').hasError('pattern')) {
      dataToggleConfirmPassword.attr('data-content', 'M???t kh???u t???i thi???u t??m k?? t???, ??t nh???t m???t ch??? c??i, m???t s??? v?? m???t k?? t??? ?????c bi???t.');
      dataToggleConfirmPassword.popover('show');
    } else {
      dataToggleConfirmPassword.popover('hide');
    }
    const dataToggleSamePass = $('[data-toggle="samePassword"]');

    if (this.registerForm.controls.pass.get('password').valid && this.registerForm.controls.pass.get('confirmPassword').valid) {
      if (this.registerForm.controls.pass.hasError('confirmPass')) {
        dataToggleSamePass.attr('data-content', 'M???t kh???u v?? x??c nh???n m???t kh???u ph???i gi???ng nhau.');
        dataToggleSamePass.popover('show');
      } else {
        dataToggleSamePass.popover('hide');
      }
    } else {
      dataToggleSamePass.popover('hide');
    }
  }

  ngOnDestroy(): void {
    $('[data-toggle="username"]').popover('hide');
    $('[data-toggle="password"]').popover('hide');
    $('[data-toggle="confirmPassword"]').popover('hide');
    $('[data-toggle="samePassword"]').popover('hide');
  }
}
