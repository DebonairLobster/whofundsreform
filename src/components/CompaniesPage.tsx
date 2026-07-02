import { useMemo } from 'react'
import type { Donation } from '../types'
import { formatMoney } from '../utils/data'
import { normaliseCompanyNumber, sicByCompanyNumber } from '../data/sicCodes'

export function CompaniesPage({data}:{data:Donation[]}){
  const analysis=useMemo(()=>{
    const companies=new Map<string,{number:string;names:Set<string>;total:number;count:number;codes:string[];officialName:string}>()
    data.filter(d=>d.DonorStatus==='Company').forEach(d=>{const number=normaliseCompanyNumber(d.CompanyRegistrationNumber,d.DonorName),sic=sicByCompanyNumber[number];const v=companies.get(number)||{number,names:new Set<string>(),total:0,count:0,codes:sic?.codes||[],officialName:sic?.name||d.DonorName};v.names.add(d.DonorName.trim());v.total+=d.amount;v.count++;companies.set(number,v)})
    const ranked=[...companies.values()].sort((a,b)=>b.total-a.total)
    const sectors=new Map<string,{code:string;description:string;total:number;companies:number;donations:number}>()
    ranked.forEach(c=>{const primary=c.codes[0]||'Not filed / unavailable',match=primary.match(/^(\d+)\s-\s(.+)$/),code=match?.[1]||'—',description=match?.[2]||primary;const v=sectors.get(primary)||{code,description,total:0,companies:0,donations:0};v.total+=c.total;v.companies++;v.donations+=c.count;sectors.set(primary,v)})
    return{ranked,sectors:[...sectors.values()].sort((a,b)=>b.total-a.total),total:ranked.reduce((s,c)=>s+c.total,0)}
  },[data])
  return <div className="companies-analysis">
    <div className="company-summary"><article><span>Company donations</span><strong>{formatMoney(analysis.total)}</strong></article><article><span>Legal companies</span><strong>{analysis.ranked.length}</strong></article><article><span>Largest company donor</span><strong>{analysis.ranked[0].officialName}</strong><small>{formatMoney(analysis.ranked[0].total)}</small></article></div>
    <section className="panel sic-sectors"><div className="section-head"><div><p className="eyebrow">Grouped by primary filed SIC</p><h2>Leading business activities</h2></div></div><div className="sector-list">{analysis.sectors.map((s,i)=><article key={`${s.code}-${s.description}`}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{s.description}</strong><small>SIC {s.code} · {s.companies} compan{s.companies===1?'y':'ies'} · {s.donations} donations</small></div><b>{formatMoney(s.total)}</b></article>)}</div></section>
    <section className="panel company-ranking"><div className="section-head"><div><p className="eyebrow">Ranked by total donations</p><h2>Company donors and SIC codes</h2></div></div><div className="company-table-wrap"><table><thead><tr><th>Company</th><th>Total</th><th>Donations</th><th>Filed SIC activities</th><th>Source</th></tr></thead><tbody>{analysis.ranked.map(c=><tr key={c.number}><td><strong>{c.officialName}</strong>{c.names.size>1&&<small>CSV names: {[...c.names].join(' / ')}</small>}<span className="mono">{c.number}</span></td><td className="money">{formatMoney(c.total)}</td><td>{c.count}</td><td>{c.codes.length?c.codes.map(code=><span className="sic-chip" key={code}>{code}</span>):<span className="muted">Not filed / unavailable</span>}</td><td><a href={`https://find-and-update.company-information.service.gov.uk/company/${c.number}`} target="_blank" rel="noreferrer">Companies House ↗</a></td></tr>)}</tbody></table></div></section>
    <div className="data-caveat"><strong>How to read this</strong><p>Totals use records whose donor status is “Company”. “Sponsorship” is a separate Electoral Commission field and is not used as a synonym for company donations. Sector totals use each company’s first filed SIC code so companies with several codes are counted once.</p><p>SIC data came from Companies House overview pages checked on 2 July 2026. The raw CSV is unchanged. For lookup only, two truncated source numbers were matched by exact company name: TISUN Investments (`05925324`) and Oakpark Alarms Security Services (`04586739`).</p></div>
  </div>
}
