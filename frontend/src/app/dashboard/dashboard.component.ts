import { 
  Component, 
  HostListener, 
  ChangeDetectorRef, 
  DestroyRef, 
  OnInit 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from './service/notifications.service';
import { NotificationSendComponent } from "./components/notification-send/notification-send.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NotificationSendComponent
],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef, 
    private destroyRef: DestroyRef, 
    private notificationService: NotificationService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifications: any[] = []; 

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService
      .getUserNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.notifications = response.content.map((notification: any) => {
          if (notification.createdOn) {
            const [year, month, day] = notification.createdOn;
            notification.createdOn = new Date(year, month - 1, day);
          }
          return {
            ...notification,
            expanded: false,
            showMore: false,
          };
        });

        setTimeout(() => {
          this.checkTextHeight();
          this.cdr.detectChanges(); 
        }, 0);
      });
  }
  
  checkTextHeight(): void {
    this.notifications.forEach((notification, index) => {
      const element = document.querySelectorAll('.message-text')[index] as HTMLElement;
      if (element) {
        const isOverflowing = element.scrollHeight > 40;
        notification.showMore = isOverflowing;
      } 
    });
  }

  toggleMessage(index: number): void {
    if (this.notifications[index]) {
      this.notifications[index].expanded = !this.notifications[index].expanded;
    } 
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkTextHeight();
    this.cdr.detectChanges();
  }
}
