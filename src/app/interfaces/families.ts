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
    familyId: string;
    status: string;
    familyName?: string; 
    flatNumber?: string; 
}    