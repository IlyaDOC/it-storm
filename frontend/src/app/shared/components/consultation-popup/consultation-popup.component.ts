import {Component, OnInit} from '@angular/core';
import {PopupService} from "../../services/popup.service";
import {FormBuilder, Validators,} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-consultation-popup',
  templateUrl: './consultation-popup.component.html',
  styleUrls: ['./consultation-popup.component.scss']
})
export class ConsultationPopupComponent implements OnInit {
  public isOpen: boolean = false;
  private userName: string = '';
  public isLogged: boolean = false;

  public popupForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
  })

  constructor(private popupService: PopupService,
              private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private userService: UserService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.popupService.popupConsultationState$.subscribe(
      state => this.isOpen = state,
    )

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
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
    this.popupService.closeConsultationPopup();
  }

  openSuccessPopup() {
    this.popupService.openSuccessPopup();
  }

  consultationRequest() {
    if (this.popupForm.value.name && this.popupForm.value.phone) {
      this.popupService.consultationRequest(this.popupForm.value.name, this.popupForm.value.phone)
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
