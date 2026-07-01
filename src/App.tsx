import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { ArrowRight, Database, MapPinned, Users } from 'lucide-react'
import type { Donation, RawDonation } from './types'
import { cleanDonation, formatDate, formatMoney } from './utils/data'
import { Detail } from './components/Detail'
import { DonationTable } from './components/DonationTable'
import { PostcodeMap } from './components/PostcodeMap'
import { Timeline, TypeBreakdown } from './components/Charts'

type View = 'home'|'donations'|'donors'|'map'|'about'|'donor'
const route = ():{view:View;donor?:string} => {
  const hash=window.location.hash.slice(1)||'home'
  if(hash.startsWith('donor/')) return {view:'donor',donor:decodeURIComponent(hash.slice(6))}
  return {view:(['home','donations','donors','map','about'].includes(hash)?hash:'home') as View}
}

function App(){
  const [data,setData]=useState<Donation[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [current,setCurrent]=useState(route)
  const [selected,setSelected]=useState<Donation|null>(null)

  useEffect(()=>{const onHash=()=>{setCurrent(route());setSelected(null);window.scrollTo(0,0)};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[])
  useEffect(()=>{Papa.parse<RawDonation>('./results.csv',{download:true,header:true,skipEmptyLines:true,complete:r=>{setData(r.data.map(cleanDonation));setLoading(false)},error:e=>{setError(e.message);setLoading(false)}})},[])

  const stats=useMemo(()=>{const total=data.reduce((s,d)=>s+d.amount,0),largest=data.reduce((m,d)=>d.amount>m.amount?d:m,data[0]||({amount:0} as Donation)),recent=data.reduce<Date|null>((m,d)=>d.acceptedDate&&(!m||d.acceptedDate>m)?d.acceptedDate:m,null);return{total,count:data.length,donors:new Set(data.map(d=>d.DonorName.trim().toLowerCase()).filter(Boolean)).size,largest,recent}},[data])
  const donors=useMemo(()=>{const m=new Map<string,{name:string,total:number,count:number;latest:Date|null}>();data.forEach(d=>{const key=d.DonorName.trim().toLowerCase()||'not provided',v=m.get(key)||{name:d.DonorName||'Not provided',total:0,count:0,latest:null};v.total+=d.amount;v.count++;if(d.acceptedDate&&(!v.latest||d.acceptedDate>v.latest))v.latest=d.acceptedDate;m.set(key,v)});return[...m.values()].sort((a,b)=>b.total-a.total)},[data])
  const donorData=current.donor?data.filter(d=>d.DonorName===current.donor):[]

  if(error)return <main className="state"><h1>Could not load the data</h1><p>{error}</p></main>
  return <>
    <header className="site-header"><div className="wrap nav"><a href="#home" className="brand"><span>WFR</span> Who funds Reform UK?</a><nav aria-label="Primary navigation"><a className={current.view==='donations'?'active':''} href="#donations">Donations</a><a className={current.view==='donors'||current.view==='donor'?'active':''} href="#donors">Donors</a><a className={current.view==='map'?'active':''} href="#map">Map</a><a className={current.view==='about'?'active':''} href="#about">About</a></nav></div></header>
    <main>{loading?<div className="page-state">Loading donation records…</div>:<>
      {current.view==='home'&&<Home data={data} stats={stats}/>} 
      {current.view==='donations'&&<Page title="Donations database" eyebrow="Explore every record" intro="Search, filter, sort and choose which columns you want to compare."><DonationTable data={data} onSelect={setSelected}/></Page>}
      {current.view==='donors'&&<Page title="Donor profiles" eyebrow="Grouped by donor name" intro="Totals are grouped using the donor names exactly as they appear in the source data."><div className="donor-grid">{donors.map((d,i)=><a href={`#donor/${encodeURIComponent(d.name)}`} key={d.name} className="donor-card"><span>{String(i+1).padStart(2,'0')}</span><div><h2>{d.name}</h2><p>{d.count} donation{d.count===1?'':'s'} · Latest {formatDate(d.latest)}</p></div><strong>{formatMoney(d.total)}</strong><ArrowRight size={18}/></a>)}</div></Page>}
      {current.view==='donor'&&<DonorProfile name={current.donor||''} data={donorData} onSelect={setSelected}/>} 
      {current.view==='map'&&<Page title="Where donations come from" eyebrow="Postcode-area view" intro="A privacy-conscious, approximate view using only broad postcode areas—not full postcodes or addresses."><PostcodeMap data={data} onSelect={setSelected}/></Page>}
      {current.view==='about'&&<About/>}
    </>}</main>
    <footer><div className="wrap">Who funds Reform UK? <span>·</span> Independent data explorer</div></footer>
    {selected&&<Detail donation={selected} onClose={()=>setSelected(null)}/>} 
  </>
}

function Summary({stats}:{stats:{total:number;count:number;donors:number;largest:Donation;recent:Date|null}}){return <section className="wrap stat-grid"><article><span>Total donation value</span><strong>{formatMoney(stats.total)}</strong></article><article><span>Number of donations</span><strong>{stats.count.toLocaleString()}</strong></article><article><span>Unique donors</span><strong>{stats.donors.toLocaleString()}</strong></article><article><span>Largest single donation</span><strong>{formatMoney(stats.largest.amount)}</strong><small>{stats.largest.DonorName}</small></article><article><span>Most recent accepted</span><strong>{formatDate(stats.recent)}</strong></article></section>}

function Home({data,stats}:{data:Donation[];stats:{total:number;count:number;donors:number;largest:Donation;recent:Date|null}}){return <><section className="hero wrap"><p className="eyebrow">Political funding, made explorable</p><h1>Who funds Reform UK?</h1><p className="intro">A searchable database of donations to Reform UK based on Electoral Commission data.</p></section><Summary stats={stats}/><section className="home-links wrap"><a href="#donations"><Database/><div><p>Search the data</p><h2>Donations database</h2><span>Filter records and control the columns you see.</span></div><ArrowRight/></a><a href="#donors"><Users/><div><p>Follow the money</p><h2>Donor profiles</h2><span>See every donation associated with a donor name.</span></div><ArrowRight/></a><a href="#map"><MapPinned/><div><p>Explore geography</p><h2>Postcode-area map</h2><span>View broad areas without exposing exact addresses.</span></div><ArrowRight/></a></section><section className="wrap analysis home-analysis"><Timeline data={data}/><TypeBreakdown data={data}/></section></>}

function Page({title,eyebrow,intro,children}:{title:string;eyebrow:string;intro:string;children:React.ReactNode}){return <><section className="page-hero"><div className="wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section><section className="page-content wrap">{children}</section></>}

function DonorProfile({name,data,onSelect}:{name:string;data:Donation[];onSelect:(d:Donation)=>void}){const total=data.reduce((s,d)=>s+d.amount,0),latest=data.reduce<Date|null>((m,d)=>d.acceptedDate&&(!m||d.acceptedDate>m)?d.acceptedDate:m,null);return <><section className="page-hero donor-hero"><div className="wrap"><a className="back-link" href="#donors">← All donor profiles</a><p className="eyebrow">Donor profile</p><h1>{name||'Donor not provided'}</h1><p>This profile groups records by the donor name exactly as supplied in the CSV.</p><div className="profile-stats"><div><span>Total recorded</span><strong>{formatMoney(total)}</strong></div><div><span>Donations</span><strong>{data.length}</strong></div><div><span>Most recent</span><strong>{formatDate(latest)}</strong></div></div></div></section><section className="page-content wrap"><h2 className="profile-heading">All donations from this donor name</h2>{data.length?<DonationTable data={data} onSelect={onSelect} compact/>:<div className="empty">No matching donor records were found.</div>}</section></>}

function About(){return <section className="about-page"><div className="wrap"><p className="eyebrow">Data transparency</p><h1>About this database</h1><p>This site reads <code>public/results.csv</code> included in this project. Records are presented as supplied, with values and UK-format dates standardised for searching and sorting. Empty fields are shown as “Not provided”; no missing donor information is inferred or invented.</p><p>Donor profiles group exact donor-name strings and should not be interpreted as identity verification. The postcode map uses only the initial postcode area and deliberately avoids address-level display.</p><p>This is a neutral tool for exploring the source data. It does not make claims about donors, recipients, or the meaning of any donation beyond what appears in the dataset.</p></div></section>}

export default App
