export interface ProfileDetail {
    key: string;
    labelKey: string;
    valueKey: string;
}

export interface SocialLink {
    key: string;
    labelKey: string;
    ariaLabelKey: string;
    iconPath: string;
    href: string | null;
    target: '_blank' | '_self' | null;
    rel: string | null;
    type: 'external' | 'dialog';
}

export interface TimelineItem {
    key: string;
    timeKey: string;
    roleKey: string | null;
    titleKey: string | null;
    descKey: string;
}

export interface JourneyItem extends TimelineItem {
    side: 'left' | 'right';
}
