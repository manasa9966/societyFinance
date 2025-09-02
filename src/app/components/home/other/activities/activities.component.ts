import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSettingsModel, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';
import { SharedService } from '../../../../services/shared.service';
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  ResizeService,
  DragAndDropService,
} from "@syncfusion/ej2-angular-schedule";

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    ResizeService,
    DragAndDropService
  ]
})
export class ActivitiesComponent implements OnInit {
  @ViewChild('schedule') scheduleObj!: ScheduleComponent;

  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel = {
    dataSource: [
      {
        Id: 1,
        Subject: "Testing Event",
        StartTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 16, 0),
        EndTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 17, 0),
        RecurrenceRule: "FREQ=WEEKLY;BYDAY=FR;INTERVAL=1;",
        RecurrenceException: "20201106T130000Z"
      }
    ]
  };

  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.getEvents().subscribe(events => {
      this.eventSettings = { dataSource: events };
    });
  }

  onPopupOpen(args: { data: Date | undefined; }) {
    console.log("popUp args", args.data);
    console.log("getEvent result", this.scheduleObj.getEvents(args.data));
  }


  onActionBegin(args: any): void {
    if (args.requestType === 'eventCreate') {
      const newEvent = args.data[0];
      this.sharedService.addEvent({
        ...newEvent,
        StartTime: newEvent.StartTime.toISOString(),
        EndTime: newEvent.EndTime.toISOString()
      });
    }
    if (args.requestType === 'eventChange') {
      const updatedEvent = args.data;
      this.sharedService.updateEvent(updatedEvent.Id, {
        ...updatedEvent,
        StartTime: updatedEvent.StartTime.toISOString(),
        EndTime: updatedEvent.EndTime.toISOString()
      });
    }
    if (args.requestType === 'eventRemove') {
      const deletedEvent = args.data[0];
      this.sharedService.deleteEvent(deletedEvent.Id);
    }
  }

}
