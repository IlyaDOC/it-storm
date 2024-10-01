import {Component, Input, OnInit} from '@angular/core';
import {ServiceItemType} from "../../../../types/service-item.type";
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.scss']
})
export class ServiceItemComponent implements OnInit {
  @Input() service: ServiceItemType;
  @Input() index: number = 0;
  constructor(private popupService: PopupService) {
    this.service = {
      title: '',
      description: '',
      price: 0
    }
  }

  ngOnInit(): void {
  }

  open() {
    this.popupService.openOrderPopup();
  }

  setServiceTitle(title: string) {
    this.popupService.setServiceName(title);
  }
}
