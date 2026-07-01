import { useState } from 'react'
import type { Donation } from '../types'
import { formatDate, formatMoney } from '../utils/data'

const coords:Record<string,[number,number]>={NE:[269,302],LS:[232,356],FY:[179,350],PR:[185,367],M:[199,392],WA:[188,400],SK:[207,389],DE:[226,405],ST:[204,418],WS:[220,433],CV:[235,440],HR:[180,439],MK:[250,451],HP:[258,466],OX:[228,466],EN:[270,466],N:[274,481],W:[263,490],WC:[276,492],EC:[284,492],TW:[253,501],SW:[270,503],RG:[242,481],RH:[258,516],SO:[207,517],BH:[189,535]}
const areaOf=(postcode:string)=>postcode.trim().toUpperCase().match(/^([A-Z]{1,2})/)?.[1]||''

export function PostcodeMap({data,onSelect}:{data:Donation[];onSelect:(donation:Donation)=>void}){
  const [hovered,setHovered]=useState<{donation:Donation;area:string}|null>(null)
  const grouped=new Map<string,{count:number,total:number}>(),areaIndex=new Map<string,number>();let unavailable=0
  const plotted=data.flatMap(d=>{const area=areaOf(d.Postcode);if(!area||!coords[area]){unavailable++;return[]}const v=grouped.get(area)||{count:0,total:0};v.count++;v.total+=d.amount;grouped.set(area,v);const i=areaIndex.get(area)||0;areaIndex.set(area,i+1);const angle=i*2.399963,r=Math.min(42,4+Math.sqrt(i)*5);const [cx,cy]=coords[area];return[{donation:d,area,x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r}]})
  const items=[...grouped].sort((a,b)=>b[1].total-a[1].total)
  return <div className="map-layout">
    <section className="map-panel uk-map-panel">
      <div className="map-canvas">
        <svg viewBox="0 0 360 600" role="img" aria-label="Map of the United Kingdom showing individual donations at approximate postcode-area locations">
          <g className="uk-land">
            <path d="M205 26l23 9 8 24-10 22 18 19-7 25 17 19-3 31 19 22-8 29 19 31-5 26 13 23-10 27 3 30-18 29 8 35-12 26 19 31-6 24-30 13-28-3-22 14-30-8-18-24-29-8-6-20 16-23-11-20 9-22-13-21 12-26-6-27 18-21-5-26 19-23-2-29 19-19 1-23 18-14-10-25 13-22-3-28 17-23-5-24 14-17-10-19 5-28-15-16 8-27-12-19 15-22-7-24 18-12 3-23 20-11 9 12 21-5 9-22 21-8 16 14 20-3 9-20 20-7 18 12 17-6 6-22 19-8 18 11 18-3 7-22 18-7 16 14z"/>
            <path d="M72 329l23-12 23 7 7 21-12 19-3 23-22 8-22-13-4-23z"/>
            <path d="M160 74l-12-8-6-17 13-12 12 9zM183 43l-8-13 10-14 13 7-2 16zM119 153l-17-7-5-17 15-8 14 12z"/>
          </g>
          {plotted.map(p=><g key={p.donation.id} className="donation-marker" role="button" tabIndex={0} aria-label={`${p.donation.DonorName||'Donor not provided'}, ${formatMoney(p.donation.amount)}, ${p.area} postcode area`} onMouseEnter={()=>setHovered({donation:p.donation,area:p.area})} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered({donation:p.donation,area:p.area})} onBlur={()=>setHovered(null)} onClick={()=>onSelect(p.donation)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p.donation)}}}><circle cx={p.x} cy={p.y} r="4"/><circle className="marker-hit" cx={p.x} cy={p.y} r="5.5"/></g>)}
        </svg>
        <div className={`map-tooltip ${hovered?'visible':''}`} aria-live="polite">{hovered?<><p>{hovered.area} postcode area</p><strong>{hovered.donation.DonorName||'Donor not provided'}</strong><b>{formatMoney(hovered.donation.amount)}</b><span>{formatDate(hovered.donation.acceptedDate)} · {hovered.donation.DonationType||'Type not provided'}</span><small>Click to view the full donation record</small></>:<><strong>Explore the map</strong><span>Hover over or focus a dot to see a donation.</span></>}</div>
      </div>
      <div className="map-legend"><span><i/> Individual donation</span><p>Markers are spread around broad postcode-area centres to prevent overlap. They do not represent exact addresses.</p></div>
    </section>
    <section className="panel area-ranking"><h2>Postcode areas</h2><div>{items.map(([area,v])=><article key={area}><strong>{area}</strong><span>{v.count} donation{v.count===1?'':'s'}</span><b>{formatMoney(v.total)}</b></article>)}</div><p>{unavailable.toLocaleString()} records do not contain a usable postcode area and are excluded from the map.</p></section>
  </div>
}
