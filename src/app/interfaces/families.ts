import { StatSyncFn } from "fs";

export interface Family {
    id?: string;
    familyName: string;
    phone: string;
    email: string;
    familyMembers: number;
    flatNumber: string;
    createdAt: string;
    isActive: boolean;
}

export interface Defaulter {
    amount: number;
    dueDate: string;
    email: string;
    familyId: string;
    status: string;
    familyName?: string; 
    flatNumber?: string; 
}    