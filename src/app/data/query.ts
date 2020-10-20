export interface Query {
    conditions: WhereCondition[];
    orderBy?: string;
}

export interface WhereCondition {
    field: string;
    op: any;
    value: any;
}
