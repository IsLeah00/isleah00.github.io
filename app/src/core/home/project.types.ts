export interface ChartSegmentInput {
    labelKey: string;
    value: number;
    color: string;
}

export interface ChartSegment extends ChartSegmentInput {
    dashArray: string;
    dashOffset: number;
}

export interface ProjectChart {
    key: string;
    titleKey: string;
    centerLabelKey: string;
    totalLabel: string;
    valueSuffix: string;
    isLoading: boolean;
    segments: ChartSegment[];
}

export interface GitHubStats {
    contributions: number;
    commits: number;
    pullRequests: number;
    issues: number;
}

export type ProjectGroupKey = 'home' | 'work';

export interface ShowcaseProject {
    key: string;
    titleKey: string;
    descriptionKey: string;
    tagKeys: string[];
    images: string[];
    codeUrl?: string;
    dateKey?: string;
}
