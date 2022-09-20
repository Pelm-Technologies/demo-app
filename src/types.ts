

export type EnergyAccount = {
    accountNumber: string;
    address: string;
    id: string;
    unit: string;
}

export type UsageInterval = {
    start: string;
    end: string;
    value: number;
}

export type FlowType = 'default' | 'setup_connect'