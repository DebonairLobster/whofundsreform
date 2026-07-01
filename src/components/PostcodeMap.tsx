import type { Donation } from '../types'
import { formatMoney } from '../utils/data'

const coords:Record<string,[number,number]>={NE:[65,20],LS:[55,34],FY:[43,35],PR:[43,39],M:[48,45],WA:[44,47],SK:[52,47],DE:[57,50],ST:[51,54],WS:[55,57],CV:[59,60],HR:[48,63],MK:[64,64],HP:[66,68],OX:[60,68],EN:[69,70],N:[70,73],W:[68,76],WC:[71,75],EC:[73,75],TW:[65,78],SW:[70,79],RG:[64,73],RH:[68,82],SO:[58,80],BH:[58,86]}
const areaOf=(postcode:string)=>postcode.trim().toUpperCase().match(/^([A-Z]{1,2})/)?.[1]||''

export function PostcodeMap({data}:{data:Donation[]}){
  const grouped=new Map<string,{count:number,total:number}>();let unavailable=0
  data.forEach(d=>{const area=areaOf(d.Postcode);if(!area||!coords[area]){unavailable++;return}const v=grouped.get(area)||{count:0,total:0};v.count++;v.total+=d.amount;grouped.set(area,v)})
  const items=[...grouped].sort((a,b)=>b[1].total-a[1].total),max=Math.max(...items.map(x=>x[1].total),1)
  return <div className="map-layout"><section className="map-panel"><svg viewBox="0 0 100 100" role="img" aria-label="Schematic map of donation totals by postcode area"><path className="uk-shape" d="M52 5l12 6 2 11-7 12 3 12 9 12-1 10 9 11-5 13-17 3-12-9 1-14-7-11 6-13-2-15 8-10z"/>{items.map(([area,v])=>{const [x,y]=coords[area],r=2.3+Math.sqrt(v.total/max)*7;return <g key={area} className="map-dot"><circle cx={x} cy={y} r={r}/><text x={x} y={y+.8}>{area}</text><title>{area}: {formatMoney(v.total)} across {v.count} records</title></g>})}</svg><p className="map-note">Schematic locations only. Circles represent postcode areas, not exact donor addresses.</p></section><section className="panel area-ranking"><h2>Postcode areas</h2><div>{items.map(([area,v])=><article key={area}><strong>{area}</strong><span>{v.count} donation{v.count===1?'':'s'}</span><b>{formatMoney(v.total)}</b></article>)}</div><p>{unavailable.toLocaleString()} records do not contain a usable postcode area and are excluded from the map.</p></section></div>
}
