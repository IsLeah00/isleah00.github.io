import { CommonModule, DOCUMENT } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    HostListener,
    Inject,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
} from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { filter, Subject } from 'rxjs';
import { ContactDialogComponent } from 'app/layout/contact-dialog/contact-dialog.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageOption, NavItem } from 'core/layout/layout.types';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatIconModule,
        MatDialogModule,
        TranslocoModule,
        MatButtonModule,
        MatMenuModule
    ],
})
export class LayoutComponent implements OnInit, OnDestroy {
    isMobileMenuOpen = false;
    isScreenSmall = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    navigation: NavItem[] = [];

    languages: LanguageOption[] = [
        { code: 'en', label: 'EN' },
        { code: 'de', label: 'DE' },
        { code: 'hu', label: 'HU' },
    ];

    activeLanguage = 'en';

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private readonly _router: Router,
        private readonly _renderer2: Renderer2,
        private readonly _dialog: MatDialog,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _transloco: TranslocoService
    ) {}

    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._loadLang();
        this._checkScreenSize();

        this._router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.isMobileMenuOpen = false;
            });

        this._renderer2.addClass(this._document.body, 'light');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    switchLanguage(language: string): void {
        if (this._transloco.getActiveLang() === language) {
            return;
        }

        localStorage.setItem('app-language', language);
        this._transloco.setActiveLang(language);
    }

    @HostListener('window:resize')
    onResize(): void {
        this._checkScreenSize();
    }

    toggleMobileMenu(): void {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMobileMenu(): void {
        this.isMobileMenuOpen = false;
    }

    openContactDialog(): void {
        this.closeMobileMenu();

        this._dialog.open(ContactDialogComponent, {
            width: '420px',
            maxWidth: 'calc(100vw - 2rem)',
            autoFocus: false,
            restoreFocus: true,
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _checkScreenSize(): void {
        this.isScreenSmall = window.innerWidth < 960;
        if (!this.isScreenSmall) {
            this.isMobileMenuOpen = false;
        }
    }

    private _loadLang(): void {
        this.activeLanguage = this._transloco.getActiveLang();

        this._transloco.langChanges$.subscribe((lang) => {
            this.activeLanguage = lang;
            this._changeDetectorRef.markForCheck();
        });
    }
}
