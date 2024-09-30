import {Component, OnInit} from '@angular/core';
import {PopupService} from "../../services/popup.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-consultation-popup',
  templateUrl: './consultation-popup.component.html',
  styleUrls: ['./consultation-popup.component.scss']
})
export class ConsultationPopupComponent implements OnInit {
  public isOpen: boolean = false;
  public popupForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
  })
  constructor(private popupService: PopupService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.popupService.popupState$.subscribe(
      state => this.isOpen = state,
    )
  }

  close() {
    this.popupService.closePopup();
  }

}
