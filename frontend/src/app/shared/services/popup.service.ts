import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  // Управление состоянием попапа с заявкой на консультацию
  private popupConsultationSubject = new Subject<boolean>();
  public popupConsultationState$ = this.popupConsultationSubject.asObservable();

  // Управление состоянием попапа с успешной отправкой заявки
  private popupSuccessSubject = new Subject<boolean>();
  public popupSuccessState$ = this.popupSuccessSubject.asObservable();


  // Управление состоянием попапа заявки на услугу
  private popupOrderSubject = new Subject<boolean>();
  public popupOrderState$ = this.popupOrderSubject.asObservable();

  // Subject для хранения вида услуги для последующей передачи в select, чтобы поставить выбор по дэфолту
  private serviceSubject = new Subject<string>();
  public serviceSubject$ = this.serviceSubject.asObservable();

  constructor(private http: HttpClient) { }

  openConsultationPopup() {
    this.popupConsultationSubject.next(true);
  }

  closeConsultationPopup() {
    this.popupConsultationSubject.next(false);
  }

  openSuccessPopup() {
    this.popupSuccessSubject.next(true);
  }

  closeSuccessPopup() {
    this.popupSuccessSubject.next(false);
  }

  openOrderPopup() {
    this.popupOrderSubject.next(true);
  }

  closeOrderPopup() {
    this.popupOrderSubject.next(false);
  }

  setServiceName(serviceName: string) {
    this.serviceSubject.next(serviceName);
  }

  consultationRequest(name: string, phone: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name: name,
      phone: phone,
      type: 'consultation'
    })
  }

  orderRequest(name: string, phone: string, service: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name: name,
      phone: phone,
      service: service,
      type: 'order'
    })
  }
}
