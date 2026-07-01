import type { Donation, RawDonation } from '../types'
export const parseMoney=(value=''):number=>{const n=Number(value.replace(/[^0-9.-]+/g,''));return Number.isFinite(n)?n:0}
export const parseUKDate=(value=''):Date|null=>{const m=value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!m)return null;const [,d,mo,y]=m;const date=new Date(+y,+mo-1,+d);return date.getFullYear()===+y&&date.getMonth()===+mo-1&&date.getDate()===+d?date:null}
const bool=(value='')=>value.trim().toLowerCase()==='true'
export const cleanDonation=(raw:RawDonation,index:number):Donation=>({id:raw.ECRef||`row-${index}`,amount:parseMoney(raw.Value),acceptedDate:parseUKDate(raw.AcceptedDate),receivedDate:parseUKDate(raw.ReceivedDate),reportedDate:parseUKDate(raw.ReportedDate),raw,ECRef:raw.ECRef||'',DonorName:raw.DonorName||'',DonorStatus:raw.DonorStatus||'',DonationType:raw.DonationType||'',AccountingUnitName:raw.AccountingUnitName||'',ReportingPeriodName:raw.ReportingPeriodName||'',CompanyRegistrationNumber:raw.CompanyRegistrationNumber||'',Postcode:raw.Postcode||'',IsSponsorship:bool(raw.IsSponsorship),IsBequest:bool(raw.IsBequest),IsAggregation:bool(raw.IsAggregation)})
export const formatMoney=(value:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value)
export const formatDate=(date:Date|null)=>date?new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(date):'Not provided'
export const normaliseDateInput=(value:string)=>value?new Date(`${value}T00:00:00`):null
