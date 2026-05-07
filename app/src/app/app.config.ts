import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  MARKED_OPTIONS,
  MarkedOptions,
  provideMarkdown,
} from 'ngx-markdown';

import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { appRoutes } from 'app/app.routes';
import { TranslocoHttpLoader } from 'app/transloco-loader';

const supportedLanguages = ['en', 'de', 'hu'] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];

function getPreferredLanguage(): SupportedLanguage {
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  const preferredLanguage = browserLanguages
    .map((language) => language.split('-')[0])
    .find((language): language is SupportedLanguage =>
      supportedLanguages.includes(language as SupportedLanguage),
    );

  return preferredLanguage ?? 'en';
}

function markedOptionsFactory(): MarkedOptions {
  return {
    gfm: true,
    breaks: false,
    pedantic: false,
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),

    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'D',
        },
        display: {
          dateInput: 'DDD',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'DD',
          monthYearA11yLabel: 'LLLL yyyy',
        },
      },
    },

    provideTransloco({
      config: {
        availableLangs: [
          { id: 'en', label: 'English' },
          { id: 'de', label: 'Deutsch' },
          { id: 'hu', label: 'Magyar' },
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        missingHandler: {
          allowEmpty: true,
          useFallbackTranslation: false,
          logMissingKey: false,
        },
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),

    provideAppInitializer(() => {
      const translocoService = inject(TranslocoService);
      const preferredLanguage = getPreferredLanguage();

      translocoService.setActiveLang(preferredLanguage);

      return firstValueFrom(translocoService.load(preferredLanguage));
    }),

    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
      },
    }),
  ],
};
