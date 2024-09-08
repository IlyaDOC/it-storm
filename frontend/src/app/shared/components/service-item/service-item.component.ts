import {Component, Input, OnInit} from '@angular/core';
import {ServiceItemType} from "../../../../types/service-item.type";

@Component({
  selector: 'app-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.scss']
})
export class ServiceItemComponent implements OnInit {
  @Input() service!: ServiceItemType;
  @Input() index!: number;
  constructor() {
  }

  ngOnInit(): void {
  }



}
