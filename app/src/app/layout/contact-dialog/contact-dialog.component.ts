import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-contact-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        TranslocoModule
    ],
    templateUrl: './contact-dialog.component.html',
})
export class ContactDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<ContactDialogComponent>);
    readonly data = inject(MAT_DIALOG_DATA, { optional: true });

    private readonly email = 'mezei.lia2000@gmail.com';

    sendMail(): void {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.email}`;
        window.open(gmailUrl, '_blank');
    }
}
