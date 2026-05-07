import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslocoModule
    ],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
})
export class ErrorComponent implements OnInit, OnDestroy {
    @Input() title?: string;
    @Input() subtitle?: string;
    @Input() buttonLabel?: string;
    @Input() buttonLink = '/home';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _transloco: TranslocoService
    ) {}

    get resolvedTitle(): string {
        return this.title || this._transloco.translate('error.title');
    }

    get resolvedSubtitle(): string {
        return this.subtitle || this._transloco.translate('error.subtitle');
    }

    get resolvedButtonLabel(): string {
        return this.buttonLabel || this._transloco.translate('error.buttonLabel');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._transloco.langChanges$.subscribe(() => {
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
