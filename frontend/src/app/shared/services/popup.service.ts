import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupSubject = new Subject<boolean>();
  public popupState$ = this.popupSubject.asObservable();
  constructor() { }

  openPopup() {
    this.popupSubject.next(true);
  }

  closePopup() {
    this.popupSubject.next(false);
  }
}
