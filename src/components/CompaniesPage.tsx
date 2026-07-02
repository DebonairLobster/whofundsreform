import { useMemo, useState } from 'react'
import { Banknote, BriefcaseBusiness, Building2, Factory, FlaskConical, HardHat, Landmark, MonitorSmartphone, Shield, Sparkles, Truck, X } from 'lucide-react'
import type { Donation } from '../types'
import { formatMoney } from '../utils/data'
import { normaliseCompanyNumber, sicByCompanyNumber } from '../data/sicCodes'

type Company={number:string;names:Set<string>;total:number;count:number;codes:string[];officialName:string}
const sectionMeta:Record<string,{name:string;icon:typeof Building2}>={
  C:{name:'Manufacturing',icon:Factory},F:{name:'Construction',icon:HardHat},G:{name:'Wholesale and retail trade',icon:BriefcaseBusiness},H:{name:'Transportation and storage',icon:Truck},J:{name:'Information and communication',icon:MonitorSmartphone},K:{name:'Financial and insurance activities',icon:Banknote},L:{name:'Real estate activities',icon:Building2},M:{name:'Professional, scientific and technical activities',icon:FlaskConical},N:{name:'Administrative and support service activities',icon:BriefcaseBusiness},O:{name:'Public administration and defence',icon:Landmark},S:{name:'Other service activities',icon:Sparkles},U:{name:'Unclassified or unavailable',icon:Shield},
}
const sectionFor=(code:string)=>{const n=Number(code.slice(0,2));if(n>=10&&n<=33)return'C';if(n>=41&&n<=43)return'F';if(n>=45&&n<=47)return'G';if(n>=49&&n<=53)return'H';if(n>=58&&n<=63)return'J';if(n>=64&&n<=66)return'K';if(n===68)return'L';if(n>=69&&n<=75)return'M';if(n>=77&&n<=82)return'N';if(n===84)return'O';if(n>=94&&n<=96)return'S';return'U'}

export function CompaniesPage({data}:{data:Donation[]}){
  const [activeSection,setActiveSection]=useState<string|null>(null)
  const analysis=useMemo(()=>{
    const companies=new Map<string,Company>()
    data.filter(d=>d.DonorStatus==='Company').forEach(d=>{const number=normaliseCompanyNumber(d.CompanyRegistrationNumber,d.DonorName),sic=sicByCompanyNumber[number];const v=companies.get(number)||{number,names:new Set<string>(),total:0,count:0,codes:sic?.codes||[],officialName:sic?.name||d.DonorName};v.names.add(d.DonorName.trim());v.total+=d.amount;v.count++;companies.set(number,v)})
    const ranked=[...companies.values()].sort((a,b)=>b.total-a.total)
    const sections=new Map<string,{key:string;name:string;total:number;companies:Company[]}>()
    ranked.forEach(c=>{const key=sectionFor(c.codes[0]||''),meta=sectionMeta[key],v=sections.get(key)||{key,name:meta.name,total:0,companies:[]};v.total+=c.total;v.companies.push(c);sections.set(key,v)})
    return{ranked,sections:[...sections.values()].sort((a,b)=>b.total-a.total),total:ranked.reduce((s,c)=>s+c.total,0)}
  },[data])
  const selected=analysis.sections.find(section=>section.key===activeSection)
  return <div className="companies-home">
    <section className="companies-hero"><div className="wrap"><p className="eyebrow">Companies House SIC analysis</p><h1>Which industries fund Reform UK?</h1><p>Company donors in the Electoral Commission data have given {formatMoney(analysis.total)}. Explore how much each industry has donated and which companies are making the donations.</p><div className="companies-facts"><span><strong>{analysis.ranked.length}</strong> legal companies</span><span><strong>{analysis.sections.length}</strong> industry sections</span><span><strong>{analysis.ranked.reduce((s,c)=>s+c.count,0)}</strong> company donations</span></div></div></section>
    <section className="industry-grid wrap" aria-label="Industry sections">{analysis.sections.map(section=>{const Icon=sectionMeta[section.key].icon;return <button type="button" onClick={()=>setActiveSection(section.key)} aria-expanded={activeSection===section.key} key={section.key} className={`industry-link ${activeSection===section.key?'active':''}`}><Icon aria-hidden="true"/><div><h2>{section.name}</h2><p>Donated {formatMoney(section.total)}</p></div></button>})}</section>
    {selected&&<section className="industry-details wrap"><div className="industry-details-head"><button type="button" onClick={()=>setActiveSection(null)}><X size={17}/> Close industry</button><p className="eyebrow">Follow the money</p><h2>{selected.name}</h2><p>{selected.companies.length} compan{selected.companies.length===1?'y':'ies'} grouped using their primary filed SIC code.</p></div><article className="industry-section" id={`sic-${selected.key}`}><header><div><span>SIC section {selected.key}</span><h3>Companies in this industry</h3></div><strong>{formatMoney(selected.total)}</strong></header><div className="industry-companies">{selected.companies.map((c,i)=><div key={c.number} className="industry-company"><span>{String(i+1).padStart(2,'0')}</span><div><h4>{c.officialName}</h4>{c.names.size>1&&<small>CSV names: {[...c.names].join(' / ')}</small>}<p>{c.codes.length?c.codes.join(' · '):'SIC not filed / unavailable'}</p></div><strong>{formatMoney(c.total)}</strong><a href={`https://find-and-update.company-information.service.gov.uk/company/${c.number}`} target="_blank" rel="noreferrer">Companies House ↗</a></div>)}</div></article></section>}
    <section className="companies-method"><div className="wrap"><p className="eyebrow">Methodology</p><h2>How to read this analysis</h2><p>Totals use records whose donor status is “Company”. “Sponsorship” is a separate Electoral Commission field and is not used as a synonym for company donations. Industry sections use each company’s first filed SIC code, so companies with several codes are counted once.</p><p>SIC data came from Companies House overview pages checked on 2 July 2026. The raw CSV is unchanged. For lookup only, two truncated source numbers were matched by exact company name: TISUN Investments (`05925324`) and Oakpark Alarms Security Services (`04586739`).</p></div></section>
  </div>
}
