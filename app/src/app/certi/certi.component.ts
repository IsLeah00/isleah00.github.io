import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { PreviewDialogComponent } from 'app/certi/preview-dialog/preview-dialog.component';
import { CertificateItem, CertificateTypeFilter, ExamModeFilter, FilterOption, SearchInputValue, SearchOption, SearchOptionType, SearchTerm, SortOption } from 'core/certi/certi.types';
import { CERTIFICATES } from 'core/certi/certi.data';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-certi',
    templateUrl: './certi.component.html',
    styleUrl: './certi.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRadioModule,
        MatSelectModule,
        TranslocoModule,
        MatTooltipModule
    ],
})
export class CertiComponent implements OnInit, OnDestroy {
    sortOptions: FilterOption[] = [];
    typeOptions: FilterOption[] = [];
    examModeOptions: FilterOption[] = [];
    pageSizeOptions: number[] = [6, 12, 18];
    isLoading = true;

    searchInput = '';
    searchTerms: SearchTerm[] = [];
    selectedSort: SortOption = 'title-asc';
    selectedType: CertificateTypeFilter = 'all';
    selectedExamMode: ExamModeFilter = 'all';
    selectedCompany = 'all';
    selectedTags: string[] = [];
    tagFilterSearch = '';
    pageSize = 6;
    pageIndex = 0;
    filteredCertificates: CertificateItem[] = [];
    pagedCertificates: CertificateItem[] = [];
    filteredSearchOptions: SearchOption[] = [];
    tagOptions: FilterOption[] = [];
    visibleTagOptions: FilterOption[] = [];
    companyOptions: FilterOption[] = [];
    visibleCompanyOptions: FilterOption[] = [];
    showAllTags = false;
    showAllCompanies = false;
    isMobileFiltersOpen = false;

