import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PopupService} from "../../services/popup.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent implements OnInit {
  public isOpen: boolean = false;
  private userName: string = '';
  public popupForm = this.fb.group({
    service: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  })
  public serviceMatch: boolean = false;
  public selectedService: string = '';
  public isLogged: boolean = false;

  constructor(private fb: FormBuilder,
              private popupService: PopupService,
              private _snackBar: MatSnackBar,
              private authService: AuthService,
              private userService: UserService
  ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.popupService.popupOrderState$.subscribe(state => {
      this.isOpen = state;
    });

    this.popupService.serviceSubject$.subscribe(service => {
      this.selectedService = service;
      this.popupForm.patchValue({service: this.selectedService});
    })

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.authService.userName$.subscribe((userName: string) => {
      this.userName = userName;
    });

    if (this.isLogged) {
      this.userService.getUserInfo()
        .subscribe({
          next: (data: UserInfoType | DefaultResponseType) => {
            this.userName = (data as UserInfoType).name;
            this.popupForm.patchValue({name: this.userName});
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка получения имени');
            }
          }
        })
    }

  }

  close() {
    this.popupService.closeOrderPopup();
  }

  openSuccessPopup() {
    this.popupService.openSuccessPopup();
  }

  orderRequest() {
    if (this.popupForm.value.service && this.popupForm.value.name && this.popupForm.value.phone) {
      this.popupService.orderRequest(this.popupForm.value.name, this.popupForm.value.phone, this.popupForm.value.service)
        .subscribe({
          next: (data: DefaultResponseType) => {
            let error = null;
            if (data.error !== undefined && data.error) {
              error = data.message;
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this._snackBar.open(data.message);
            this.close();
            this.openSuccessPopup();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки запроса');
            }
          }
        })
    }
  }
}
