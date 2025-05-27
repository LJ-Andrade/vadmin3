export interface Pagination<T> {
    current_page: string;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string | null;
    path: string;
    list_regs_per_page: number;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Results<T> {
    loading: boolean;
    results: any[];
    relations: Record<string, any>;
    pagination?: Pagination<T>;
    error: string;
}
