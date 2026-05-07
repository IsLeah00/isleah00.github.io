import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactDialogComponent } from 'app/layout/contact-dialog/contact-dialog.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectComponent } from 'app/home/project/project.component';
import { JourneyItem, ProfileDetail, SocialLink } from 'core/home/home.types';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MatDialogModule,
        MatProgressBarModule,
        MatIconModule,
        ProjectComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    profileDetails: ProfileDetail[] = [
        {
            key: 'citizenship',
            labelKey: 'home.profile.1.label',
            valueKey: 'home.profile.1.value'
        },
        {
            key: 'birthDate',
            labelKey: 'home.profile.2.label',
            valueKey: 'home.profile.2.value'
        },
        {
            key: 'location',
            labelKey: 'home.profile.3.label',
            valueKey: 'home.profile.3.value'
        }
    ];

    socialLinks: SocialLink[] = [
        {
            key: 'github',
            labelKey: 'home.profile.links.1.label',
            ariaLabelKey: 'home.profile.links.1.arialabel',
            iconPath: 'icons/github.svg',
            href: 'https://github.com/IsLeah00',
            target: '_blank',
            rel: 'noopener noreferrer',
            type: 'external'
        },
        {
            key: 'gmail',
            labelKey: 'home.profile.links.2.label',
            ariaLabelKey: 'home.profile.links.2.arialabel',
            iconPath: 'icons/gmail.svg',
            href: null,
            target: null,
            rel: null,
            type: 'dialog'
        },
        {
            key: 'linkedin',
            labelKey: 'home.profile.links.3.label',
            ariaLabelKey: 'home.profile.links.3.arialabel',
            iconPath: 'icons/linkedin.svg',
            href: 'https://www.linkedin.com/in/korn%C3%A9lia-mezei-632147409/',
            target: '_blank',
            rel: 'noopener noreferrer',
            type: 'external'
        }
    ];

    mergedTimelineItems: JourneyItem[] = [
        {
            key: '1',
            side: 'left',
            timeKey: 'home.timeline.1.time',
            roleKey: null,
            titleKey: 'home.timeline.1.title',
            descKey: 'home.timeline.1.desc'
        },
        {
            key: '2',
            side: 'right',
            timeKey: 'home.timeline.2.time',
            roleKey: 'home.timeline.2.role',
            titleKey: 'home.timeline.2.title',
            descKey: 'home.timeline.2.desc'
        },
        {
            key: '3',
            side: 'right',
            timeKey: 'home.timeline.3.time',
            roleKey: 'home.timeline.3.role',
            titleKey: 'home.timeline.3.title',
            descKey: 'home.timeline.3.desc'
        },
        {
            key: '4',
            side: 'left',
            timeKey: 'home.timeline.4.time',
            roleKey: 'home.timeline.4.role',
            titleKey: 'home.timeline.4.title',
            descKey: 'home.timeline.4.desc'
        },
        {
            key: '5',
            side: 'left',
            timeKey: 'home.timeline.5.time',
            roleKey: 'home.timeline.5.role',
            titleKey: 'home.timeline.5.title',
            descKey: 'home.timeline.5.desc'
        },
        {
            key: '6',
            side: 'left',
            timeKey: 'home.timeline.6.time',
            roleKey: null,
            titleKey: 'home.timeline.6.title',
            descKey: 'home.timeline.6.desc'
        },
        {
            key: '7',
            side: 'right',
            timeKey: 'home.timeline.7.time',
            roleKey: 'home.timeline.7.role',
            titleKey: 'home.timeline.7.title',
            descKey: 'home.timeline.7.desc'
        },
        {
            key: '8',
            side: 'right',
            timeKey: 'home.timeline.8.time',
            roleKey: 'home.timeline.8.role',
            titleKey: null,
            descKey: 'home.timeline.8.desc'
        },
        {
            key: '9',
            side: 'left',
            timeKey: 'home.timeline.9.time',
            roleKey: 'home.timeline.9.role',
            titleKey: null,
            descKey: 'home.timeline.9.desc'
        }
    ];

    educationTimelineItems: JourneyItem[] = this.mergedTimelineItems.filter(
        (item) => item.side === 'left'
    );

    careerTimelineItems: JourneyItem[] = this.mergedTimelineItems.filter(
        (item) => item.side === 'right'
    );

    private expandedTimelineItemKeys: string[] = [];

    isLoading = true;

    private readonly _profileImageCount = 2;
    private _loadedProfileImages = 0;

    constructor(
        private readonly _dialog: MatDialog,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    onProfileImageLoad(): void {
        if (this._loadedProfileImages >= this._profileImageCount) {
            return;
        }

        this._loadedProfileImages += 1;

        if (this._loadedProfileImages === this._profileImageCount) {
            this.isLoading = false;
            this._changeDetectorRef.markForCheck();
        }
    }

    openSocialLink(socialLink: SocialLink): void {
        if (socialLink.type === 'dialog') {
            this._openContactDialog();
        }
    }

    isTimelineItemExpanded(key: string): boolean {
        return this.expandedTimelineItemKeys.includes(key);
    }

    toggleTimelineItem(key: string): void {
        if (this.isTimelineItemExpanded(key)) {
            this.expandedTimelineItemKeys = this.expandedTimelineItemKeys.filter(
                (itemKey) => itemKey !== key
            );
            return;
        }

        this.expandedTimelineItemKeys = [
            ...this.expandedTimelineItemKeys,
            key
        ];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _openContactDialog(): void {
        this._dialog.open(ContactDialogComponent, {
            width: '420px',
            maxWidth: 'calc(100vw - 2rem)',
            autoFocus: false,
            restoreFocus: true
        });
    }
}
