import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { ChartSegment, ChartSegmentInput, GitHubContributionsApiResponse, GitHubContributionYear, GitHubStats, ProjectChart, ProjectGroupKey, ShowcaseProject } from 'core/home/project.types';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-project',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MatIcon,
        MatIconModule,
    ],
    templateUrl: './project.component.html',
    styleUrl: './project.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit, OnDestroy {
    charts: ProjectChart[] = [
        this._createChart(
            'languages',
            'home.projects.languages.title',
            'home.projects.languages.center',
            '%',
            [
                { labelKey: 'home.projects.label.python', value: 24, color: '#5480b6' },
                { labelKey: 'home.projects.label.typescript', value: 22, color: '#8daace' },
                { labelKey: 'home.projects.label.javascript', value: 13, color: '#a9bfda' },
                { labelKey: 'home.projects.label.java', value: 11, color: '#436c9d' },
                { labelKey: 'home.projects.label.c++', value: 9, color: '#c6d5e7' },
                { labelKey: 'home.projects.label.c#', value: 8, color: '#375881' },
                { labelKey: 'home.projects.label.sql', value: 7, color: '#2b4564' },
                { labelKey: 'home.projects.label.other', value: 6, color: '#e2eaf3' }
            ]
        ),
        this._createChart(
            'technologies',
            'home.projects.technologies.title',
            'home.projects.technologies.center',
            '%',
            [
                { labelKey: 'home.projects.label.angular', value: 20, color: '#5480b6' },
                { labelKey: 'home.projects.label.flask', value: 18, color: '#8daace' },
                { labelKey: 'home.projects.label.docker', value: 14, color: '#a9bfda' },
                { labelKey: 'home.projects.label.databases', value: 13, color: '#436c9d' },
                { labelKey: 'home.projects.label.security', value: 12, color: '#c6d5e7' },
                { labelKey: 'home.projects.label.cicd', value: 10, color: '#375881' },
                { labelKey: 'home.projects.label.unity', value: 7, color: '#2b4564' },
                { labelKey: 'home.projects.label.monitoring', value: 6, color: '#e2eaf3' }
            ]
        ),
        this._createChart(
            'github',
            'home.projects.github.title',
            'home.projects.github.center',
            '',
            [
                { labelKey: 'home.projects.label.2020', value: 0, color: '#a9bfda' },
                { labelKey: 'home.projects.label.2021', value: 0, color: '#8daace' },
                { labelKey: 'home.projects.label.2022', value: 0, color: '#5480b6' },
                { labelKey: 'home.projects.label.2023', value: 0, color: '#436c9d' },
                { labelKey: 'home.projects.label.2024', value: 0, color: '#375881' },
                { labelKey: 'home.projects.label.2025', value: 0, color: '#2b4564' },
                { labelKey: 'home.projects.label.2026', value: 0, color: '#1f334a' }
            ],
            true
        )
    ];

    private readonly _githubUsername = 'isleah00';
    private readonly _githubContributionStartYear = 2020;
    private readonly _githubContributionsApiUrl = 'https://github-contributions-api.deno.dev';

    homeProjects: ShowcaseProject[] = [
        {
            key: 'cashmira',
            titleKey: 'home.projects.showcase.home.cashmira.title',
            descriptionKey: 'home.projects.showcase.home.cashmira.description',
            dateKey: 'home.projects.showcase.home.cashmira.date',
            codeUrl: 'https://github.com/IsLeah00/Cashmira-NetBank-App',
            tagKeys: [
                'home.projects.showcase.tags.fullStackBanking',
                'home.projects.showcase.tags.angular17',
                'home.projects.showcase.tags.angularMaterial',
                'home.projects.showcase.tags.node',
                'home.projects.showcase.tags.express',
                'home.projects.showcase.tags.mongodb',
                'home.projects.showcase.tags.yarn',
                'home.projects.showcase.tags.jwtAdmin',
                'home.projects.showcase.tags.cardTransactions'
            ],
            images: Array.from({ length: 11 }, (_, index) => `images/projects/home/cashmira/cashmira${index + 1}.png`)
        },
        {
            key: 'hangman',
            titleKey: 'home.projects.showcase.home.hangman.title',
            descriptionKey: 'home.projects.showcase.home.hangman.description',
            dateKey: 'home.projects.showcase.home.hangman.date',
            codeUrl: 'https://github.com/IsLeah00/Hangman-plus',
            tagKeys: [
                'home.projects.showcase.tags.terminalDevops',
                'home.projects.showcase.tags.cmakeCtest',
                'home.projects.showcase.tags.cpp17',
                'home.projects.showcase.tags.sqlite3',
                'home.projects.showcase.tags.docker',
                'home.projects.showcase.tags.prometheusGrafana',
                'home.projects.showcase.tags.circleci',
                'home.projects.showcase.tags.ansible',
                'home.projects.showcase.tags.nginx'
            ],
            images: Array.from({ length: 8 }, (_, index) => `images/projects/home/hangman/hangman${index + 1}.png`)
        },
        {
            key: 'qme',
            titleKey: 'home.projects.showcase.home.qme.title',
            descriptionKey: 'home.projects.showcase.home.qme.description',
            dateKey: 'home.projects.showcase.home.qme.date',
            codeUrl: 'https://github.com/IsLeah00/Q-Me-Quiz-App',
            tagKeys: [
                'home.projects.showcase.tags.gamifiedLearning',
                'home.projects.showcase.tags.python3',
                'home.projects.showcase.tags.flask',
                'home.projects.showcase.tags.mysql',
                'home.projects.showcase.tags.javascript',
                'home.projects.showcase.tags.jwtStats',
                'home.projects.showcase.tags.ugcModeration'
            ],
            images: Array.from({ length: 9 }, (_, index) => `images/projects/home/qme/qme${index + 1}.png`)
        },
        {
            key: 'galaxy',
            titleKey: 'home.projects.showcase.home.galaxy.title',
            descriptionKey: 'home.projects.showcase.home.galaxy.description',
            dateKey: 'home.projects.showcase.home.galaxy.date',
            codeUrl: 'https://github.com/IsLeah00/Galaxy-Dungeon-App',
            tagKeys: [
                'home.projects.showcase.tags.dungeonCrawler',
                'home.projects.showcase.tags.unity',
                'home.projects.showcase.tags.csharp',
                'home.projects.showcase.tags.combatProgression',
                'home.projects.showcase.tags.coopSingle'
            ],
            images: Array.from({ length: 5 }, (_, index) => `images/projects/home/galaxy/galaxy${index + 1}.png`)
        },
        {
            key: 'pebble',
            titleKey: 'home.projects.showcase.home.pebble.title',
            descriptionKey: 'home.projects.showcase.home.pebble.description',
            dateKey: 'home.projects.showcase.home.pebble.date',
            codeUrl: 'https://github.com/IsLeah00/Pebble-Mini-Game',
            tagKeys: [
                'home.projects.showcase.tags.boardGame',
                'home.projects.showcase.tags.java',
                'home.projects.showcase.tags.javafx',
                'home.projects.showcase.tags.jdom',
                'home.projects.showcase.tags.mvc',
                'home.projects.showcase.tags.xml',
                'home.projects.showcase.tags.unitTesting'
            ],
            images: Array.from({ length: 4 }, (_, index) => `images/projects/home/pebble/pebble${index + 1}.png`)
        }
    ];

    workProjects: ShowcaseProject[] = [
        {
            key: 'vanta',
            titleKey: 'home.projects.showcase.work.vanta.title',
            descriptionKey: 'home.projects.showcase.work.vanta.description',
            tagKeys: [
                'home.projects.showcase.tags.oauth',
                'home.projects.showcase.tags.python',
                'home.projects.showcase.tags.flask',
                'home.projects.showcase.tags.celery',
                'home.projects.showcase.tags.encryption',
                'home.projects.showcase.tags.apiIntegration',
                'home.projects.showcase.tags.architecture'
            ],
            images: ['images/projects/work/vanta.png']
        },
        {
            key: 'frontend',
            titleKey: 'home.projects.showcase.work.frontend.title',
            descriptionKey: 'home.projects.showcase.work.frontend.description',
            tagKeys: [
                'home.projects.showcase.tags.angular',
                'home.projects.showcase.tags.typescript',
                'home.projects.showcase.tags.fuse',
                'home.projects.showcase.tags.rbac',
                'home.projects.showcase.tags.analytics',
                'home.projects.showcase.tags.ux',
                'home.projects.showcase.tags.i18n'
            ],
            images: ['images/projects/work/frontend.png']
        },
        {
            key: 'backend',
            titleKey: 'home.projects.showcase.work.backend.title',
            descriptionKey: 'home.projects.showcase.work.backend.description',
            tagKeys: [
                'home.projects.showcase.tags.python',
                'home.projects.showcase.tags.flask',
                'home.projects.showcase.tags.restApi',
                'home.projects.showcase.tags.openApi',
                'home.projects.showcase.tags.analytics',
                'home.projects.showcase.tags.validation',
                'home.projects.showcase.tags.architecture'
            ],
            images: ['images/projects/work/backend.png']
        },
        {
            key: 'framework',
            titleKey: 'home.projects.showcase.work.framework.title',
            descriptionKey: 'home.projects.showcase.work.framework.description',
            tagKeys: [
                'home.projects.showcase.tags.python',
                'home.projects.showcase.tags.yaml',
                'home.projects.showcase.tags.eventSystems',
                'home.projects.showcase.tags.refactoring',
                'home.projects.showcase.tags.platformEngineering',
                'home.projects.showcase.tags.devops'
            ],
            images: ['images/projects/work/framework.png']
        },
        {
            key: 'mentorship',
            titleKey: 'home.projects.showcase.work.mentorship.title',
            descriptionKey: 'home.projects.showcase.work.mentorship.description',
            tagKeys: [
                'home.projects.showcase.tags.mentoring',
                'home.projects.showcase.tags.codeReview',
                'home.projects.showcase.tags.leadership',
                'home.projects.showcase.tags.qa',
                'home.projects.showcase.tags.collaboration'
            ],
            images: ['images/projects/work/mentorship.png']
        },
        {
            key: 'infra',
            titleKey: 'home.projects.showcase.work.infra.title',
            descriptionKey: 'home.projects.showcase.work.infra.description',
            tagKeys: [
                'home.projects.showcase.tags.kubernetes',
                'home.projects.showcase.tags.containers',
                'home.projects.showcase.tags.scaling',
                'home.projects.showcase.tags.performance',
                'home.projects.showcase.tags.reliability'
            ],
            images: ['images/projects/work/infra.png']
        },
        {
            key: 'protobuf',
            titleKey: 'home.projects.showcase.work.protobuf.title',
            descriptionKey: 'home.projects.showcase.work.protobuf.description',
            tagKeys: [
                'home.projects.showcase.tags.protobuf',
                'home.projects.showcase.tags.contracts',
                'home.projects.showcase.tags.microservices',
                'home.projects.showcase.tags.backwardCompatibility'
            ],
            images: ['images/projects/work/protobuf.png']
        }
    ];

    selectedHomeProjectIndex = 0;
    selectedWorkProjectIndex = 0;
    selectedHomeImageIndex = 0;
    selectedWorkImageIndex = 0;
    selectedChartSegments: Record<string, ChartSegment | null> = {};
    isImagePreviewOpen = false;
    previewImageAlt = '';
    previewImages: string[] = [];
    previewImageIndex = 0;
    previewImageSwipeOffset = 0;
    previewImageSwipeTransition = '';

    private readonly _previewSwipeThreshold = 50;
    private _previewTouchStartX = 0;
    private _previewTouchStartY = 0;

    constructor(
        private readonly _httpClient: HttpClient,
        private readonly _changeDetectorRef: ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        void this._loadGithubStats();
    }

    ngOnDestroy(): void {
        window.removeEventListener(
            'keydown',
            this._handlePreviewKeyboardNavigation
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get selectedHomeProject(): ShowcaseProject {
        return this.homeProjects[this.selectedHomeProjectIndex];
    }

    get selectedWorkProject(): ShowcaseProject {
        return this.workProjects[this.selectedWorkProjectIndex];
    }

    get selectedHomeImage(): string {
        return this.selectedHomeProject.images[this.selectedHomeImageIndex];
    }

    get selectedWorkImage(): string {
        return this.selectedWorkProject.images[this.selectedWorkImageIndex];
    }

    get previewImageSrc(): string {
        return this.previewImages[this.previewImageIndex] ?? '';
    }

    get hasMultiplePreviewImages(): boolean {
        return this.previewImages.length > 1;
    }

    get previousPreviewImageSrc(): string {
        return this.previewImages[
            (this.previewImageIndex - 1 + this.previewImages.length) % this.previewImages.length
        ] ?? '';
    }

    get nextPreviewImageSrc(): string {
        return this.previewImages[
            (this.previewImageIndex + 1) % this.previewImages.length
        ] ?? '';
    }

    get previewImageTrackTransform(): string {
        return `translateX(calc(-100% + ${this.previewImageSwipeOffset}px))`;
    }

    selectProject(group: ProjectGroupKey, index: number): void {
        if (group === 'home') {
            this.selectedHomeProjectIndex = index;
            this.selectedHomeImageIndex = 0;
            return;
        }

        this.selectedWorkProjectIndex = index;
        this.selectedWorkImageIndex = 0;
    }

    showPreviousImage(group: ProjectGroupKey): void {
        this._updateImageIndex(group, -1);
    }

    showNextImage(group: ProjectGroupKey): void {
        this._updateImageIndex(group, 1);
    }

    showPreviousPreviewImage(): void {
        this._updatePreviewImageIndex(-1);
    }

    showNextPreviewImage(): void {
        this._updatePreviewImageIndex(1);
    }

    closeImagePreview(): void {
        this.isImagePreviewOpen = false;
        this.previewImages = [];
        this.previewImageIndex = 0;
        this.previewImageAlt = '';
        this.previewImageSwipeOffset = 0;
        this.previewImageSwipeTransition = '';

        document.body.style.overflow = '';

        window.removeEventListener(
            'keydown',
            this._handlePreviewKeyboardNavigation
        );
    }

    openImagePreview(images: string[], imageIndex: number, imageAlt: string): void {
        this.previewImages = images;
        this.previewImageIndex = imageIndex;
        this.previewImageAlt = imageAlt;
        this.isImagePreviewOpen = true;

        document.body.style.overflow = 'hidden';

        window.removeEventListener(
            'keydown',
            this._handlePreviewKeyboardNavigation
        );

        window.addEventListener(
            'keydown',
            this._handlePreviewKeyboardNavigation
        );
    }

    onPreviewTouchStart(event: TouchEvent): void {
        if (!this.hasMultiplePreviewImages) {
            return;
        }

        const touch = event.touches[0];

        this._previewTouchStartX = touch.clientX;
        this._previewTouchStartY = touch.clientY;
        this.previewImageSwipeOffset = 0;
        this.previewImageSwipeTransition = 'none';
    }

    onPreviewTouchEnd(): void {
        if (!this.hasMultiplePreviewImages) {
            return;
        }

        const horizontalDistance = this.previewImageSwipeOffset;

        this.previewImageSwipeTransition = 'transform 0.22s ease';

        if (Math.abs(horizontalDistance) < this._previewSwipeThreshold) {
            this.previewImageSwipeOffset = 0;
            this._changeDetectorRef.markForCheck();
            return;
        }

        if (horizontalDistance > 0) {
            this.previewImageSwipeOffset = window.innerWidth;

            window.setTimeout(() => {
                this._updatePreviewImageIndex(-1);
                this._resetPreviewSwipe();
            }, 220);

            return;
        }

        this.previewImageSwipeOffset = -window.innerWidth;

        window.setTimeout(() => {
            this._updatePreviewImageIndex(1);
            this._resetPreviewSwipe();
        }, 220);
    }

    onPreviewTouchMove(event: TouchEvent): void {
        if (!this.hasMultiplePreviewImages) {
            return;
        }

        const touch = event.touches[0];
        const horizontalDistance = touch.clientX - this._previewTouchStartX;
        const verticalDistance = touch.clientY - this._previewTouchStartY;

        if (Math.abs(horizontalDistance) < Math.abs(verticalDistance)) {
            return;
        }

        event.preventDefault();

        this.previewImageSwipeOffset = horizontalDistance;
        this.previewImageSwipeTransition = 'none';

        this._changeDetectorRef.markForCheck();
    }

    selectChartSegment(chartKey: string, segment: ChartSegment): void {
        this.selectedChartSegments = {
            ...this.selectedChartSegments,
            [chartKey]: segment
        };
    }

    clearSelectedChartSegment(chartKey: string): void {
        this.selectedChartSegments = {
            ...this.selectedChartSegments,
            [chartKey]: null
        };
    }

    getChartCenterValue(chart: ProjectChart): string {
        const selectedSegment = this.selectedChartSegments[chart.key];

        if (!selectedSegment) {
            return chart.totalLabel;
        }

        return `${this._getSegmentPercentage(chart, selectedSegment)}%`;
    }

    getChartCenterLabel(
        chart: ProjectChart,
        translate: (key: string) => string
    ): string {
        const selectedSegment = this.selectedChartSegments[chart.key];

        if (!selectedSegment) {
            return translate(chart.centerLabelKey);
        }

        return translate(selectedSegment.labelKey);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private async _loadGithubStats(): Promise<void> {
        const stats = await this._fetchGithubStats();

        this._updateGithubChart(stats);
        this._changeDetectorRef.markForCheck();
    }

    private async _fetchGithubStats(): Promise<GitHubStats> {
        const currentYear = new Date().getFullYear();
        const yearRanges = Array.from(
            { length: currentYear - this._githubContributionStartYear + 1 },
            (_, index) => this._githubContributionStartYear + index
        );

        const contributionsByYear = await Promise.all(
            yearRanges.map((year) => this._fetchGithubContributionYear(year))
        );

        return {
            contributionsByYear,
            contributions: this._sumGithubContributions(contributionsByYear)
        };
    }

    private async _fetchGithubContributionYear(year: number): Promise<GitHubContributionYear> {
        const today = new Date();
        const currentYear = today.getFullYear();

        const from = `${year}-01-01`;
        const to = year === currentYear
            ? this._formatDate(today)
            : `${year}-12-31`;

        const response = await firstValueFrom(
            this._httpClient.get<GitHubContributionsApiResponse>(
                `${this._githubContributionsApiUrl}/${this._githubUsername}.json`,
                {
                    params: {
                        from,
                        to
                    }
                }
            )
        );

        return {
            year,
            contributions: Number(response.totalContributions ?? 0)
        };
    }

    private _updateGithubChart(stats: GitHubStats): void {
        const githubChart = this.charts.find((chart) => chart.key === 'github');

        if (!githubChart) {
            return;
        }

        githubChart.isLoading = false;
        githubChart.totalLabel = stats.contributions.toString();
        githubChart.segments = this._buildSegments(
            stats.contributionsByYear.map((item, index) => ({
                labelKey: `home.projects.label.${item.year}`,
                value: item.contributions,
                color: this._getGithubContributionYearColor(index)
            }))
        );
    }

    private _createChart(
        key: string,
        titleKey: string,
        centerLabelKey: string,
        valueSuffix: string,
        segments: ChartSegmentInput[],
        isLoading = false
    ): ProjectChart {
        return {
            key,
            titleKey,
            centerLabelKey,
            totalLabel: this._getTotalLabel(segments, valueSuffix),
            valueSuffix,
            isLoading,
            segments: this._buildSegments(segments)
        };
    }

    private _buildSegments(segments: ChartSegmentInput[]): ChartSegment[] {
        const circumference = 263.89;
        const total = this._sumSegmentValues(segments);

        let currentOffset = 0;

        return segments.map((segment) => {
            const percentage = total > 0 ? segment.value / total : 0;
            const dashLength = percentage * circumference;

            const chartSegment: ChartSegment = {
                ...segment,
                dashArray: `${dashLength} ${circumference - dashLength}`,
                dashOffset: -currentOffset
            };

            currentOffset += dashLength;

            return chartSegment;
        });
    }

    private _sumSegmentValues(segments: ChartSegmentInput[]): number {
        return segments.reduce((total, segment) => total + segment.value, 0);
    }

    private _getTotalLabel(segments: ChartSegmentInput[], valueSuffix: string): string {
        const total = this._sumSegmentValues(segments);

        return `${total}${valueSuffix}`;
    }

    private _updateImageIndex(group: ProjectGroupKey, step: number): void {
        const project = group === 'home' ? this.selectedHomeProject : this.selectedWorkProject;
        const currentIndex = group === 'home' ? this.selectedHomeImageIndex : this.selectedWorkImageIndex;
        const nextIndex = (currentIndex + step + project.images.length) % project.images.length;

        if (group === 'home') {
            this.selectedHomeImageIndex = nextIndex;
            return;
        }

        this.selectedWorkImageIndex = nextIndex;
    }

    private _updatePreviewImageIndex(step: number): void {
        if (!this.hasMultiplePreviewImages) {
            return;
        }

        this.previewImageIndex = (
            this.previewImageIndex + step + this.previewImages.length
        ) % this.previewImages.length;

        this.previewImageSwipeOffset = 0;
        this.previewImageSwipeTransition = '';

        this._changeDetectorRef.markForCheck();
    }

    private _handlePreviewKeyboardNavigation = (event: KeyboardEvent): void => {
        this._onPreviewKeyboardNavigation(event);
    };

    private _onPreviewKeyboardNavigation(event: KeyboardEvent): void {
        if (!this.isImagePreviewOpen) {
            return;
        }

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                this.showPreviousPreviewImage();
                break;

            case 'ArrowRight':
                event.preventDefault();
                this.showNextPreviewImage();
                break;

            case 'Escape':
                event.preventDefault();
                this.closeImagePreview();
                this._changeDetectorRef.markForCheck();
                break;
        }
    }

    private _resetPreviewSwipe(): void {
        this.previewImageSwipeOffset = 0;
        this.previewImageSwipeTransition = 'none';

        this._changeDetectorRef.markForCheck();
    }

    private _getGithubContributionYearColor(index: number): string {
        const colors = [
            '#a9bfda',
            '#8daace',
            '#5480b6',
            '#436c9d',
            '#375881',
            '#2b4564',
            '#1f334a'
        ];

        return colors[index % colors.length];
    }

        private _sumGithubContributions(contributionsByYear: GitHubContributionYear[]): number {
        return contributionsByYear.reduce(
            (total, item) => total + item.contributions,
            0
        );
    }

    private _formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private _getSegmentPercentage(chart: ProjectChart, segment: ChartSegment): number {
        const total = this._sumSegmentValues(chart.segments);

        if (total === 0) {
            return 0;
        }

        return Math.round((segment.value / total) * 100);
    }
}
