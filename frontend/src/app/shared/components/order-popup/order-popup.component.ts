import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PopupService} from "../../services/popup.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent implements OnInit {
  public isOpen: boolean = false;
  public popupForm = this.fb.group({
    service: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  })
  constructor(private fb: FormBuilder,
              private popupService: PopupService,
              private _snackBar: MatSnackBar,
              ) { }

  ngOnInit(): void {
    this.popupService.popupOrderState$.subscribe(state=> {
      this.isOpen = state;
    })
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
