import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountsService } from '../_services/accounts.service';
import { JwtHelperService } from "@auth0/angular-jwt";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;

  loggedUserId: any;

  registerMode: boolean = false;

  registerSubscription: Subscription | undefined;

  constructor(private accountService: AccountsService,
              private router: Router,
              private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }


  //!Login
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onLogIn() {
    const body = {
      "userName": this.loginForm.get('userName')?.value,
      "password": this.loginForm.get('password')?.value
    }
    this.accountService.logIn(body).subscribe({
      next: token => {
        if (token !== null) {
          const jwtToken = this.parseObject(token)
          localStorage.setItem('token', jwtToken);
          this.checkToken();
          const decodedToken = this.jwtHelper.decodeToken(jwtToken);
          this.loggedUserId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          localStorage.setItem('userId', this.loggedUserId);
          this.router.navigate(['/account/', this.loggedUserId], {relativeTo: null});
        }
      },
      error: err => {
        console.log('ERROR: ', err);
      }
    });
  }

  onLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.checkToken();
    this.router.navigate(['/home'])
  }
  //!/Login
  //!Register
  registerToggle(){
    this.registerMode = !this.registerMode;
  }

  passwordMatchingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  };

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2), Validators.required]),
    lastName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2), Validators.required]),
    userName: new FormControl('', [Validators.maxLength(50), Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}')]),
    password: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'), Validators.required]),
    confirmPassword: new FormControl('', [Validators.maxLength(50), Validators.minLength(6),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'), Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchingValidator });

  onRegister() {
    const body = {
      "FirstName": this.registerForm.get('firstName')?.value,
      "LastName": this.registerForm.get('lastName')?.value,
      "UserName": this.registerForm.get('userName')?.value,
      "Email": this.registerForm.get('email')?.value,
      "Password": this.registerForm.get('password')?.value,
      "PhoneNumber": this.registerForm.get('phoneNumber')?.value,
      "RoleId": "1"
    };

    this.registerSubscription = this.accountService.register(body).subscribe({
      next: data => {
        console.log('successful registration!');
        this.router.navigate(['/auth']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  //!/Register

  parseObject(obj: any)
  {
     for(var key in obj)
     {
        return obj[key];
     }
  }

  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe();
  }

}
