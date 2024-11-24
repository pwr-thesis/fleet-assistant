import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { HIDE_CHAT_ROUTES } from '../_constants';

@Injectable({
    providedIn: 'root',
})
export class ChatDisplayService {
    private showChatSubject = new BehaviorSubject<boolean>(true);
    showChat$ = this.showChatSubject.asObservable();

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const shouldShowChat = HIDE_CHAT_ROUTES.some((route) =>
                    this.router.url.includes(route)
                );
                this.showChatSubject.next(shouldShowChat);
            });
    }
}