    private allCertificates: CertificateItem[] = [];
    private readonly maxVisibleFilterItems = 5;
    private allSearchOptions: SearchOption[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private readonly dialog: MatDialog,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _transloco: TranslocoService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._translateCertificates();
        this._initializeStaticOptions();
        this._refreshView();
        this.isLoading = false;

        this._transloco.langChanges$.subscribe((lang) => {
            this._transloco.load(lang).subscribe(() => {
                this._translateCertificates();
                this._initializeStaticOptions();
                this._refreshView();
                this._changeDetectorRef.markForCheck();
            });
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    trackByCertificateId(_: number, item: CertificateItem): string {
        return item.id;
    }

    trackByOptionValue(_: number, item: FilterOption): string {
        return item.value;
    }

    trackBySearchOption(_: number, item: SearchOption): string {
        return `${item.type}-${item.value}`;
    }

    trackBySearchTerm(_: number, item: SearchTerm): string {
        return `${item.type}-${item.value}`;
    }

    toggleMobileFilters(): void {
        this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
    }

    onSearchInputChange(value: SearchInputValue): void {
        this.searchInput = this._normalizeSearchInput(value);
        this._updateFilteredSearchOptions();
    }

    onSearchKeydown(event: KeyboardEvent): void {
        if (event.key !== 'Enter') {
            return;
        }

        event.preventDefault();

        const matchedOption = this._findExactSearchOption(this.searchInput);

        if (!matchedOption) {
            this.searchInput = '';
            this._updateFilteredSearchOptions();
            return;
        }

        this._addSearchTerm(matchedOption);
    }

    onSearchOptionSelected(
        event: MatAutocompleteSelectedEvent,
        inputElement: HTMLInputElement,
    ): void {
        const option = event.option.value as SearchOption;

        this._addSearchTerm(option);
        this._clearSearchInput(inputElement);
    }

    displaySearchOption = (option: SearchOption | string | null): string => {
        if (!option) {
            return '';
        }

        if (typeof option === 'string') {
            return option;
        }

        return option.value;
    };

    removeSearchTerm(termToRemove: SearchTerm): void {
        this.searchTerms = this.searchTerms.filter(
            (term) =>
                !(
                    term.type === termToRemove.type &&
                    term.value === termToRemove.value
                ),
        );

        this.pageIndex = 0;
        this._refreshView();
    }

    onTagFilterSearchChange(value: string): void {
        this.tagFilterSearch = value;
        this.showAllTags = false;
        this._updateVisibleTagOptions();
    }

    onSortChange(value: string): void {
        this.selectedSort = value as SortOption;
        this.pageIndex = 0;
        this._refreshView();
    }

    onTypeChange(value: string): void {
        this.selectedType = value as CertificateTypeFilter;
        this.pageIndex = 0;
        this._refreshView();
    }

    onExamModeChange(value: string): void {
        this.selectedExamMode = value as ExamModeFilter;
        this.pageIndex = 0;
        this._refreshView();
    }

    onCompanyChange(value: string): void {
        this.selectedCompany = value;
        this.pageIndex = 0;
        this._refreshView();
    }

    toggleTag(tag: string, checked: boolean): void {
        if (checked) {
            this._addSelectedTag(tag);
        } else {
            this._removeSelectedTag(tag);
        }

        this.pageIndex = 0;
        this._refreshView();
    }

    isTagSelected(tag: string): boolean {
        return this.selectedTags.includes(tag);
    }

    clearAllFilters(): void {
        this.searchInput = '';
        this.searchTerms = [];
        this.selectedSort = 'title-asc';
        this.selectedType = 'all';
        this.selectedExamMode = 'all';
        this.selectedCompany = 'all';
        this.selectedTags = [];
        this.tagFilterSearch = '';
        this.showAllTags = false;
        this.showAllCompanies = false;
        this.pageIndex = 0;

        this._refreshView();
    }

    toggleShowAllTags(): void {
        this.showAllTags = !this.showAllTags;
        this._updateVisibleTagOptions();
    }

    toggleShowAllCompanies(): void {
        this.showAllCompanies = !this.showAllCompanies;
        this._updateVisibleCompanyOptions();
    }

    shouldShowTagToggle(): boolean {
        return this.tagOptions.length > this.maxVisibleFilterItems;
    }

    shouldShowCompanyToggle(): boolean {
        return this.companyOptions.length > this.maxVisibleFilterItems;
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this._updatePagedCertificates();

        queueMicrotask(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }

    openPreview(certificate: CertificateItem): void {
        this.dialog.open(PreviewDialogComponent, {
            data: {
                title: certificate.title,
                issuer: certificate.issuer,
                date: certificate.date,
                imageUrl: certificate.imageUrl,
                credentialUrl: certificate.credentialUrl,
                credentialCode: certificate.credentialCode,
                credentialLabel: certificate.credentialLabel,
                isOnline: certificate.isOnline ?? true,
            },
            maxWidth: '95vw',
            width: '1000px',
            autoFocus: false,
            panelClass: 'preview-dialog',
        });
    }

    getSearchTermTypeLabel(type: SearchOptionType): string {
        switch (type) {
            case 'title':
                return this._transloco.translate('certi.label.title');
            case 'company':
                return this._transloco.translate('certi.label.company');
            case 'tag':
                return this._transloco.translate('certi.label.tag');
            default:
                return '';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _initializeStaticOptions(): void {
        this.tagOptions = this._buildTagOptions();
        this.companyOptions = this._buildCompanyOptions();
        this.allSearchOptions = this._buildSearchOptions();

        this._updateVisibleTagOptions();
        this._updateVisibleCompanyOptions();
        this._updateFilteredSearchOptions();
    }

    private _refreshView(): void {
        this.filteredCertificates = this._buildFilteredCertificates();
        this._updatePagedCertificates();
        this._updateFilteredSearchOptions();
    }

    private _updatePagedCertificates(): void {
        const startIndex = this.pageIndex * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        this.pagedCertificates = this.filteredCertificates.slice(
            startIndex,
            endIndex,
        );
    }

    private _updateFilteredSearchOptions(): void {
        const _normalizedInput = this._normalize(this.searchInput);
        const selectedKeys = new Set(
            this.searchTerms.map((term) => this._createSearchKey(term.type, term.value)),
        );

        this.filteredSearchOptions = this.allSearchOptions.filter((option) => {
            const optionKey = this._createSearchKey(option.type, option.value);
            const matchesInput =
                !_normalizedInput ||
                this._normalize(option.value).includes(_normalizedInput);

            return matchesInput && !selectedKeys.has(optionKey);
        });
    }

    private _updateVisibleTagOptions(): void {
        const _normalizedSearch = this._normalize(this.tagFilterSearch);
        const filteredOptions = this.tagOptions.filter((option) =>
            this._normalize(option.label).includes(_normalizedSearch),
        );

        this.visibleTagOptions = this._limitVisibleItems(
            filteredOptions,
            this.showAllTags,
        );
    }

    private _updateVisibleCompanyOptions(): void {
        this.visibleCompanyOptions = this._limitVisibleItems(
            this.companyOptions,
            this.showAllCompanies,
        );
    }

    private _buildTagOptions(): FilterOption[] {
        const uniqueTags = Array.from(
            new Set(this.allCertificates.flatMap((item) => item.category)),
        );

        return uniqueTags
            .sort((left, right) => left.localeCompare(right))
            .map((tag) => ({
                label: tag,
                value: tag,
            }));
    }

    private _buildCompanyOptions(): FilterOption[] {
        const uniqueCompanies = Array.from(
            new Set(this.allCertificates.map((item) => item.issuer)),
        );

        return uniqueCompanies
            .sort((left, right) => left.localeCompare(right))
            .map((company) => ({
                label: company,
                value: company,
            }));
    }

    private _buildSearchOptions(): SearchOption[] {
        const optionMap = new Map<string, SearchOption>();

        this.allCertificates.forEach((certificate) => {
            this._addSearchOption(optionMap, 'title', certificate.title);
            this._addSearchOption(optionMap, 'company', certificate.issuer);

            certificate.category.forEach((tag) => {
                this._addSearchOption(optionMap, 'tag', tag);
            });
        });

        return Array.from(optionMap.values()).sort((left, right) =>
            left.value.localeCompare(right.value),
        );
    }

    private _addSearchOption(
        optionMap: Map<string, SearchOption>,
        type: SearchOptionType,
        value: string,
    ): void {
        const key = this._createSearchKey(type, value);

        if (!optionMap.has(key)) {
            optionMap.set(key, { type, value });
        }
    }

    private _buildFilteredCertificates(): CertificateItem[] {
        const titleSearch = this._getSingleSearchValue('title');
        const companySearch = this._getSingleSearchValue('company');
        const tagSearchValues = this._getTagSearchValues();

        let items = [...this.allCertificates];

        items = this._applySelectedTagFilter(items);
        items = this._applySelectedCompanyFilter(items);
        items = this._applyTitleSearchFilter(items, titleSearch);
        items = this._applyCompanySearchFilter(items, companySearch);
        items = this._applyTagSearchFilter(items, tagSearchValues);
        items = this._applyTypeFilter(items);
        items = this._applyExamModeFilter(items);

        return this._sortCertificates(items);
    }

    private _applySelectedTagFilter(items: CertificateItem[]): CertificateItem[] {
        if (this.selectedTags.length === 0) {
            return items;
        }

        return items.filter((item) =>
            this.selectedTags.every((selectedTag) =>
                item.category.includes(selectedTag),
            ),
        );
    }

    private _applySelectedCompanyFilter(items: CertificateItem[]): CertificateItem[] {
        if (this.selectedCompany === 'all') {
            return items;
        }

        return items.filter((item) => item.issuer === this.selectedCompany);
    }

    private _applyTitleSearchFilter(
        items: CertificateItem[],
        titleSearch: string | null,
    ): CertificateItem[] {
        if (!titleSearch) {
            return items;
        }

        const _normalizedTitle = this._normalize(titleSearch);

        return items.filter(
            (item) => this._normalize(item.title) === _normalizedTitle,
        );
    }

    private _applyCompanySearchFilter(
        items: CertificateItem[],
        companySearch: string | null,
    ): CertificateItem[] {
        if (!companySearch) {
            return items;
        }

        const _normalizedCompany = this._normalize(companySearch);

        return items.filter(
            (item) => this._normalize(item.issuer) === _normalizedCompany,
        );
    }

    private _applyTagSearchFilter(
        items: CertificateItem[],
        tagSearchValues: string[],
    ): CertificateItem[] {
        if (tagSearchValues.length === 0) {
            return items;
        }

        return items.filter((item) => {
            const _normalizedTags = item.category.map((tag) => this._normalize(tag));

            return tagSearchValues.every((tag) => _normalizedTags.includes(tag));
        });
    }

    private _applyTypeFilter(items: CertificateItem[]): CertificateItem[] {
        if (this.selectedType === 'all') {
            return items;
        }

        return items.filter((item) => {
            const isResult = item.isResult ?? false;
            return this.selectedType === 'result' ? isResult : !isResult;
        });
    }

    private _applyExamModeFilter(items: CertificateItem[]): CertificateItem[] {
        if (this.selectedExamMode === 'all') {
            return items;
        }

        return items.filter((item) => {
            const isOnline = item.isOnline ?? true;
            return this.selectedExamMode === 'online' ? isOnline : !isOnline;
        });
    }

    private _sortCertificates(items: CertificateItem[]): CertificateItem[] {
        return [...items].sort((left, right) => {
            switch (this.selectedSort) {
                case 'title-desc':
                    return right.title.localeCompare(left.title);
                case 'newest':
                    return this._parseDate(right.date) - this._parseDate(left.date);
                case 'oldest':
                    return this._parseDate(left.date) - this._parseDate(right.date);
                case 'title-asc':
                default:
                    return left.title.localeCompare(right.title);
            }
        });
    }

    private _addSearchTerm(option: SearchOption): void {
        const searchTerm: SearchTerm = {
            type: option.type,
            value: option.value,
        };

        if (this._hasSearchTerm(searchTerm)) {
            this.searchInput = '';
            this._updateFilteredSearchOptions();
            return;
        }

        if (option.type === 'title' || option.type === 'company') {
            this.searchTerms = this.searchTerms.filter(
                (term) => term.type !== option.type,
            );
        }

        this.searchTerms = [...this.searchTerms, searchTerm];
        this.searchInput = '';
        this.pageIndex = 0;

        this._refreshView();
    }

    private _hasSearchTerm(searchTerm: SearchTerm): boolean {
        return this.searchTerms.some(
            (term) =>
                term.type === searchTerm.type &&
                this._normalize(term.value) === this._normalize(searchTerm.value),
        );
    }

    private _findExactSearchOption(value: string): SearchOption | null {
        const _normalizedValue = this._normalize(value);

        if (!_normalizedValue) {
            return null;
        }

        const matchedOption = this.filteredSearchOptions.find(
            (option) => this._normalize(option.value) === _normalizedValue,
        );

        return matchedOption ?? null;
    }

    private _getSingleSearchValue(type: SearchOptionType): string | null {
        const matchedTerm = this.searchTerms.find((term) => term.type === type);
        return matchedTerm?.value ?? null;
    }

    private _getTagSearchValues(): string[] {
        return this.searchTerms
            .filter((term) => term.type === 'tag')
            .map((term) => this._normalize(term.value));
    }

    private _addSelectedTag(tag: string): void {
        if (this.selectedTags.includes(tag)) {
            return;
        }

        this.selectedTags = [...this.selectedTags, tag];
    }

    private _removeSelectedTag(tag: string): void {
        this.selectedTags = this.selectedTags.filter(
            (selectedTag) => selectedTag !== tag,
        );
    }

    private _limitVisibleItems<T>(items: T[], showAll: boolean): T[] {
        if (showAll) {
            return items;
        }

        return items.slice(0, this.maxVisibleFilterItems);
    }

    private _createSearchKey(type: SearchOptionType, value: string): string {
        return `${type}:${this._normalize(value)}`;
    }

    private _normalize(value: unknown): string {
        if (typeof value === 'string') {
            return value.trim().toLowerCase();
        }

        if (
            value &&
            typeof value === 'object' &&
            'value' in value &&
            typeof (value as { value?: unknown }).value === 'string'
        ) {
            return ((value as { value: string }).value).trim().toLowerCase();
        }

        return '';
    }

    private _parseDate(value: string): number {
        return new Date(value).getTime();
    }

    private _clearSearchInput(inputElement: HTMLInputElement): void {
        this.searchInput = '';
        inputElement.value = '';
        this._updateFilteredSearchOptions();
    }

    private _translateCertificates(): void {
        this.allCertificates = CERTIFICATES.map((item) => ({
            ...item,

            title: item.title,

            category: item.categoryKeys.map((key) =>
                this._transloco.translate(key)
            ),

            date: item.date?.monthKey
                ? `${this._transloco.translate(item.date.monthKey)} ${item.date.day}, ${item.date.year}`
                : item.date?.year || '',

            credentialLabel: item.credentialLabelKey
                ? this._transloco.translate(item.credentialLabelKey)
                : undefined,
        }));
    }

    private _normalizeSearchInput(value: SearchInputValue): string {
        if (typeof value === 'string') {
            return value.trim();
        }

        if (
            value &&
            typeof value === 'object' &&
            'value' in value &&
            typeof value.value === 'string'
        ) {
            return value.value.trim();
        }

        return '';
    }
}
