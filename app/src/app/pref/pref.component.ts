import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@jsverse/transloco';

import { ContactDialogComponent } from 'app/layout/contact-dialog/contact-dialog.component';
import { Subject } from 'rxjs';
import { PreferenceSection } from 'core/pref/pref.types';

@Component({
    selector: 'app-pref',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatProgressBarModule,
    ],
    templateUrl: './pref.component.html',
    styleUrl: './pref.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrefComponent implements OnInit, OnDestroy {
    isLoading = true;
    openSectionId: string | null = null;

    readonly sections: readonly PreferenceSection[] = [
        {
            id: 'salary',
            titleKey: 'pref.sal.title',
            itemKeys: [
                'pref.sal.items.1',
                'pref.sal.items.2',
                'pref.sal.items.3',
            ],
        },
        {
            id: 'environment',
            titleKey: 'pref.env.title',
            itemKeys: [
                'pref.env.items.1',
                'pref.env.items.2',
                'pref.env.items.3',
            ],
        },
        {
            id: 'location',
            titleKey: 'pref.loc.title',
            itemKeys: [
                'pref.loc.items.1',
                'pref.loc.items.2',
                'pref.loc.items.3',
            ],
        },
        {
            id: 'roles',
            titleKey: 'pref.role.title',
            itemKeys: [
                'pref.role.items.1',
                'pref.role.items.2',
                'pref.role.items.3',
            ],
        },
        {
            id: 'stack',
            titleKey: 'pref.stack.title',
            itemKeys: [
                'pref.stack.items.1',
                'pref.stack.items.2',
                'pref.stack.items.3',
            ],
        },
        {
            id: 'team',
            titleKey: 'pref.team.title',
            itemKeys: [
                'pref.team.items.1',
                'pref.team.items.2',
                'pref.team.items.3',
            ],
        },
        {
            id: 'availability',
            titleKey: 'pref.ava.title',
            itemKeys: [
                'pref.ava.items.1',
                'pref.ava.items.2',
                'pref.ava.items.3',
            ],
        },
        {
            id: 'benefits',
            titleKey: 'pref.bene.title',
            itemKeys: [
                'pref.bene.items.1',
                'pref.bene.items.2',
                'pref.bene.items.3',
            ],
        },
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private readonly dialog: MatDialog,
        private readonly _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.openSectionId = this.sections[0]?.id ?? null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        queueMicrotask(() => {
            this.isLoading = false;
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    toggleSection(sectionId: string): void {
        this.openSectionId = this.openSectionId === sectionId ? null : sectionId;
    }

    isSectionOpen(sectionId: string): boolean {
        return this.openSectionId === sectionId;
    }

    trackBySectionId(_: number, section: PreferenceSection): string {
        return section.id;
    }

    trackByItemKey(_: number, itemKey: string): string {
        return itemKey;
    }

    openContactDialog(): void {
        this.dialog.open(ContactDialogComponent, {
            width: '28rem',
            maxWidth: 'calc(100vw - 2rem)',
            autoFocus: false,
            restoreFocus: true,
        });
    }
}
