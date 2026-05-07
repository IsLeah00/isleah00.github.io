export interface CertificateItemRaw {
    id: string;
    issuer: string;
    title: string;
    categoryKeys: string[];
    imageUrl: string;
    credentialUrl?: string;
    credentialCode?: string;
    credentialLabelKey?: string;
    isResult: boolean;
    isOnline: boolean;
    date: {
        monthKey: string;
        day: string;
        year: string;
    };
}

export interface CertificateItem {
    id: string;
    issuer: string;
    title: string;
    category: string[];
    imageUrl: string;
    credentialUrl?: string;
    credentialCode?: string;
    credentialLabel?: string;
    isResult: boolean;
    isOnline: boolean;
    date: string;
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface SearchTerm {
    type: SearchOptionType;
    value: string;
}

export interface SearchOption {
    type: SearchOptionType;
    value: string;
}

export type SortOption = 'title-asc' | 'title-desc' | 'newest' | 'oldest';

export type CertificateTypeFilter = 'all' | 'certificate' | 'result';

export type ExamModeFilter = 'all' | 'online' | 'in-person';

export type SearchOptionType = 'title' | 'company' | 'tag';

export type SearchInputValue = string | SearchOption | null | undefined;
