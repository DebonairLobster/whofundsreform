import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { ArrowDownUp, Check, ChevronDown, ChevronLeft, ChevronRight, Columns3, Filter, Search, X } from 'lucide-react'
import type { Donation, Filters, SortKey } from '../types'
import { formatDate, formatMoney, normaliseDateInput } from '../utils/data'

type ColumnKey = SortKey
type Column = { key: ColumnKey; label: string; render: (donation: Donation) => React.ReactNode }

const emptyFilters: Filters = { min:'', max:'', from:'', to:'', donorStatus:'', donationType:'', accountingUnit:'', sponsorship:'', bequest:'', aggregation:'' }
const defaultColumns: ColumnKey[] = ['DonorName','amount','acceptedDate','DonationType','DonorStatus','AccountingUnitName','ReportingPeriodName','ECRef']
const columns: Column[] = [
  { key:'DonorName', label:'Donor name', render:d => <a className="donor-link" href={`#donor/${encodeURIComponent(d.DonorName)}`}>{d.DonorName || 'Not provided'}</a> },
  { key:'amount', label:'Amount', render:d => <strong className="money">{formatMoney(d.amount)}</strong> },
  { key:'acceptedDate', label:'Accepted date', render:d => formatDate(d.acceptedDate) },
  { key:'DonationType', label:'Donation type', render:d => <span className="tag">{d.DonationType || '—'}</span> },
  { key:'DonorStatus', label:'Donor status', render:d => d.DonorStatus || '—' },
  { key:'AccountingUnitName', label:'Accounting unit', render:d => d.AccountingUnitName || '—' },
  { key:'ReportingPeriodName', label:'Reporting period', render:d => d.ReportingPeriodName || '—' },
  { key:'ECRef', label:'EC reference', render:d => <span className="mono">{d.ECRef || '—'}</span> },
]

