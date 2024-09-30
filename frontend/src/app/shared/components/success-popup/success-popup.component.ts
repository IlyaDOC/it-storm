import { Component, OnInit } from '@angular/core';
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss']
})
export class SuccessPopupComponent implements OnInit {
  public isOpen: boolean = false;

  constructor(private popupService: PopupService) { }

  ngOnInit(): void {
    this.popupService.popupSuccessState$.subscribe(state=> {
      this.isOpen = state;
    })
  }

  close():void {
    this.popupService.closeSuccessPopup();
  }

}
