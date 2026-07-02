import { useMemo, useState } from 'react'
import { geoContains, geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-50m.json'
import type { Donation } from '../types'
import { formatDate, formatMoney } from '../utils/data'

// Approximate postcode-area centres. Only the area prefix is used—not full postcodes.
const areaCentres:Record<string,[number,number]>={NE:[-1.61,54.98],LS:[-1.55,53.8],FY:[-3.03,53.82],PR:[-2.7,53.76],M:[-2.24,53.48],WA:[-2.59,53.39],SK:[-2.15,53.25],DE:[-1.47,52.92],ST:[-2.18,52.99],WS:[-1.98,52.58],CV:[-1.51,52.41],HR:[-2.72,52.06],MK:[-0.76,52.04],HP:[-0.61,51.75],OX:[-1.26,51.75],EN:[-0.08,51.65],N:[-0.11,51.58],W:[-0.22,51.51],WC:[-0.12,51.52],EC:[-0.09,51.52],TW:[-0.33,51.45],SW:[-0.17,51.47],RG:[-0.97,51.45],RH:[-0.17,51.14],SO:[-1.4,50.91],BH:[-1.88,50.72]}
const areaOf=(postcode:string)=>postcode.trim().toUpperCase().match(/^([A-Z]{1,2})/)?.[1]||''

export function PostcodeMap({data,onSelect}:{data:Donation[];onSelect:(donation:Donation)=>void}){
  const [hovered,setHovered]=useState<{donation:Donation;area:string}|null>(null)
  const [selectedArea,setSelectedArea]=useState<string|null>(null)
  const map=useMemo(()=>{
    const topology=world as unknown as {objects:{countries:{geometries:Array<{id:string|number}>}}}
    const ukGeometry=topology.objects.countries.geometries.find(g=>String(g.id)==='826')!
    const uk=feature(world as never,ukGeometry as never) as unknown as GeoJSON.Feature
    const projection=geoMercator().fitExtent([[28,20],[332,580]],uk)
    const outline=geoPath(projection)(uk)||''
    const grouped=new Map<string,{count:number,total:number}>(),areaIndex=new Map<string,number>();let unavailable=0
    const plotted=data.flatMap(d=>{
      const area=areaOf(d.Postcode),centre=areaCentres[area]
      if(!area||!centre){unavailable++;return[]}
      const summary=grouped.get(area)||{count:0,total:0};summary.count++;summary.total+=d.amount;grouped.set(area,summary)
      const i=areaIndex.get(area)||0;areaIndex.set(area,i+1)
      const base=projection(centre)!;const angle=i*2.399963;let radius=Math.min(38,3+Math.sqrt(i)*4.5)
      let point:[number,number]=[base[0]+Math.cos(angle)*radius,base[1]+Math.sin(angle)*radius]
      while(radius>.5){const lonLat=projection.invert!(point);if(lonLat&&geoContains(uk,lonLat))break;radius*=.65;point=[base[0]+Math.cos(angle)*radius,base[1]+Math.sin(angle)*radius]}
      return[{donation:d,area,x:point[0],y:point[1]}]
    })
    return{outline,plotted,items:[...grouped].sort((a,b)=>b[1].total-a[1].total),unavailable}
  },[data])

  const selectedDonations=selectedArea?map.plotted.filter(p=>p.area===selectedArea).map(p=>p.donation):[]
  const selectArea=(area:string)=>{setSelectedArea(area);setHovered(null)}

  return <div className="map-layout">
    <section className="map-panel uk-map-panel">
      <div className="map-canvas">
        <svg viewBox="0 0 360 600" role="img" aria-label="Geographic map of the United Kingdom showing individual donations at approximate postcode-area locations">
          <path className="uk-boundary" d={map.outline}/>
          {map.plotted.map(p=><g key={p.donation.id} className={`donation-marker ${selectedArea===p.area?'area-selected':''} ${selectedArea&&selectedArea!==p.area?'area-muted':''}`} role="button" tabIndex={0} aria-label={`${p.donation.DonorName||'Donor not provided'}, ${formatMoney(p.donation.amount)}, ${p.area} postcode area`} onMouseEnter={()=>setHovered({donation:p.donation,area:p.area})} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered({donation:p.donation,area:p.area})} onBlur={()=>setHovered(null)} onClick={()=>selectArea(p.area)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectArea(p.area)}}}><circle cx={p.x} cy={p.y} r="4"/><circle className="marker-hit" cx={p.x} cy={p.y} r="5.5"/></g>)}
        </svg>
        <div className={`map-tooltip ${hovered?'visible':''}`} aria-live="polite">{hovered?<><p>{hovered.area} postcode area</p><strong>{hovered.donation.DonorName||'Donor not provided'}</strong><b>{formatMoney(hovered.donation.amount)}</b><span>{formatDate(hovered.donation.acceptedDate)} · {hovered.donation.DonationType||'Type not provided'}</span><small>Click to highlight every donation in this area</small></>:selectedArea?<><p>Selected postcode area</p><strong>{selectedArea}</strong><span>{selectedDonations.length} donation{selectedDonations.length===1?'':'s'} highlighted. Choose one from the list to view its full record.</span></>:<><strong>Explore the map</strong><span>Hover over a dot for details, or click a dot or postcode area to highlight its donations.</span></>}</div>
      </div>
      <div className="map-legend"><span><i/> Individual donation</span><p>Real UK boundary; markers use approximate postcode-area centres and never exact addresses.</p></div>
    </section>
    <section className="panel area-ranking"><div className="area-ranking-head"><h2>{selectedArea?`${selectedArea} donations`:'Postcode areas'}</h2>{selectedArea&&<button type="button" onClick={()=>setSelectedArea(null)}>Show all areas</button>}</div>{selectedArea?<div className="area-donations">{selectedDonations.map(d=><button type="button" key={d.id} onClick={()=>onSelect(d)}><span><strong>{d.DonorName||'Donor not provided'}</strong><small>{formatDate(d.acceptedDate)} · {d.DonationType||'Type not provided'}</small></span><b>{formatMoney(d.amount)}</b></button>)}</div>:<div className="area-list">{map.items.map(([area,v])=><button type="button" key={area} onClick={()=>selectArea(area)}><strong>{area}</strong><span>{v.count} donation{v.count===1?'':'s'}</span><b>{formatMoney(v.total)}</b></button>)}</div>}<p>{map.unavailable.toLocaleString()} records do not contain a usable postcode area and are excluded from the map.</p></section>
  </div>
}