export function DonationTable({ data, onSelect, compact = false }: { data: Donation[]; onSelect: (d: Donation) => void; compact?: boolean }) {
  const [query,setQuery] = useState('')
  const [filters,setFilters] = useState<Filters>(emptyFilters)
  const [filtersOpen,setFiltersOpen] = useState(false)
  const [columnsOpen,setColumnsOpen] = useState(false)
  const [visibleColumns,setVisibleColumns] = useState<ColumnKey[]>(defaultColumns)
  const [sort,setSort] = useState<{key:SortKey;dir:'asc'|'desc'}>({key:'acceptedDate',dir:'desc'})
  const [page,setPage] = useState(1)
  const pageSize = compact ? 10 : 20
  const options = (key:'DonorStatus'|'DonationType'|'AccountingUnitName') => [...new Set(data.map(d=>d[key]).filter(Boolean))].sort()

  const searched = useMemo(() => {
    const q=query.trim().toLowerCase(); if(!q) return data
    const keys=(['DonorName','CompanyRegistrationNumber','Postcode','ECRef','DonationType','AccountingUnitName'] as const)
    const direct=data.filter(d=>keys.some(k=>d[k].toLowerCase().includes(q)))
    return direct.length ? direct : new Fuse(data,{threshold:.28,ignoreLocation:true,keys:[...keys]}).search(q).map(x=>x.item)
  },[data,query])
  const filtered = useMemo(() => { const from=normaliseDateInput(filters.from),to=normaliseDateInput(filters.to); return searched.filter(d=>(!filters.min||d.amount>=+filters.min)&&(!filters.max||d.amount<=+filters.max)&&(!from||!!d.acceptedDate&&d.acceptedDate>=from)&&(!to||!!d.acceptedDate&&d.acceptedDate<=to)&&(!filters.donorStatus||d.DonorStatus===filters.donorStatus)&&(!filters.donationType||d.DonationType===filters.donationType)&&(!filters.accountingUnit||d.AccountingUnitName===filters.accountingUnit)&&(!filters.sponsorship||String(d.IsSponsorship)===filters.sponsorship)&&(!filters.bequest||String(d.IsBequest)===filters.bequest)&&(!filters.aggregation||String(d.IsAggregation)===filters.aggregation)) },[searched,filters])
  const sorted = useMemo(() => [...filtered].sort((a,b)=>{const av=sort.key==='acceptedDate'?(a.acceptedDate?.getTime()??-1):a[sort.key],bv=sort.key==='acceptedDate'?(b.acceptedDate?.getTime()??-1):b[sort.key];return(typeof av==='number'?av-(bv as number):String(av).localeCompare(String(bv)))*(sort.dir==='asc'?1:-1)}),[filtered,sort])
  const pages=Math.max(1,Math.ceil(sorted.length/pageSize)), rows=sorted.slice((page-1)*pageSize,page*pageSize), active=Object.values(filters).filter(Boolean).length
  useEffect(()=>setPage(1),[query,filters]); useEffect(()=>{if(page>pages)setPage(pages)},[page,pages])
  const toggleColumn=(key:ColumnKey)=>setVisibleColumns(v=>v.includes(key)?(v.length===1?v:v.filter(x=>x!==key)):[...v,key])
  const sortBy=(key:SortKey)=>setSort(s=>({key,dir:s.key===key&&s.dir==='desc'?'asc':'desc'}))
  const shown=columns.filter(c=>visibleColumns.includes(c.key))

  return <div className="database-widget">
    <div className="toolbar">
      <label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search donor, postcode, company or EC reference…" aria-label="Search donations"/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear search"><X size={17}/></button>}</label>
      <div className="column-picker"><button className="filter-toggle" onClick={()=>setColumnsOpen(v=>!v)} aria-expanded={columnsOpen}><Columns3 size={18}/> Columns <ChevronDown size={15}/></button>{columnsOpen&&<div className="column-menu">{columns.map(c=><button key={c.key} onClick={()=>toggleColumn(c.key)}><span className={visibleColumns.includes(c.key)?'checked':''}>{visibleColumns.includes(c.key)&&<Check size={13}/>}</span>{c.label}</button>)}</div>}</div>
      {!compact&&<button className="filter-toggle" onClick={()=>setFiltersOpen(v=>!v)} aria-expanded={filtersOpen}><Filter size={18}/> Filters {active>0&&<b>{active}</b>}<ChevronDown size={15}/></button>}
    </div>
    {!compact&&<div className={`filters ${filtersOpen?'open':''}`}>
      <label>Minimum amount<input type="number" value={filters.min} onChange={e=>setFilters({...filters,min:e.target.value})} placeholder="£0"/></label><label>Maximum amount<input type="number" value={filters.max} onChange={e=>setFilters({...filters,max:e.target.value})} placeholder="No maximum"/></label><label>From date<input type="date" value={filters.from} onChange={e=>setFilters({...filters,from:e.target.value})}/></label><label>To date<input type="date" value={filters.to} onChange={e=>setFilters({...filters,to:e.target.value})}/></label>
      {([['Donor status','donorStatus','DonorStatus'],['Donation type','donationType','DonationType'],['Accounting unit','accountingUnit','AccountingUnitName']] as const).map(([label,key,source])=><label key={key}>{label}<select value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})}><option value="">All</option>{options(source).map(x=><option key={x}>{x}</option>)}</select></label>)}
      {([['Sponsorship','sponsorship'],['Bequest','bequest'],['Aggregation','aggregation']] as const).map(([label,key])=><label key={key}>{label}<select value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})}><option value="">All</option><option value="true">Yes</option><option value="false">No</option></select></label>)}<button className="clear" onClick={()=>setFilters(emptyFilters)} disabled={!active}>Clear all filters</button>
    </div>}
    <div className="table-meta"><span>{filtered.length.toLocaleString()} records</span><span>{shown.length} of {columns.length} columns</span></div>
    <div className="table-shell"><table><thead><tr>{shown.map(c=><th key={c.key}><button onClick={()=>sortBy(c.key)}>{c.label}<ArrowDownUp size={14}/></button></th>)}</tr></thead><tbody>{rows.map(d=><tr key={d.id} onClick={()=>onSelect(d)} tabIndex={0} onKeyDown={e=>e.key==='Enter'&&onSelect(d)}>{shown.map(c=><td key={c.key} onClick={e=>c.key==='DonorName'&&e.stopPropagation()}>{c.render(d)}</td>)}</tr>)}</tbody></table>{!rows.length&&<div className="empty">No donations match those filters.</div>}</div>
    <div className="pagination"><span>Page {page} of {pages}</span><div><button onClick={()=>setPage(p=>p-1)} disabled={page===1}><ChevronLeft size={18}/> Previous</button><button onClick={()=>setPage(p=>p+1)} disabled={page===pages}>Next <ChevronRight size={18}/></button></div></div>
  </div>
}
