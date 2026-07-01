export interface RawDonation { [key: string]: string }
export interface Donation { id:string; amount:number; acceptedDate:Date|null; receivedDate:Date|null; reportedDate:Date|null; raw:RawDonation; ECRef:string; DonorName:string; DonorStatus:string; DonationType:string; AccountingUnitName:string; ReportingPeriodName:string; CompanyRegistrationNumber:string; Postcode:string; IsSponsorship:boolean; IsBequest:boolean; IsAggregation:boolean }
export type SortKey='DonorName'|'amount'|'acceptedDate'|'DonationType'|'DonorStatus'|'AccountingUnitName'|'ReportingPeriodName'|'ECRef'
export interface Filters { min:string; max:string; from:string; to:string; donorStatus:string; donationType:string; accountingUnit:string; sponsorship:string; bequest:string; aggregation:string }
