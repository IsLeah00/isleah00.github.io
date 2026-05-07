import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-preview-dialog',
    templateUrl: './preview-dialog.component.html',
    styleUrl: './preview-dialog.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        TranslocoModule,
        MatTooltipModule
    ],
})
export class PreviewDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            imageUrl: string;
            issuer: string;
            date: string;
            credentialUrl?: string;
            credentialCode?: string;
            credentialLabel?: string;
            isOnline?: boolean;
        },
    ) {}
}
