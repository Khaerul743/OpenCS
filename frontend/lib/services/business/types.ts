export interface CustomerResponse {
    id: string;
    wa_id: string;
    name: string;
    phone_number: string;
    enable_ai: boolean;
    created_at: string;
}

export interface GetCustomersResponse {
    total_customers: number;
    customers: CustomerResponse[];
}
