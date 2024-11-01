import { Component, DestroyRef, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './common/components/header/header.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { NgIf } from '@angular/common';
import { NavbarService } from '../utilities/services/navbar.service';
import { SidenavComponent } from './common/components/sidenav/sidenav.component';
import { BottomNavComponent } from './common/components/bottom-nav/bottom-nav.component';
import { environment } from '../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent,
        WelcomePageComponent,
        FooterComponent,
        NgIf,
        SidenavComponent,
        BottomNavComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    showNavbar = true;

    constructor(
        private destroyRef: DestroyRef,
        private navbarService: NavbarService,
        private renderer: Renderer2
    ) {
        this.navbarService.showNavbar$
            .pipe(takeUntilDestroyed(destroyRef))
            .subscribe((show) => {
                this.showNavbar = show;
            });
    }

    ngOnInit(): void {
        this.addGoogleMapsScript();
    }

    addGoogleMapsScript(): void {
        const apiKey = environment.googleApiKey;

        const scriptContent = `(g => {
      var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
      b = b[c] || (b[c] = {}); 
      var d = b.maps || (b.maps = {}), 
      r = new Set, e = new URLSearchParams, 
      u = () => h || (h = new Promise(async(f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + ""); 
        for (k in g) 
          e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); 
        e.set("callback", c + ".maps." + q); 
        a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e; 
        d[q] = f; 
        a.onerror = () => h = n(Error(p + " could not load.")); 
        a.nonce = m.querySelector("script[nonce]")?.nonce || ""; 
        m.head.append(a)
      })); 
      d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })({
      key: '${apiKey}',
    });`;

        const scriptElement = this.renderer.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.text = scriptContent;
        this.renderer.appendChild(document.body, scriptElement);
    }
}
