export interface SicInfo { name:string; codes:string[] }

// Companies House overview pages checked 2 July 2026.
export const sicByCompanyNumber:Record<string,SicInfo>={
  '00293147':{name:'PANTHER SECURITIES P L C',codes:['68100 - Buying and selling of own real estate','68209 - Other letting and operating of own or leased real estate']},
  '00561597':{name:'J.C. BAMFORD EXCAVATORS LIMITED',codes:['28922 - Manufacture of earthmoving equipment']},
  '00653789':{name:'B S EATON LIMITED',codes:['32990 - Other manufacturing not elsewhere classified']},
  '01266162':{name:"UNITED KINGDOM SOTHEBY'S INTERNATIONAL REALTY LIMITED",codes:['68310 - Real estate agencies']},
  '01333237':{name:'RUTTLE PLANT HOLDINGS LIMITED',codes:['70100 - Activities of head offices']},
  '01363570':{name:'TECHTEST LIMITED',codes:['26120 - Manufacture of loaded electronic boards','26309 - Manufacture of communication equipment','26511 - Manufacture of electronic measuring and testing equipment','33130 - Repair of electronic and optical equipment']},
  '01427804':{name:'PREMA PROPERTIES LIMITED',codes:['41100 - Development of building projects','64209 - Activities of other holding companies','64999 - Financial intermediation not elsewhere classified','68100 - Buying and selling of own real estate']},
  '01997495':{name:'CONSOLIDATED PROPERTY WILMSLOW LIMITED',codes:['41100 - Development of building projects','68100 - Buying and selling of own real estate','68209 - Other letting and operating of own or leased real estate']},
  '02155845':{name:'FIRST CORPORATE CONSULTANTS LTD',codes:['82990 - Other business support service activities not elsewhere classified']},
  '02171248':{name:'LOXTON DEVELOPMENTS LIMITED',codes:['68209 - Other letting and operating of own or leased real estate']},
  '02904597':{name:'E.I.R.P LIMITED',codes:['68209 - Other letting and operating of own or leased real estate','70100 - Activities of head offices']},
  '02976538':{name:'TANGERINE HOLDINGS LIMITED',codes:['70100 - Activities of head offices']},
  '03574763':{name:'CONTRACTOR UK LIMITED',codes:['62090 - Other information technology service activities']},
  '04513462':{name:'A.C. WORLDWIDE GROUP LIMITED',codes:['70100 - Activities of head offices']},
  '04586739':{name:'OAKPARK ALARMS SECURITY SERVICES LIMITED',codes:['84240 - Public order and safety activities']},
  '05204672':{name:'INVESTORS IN PRIVATE CAPITAL LIMITED',codes:['82990 - Other business support service activities not elsewhere classified']},
  '05539168':{name:'HEPBURN BIO CARE UK LIMITED',codes:['46750 - Wholesale of chemical products']},
  '05683279':{name:'GOODCARE LIMITED',codes:['68209 - Other letting and operating of own or leased real estate']},
  '05757208':{name:'HEATHROW AIRPORT HOLDINGS LIMITED',codes:['70100 - Activities of head offices']},
  '05925324':{name:'TISUN INVESTMENTS LTD',codes:['66120 - Security and commodity contracts dealing activities']},
  '06009493':{name:'DUNMOORE PROPERTIES LIMITED',codes:['68100 - Buying and selling of own real estate','68209 - Other letting and operating of own or leased real estate']},
  '06067833':{name:'EVANS MANAGEMENT LIMITED',codes:['41100 - Development of building projects']},
  '07364968':{name:'CA KENT LIMITED',codes:['68100 - Buying and selling of own real estate']},
  '07542121':{name:'R20 ADVISORY LIMITED',codes:['70229 - Management consultancy activities other than financial management']},
  '07696967':{name:'CENTURY CAPITAL PARTNERS LIMITED',codes:['82990 - Other business support service activities not elsewhere classified']},
  '08137487':{name:'JB DRAX HONORE (UK) LIMITED',codes:['66220 - Activities of insurance agents and brokers']},
  '08172966':{name:'ALBANY WALK LTD',codes:['96020 - Hairdressing and other beauty treatment']},
  '08331581':{name:'THE CASTLE BUILDING SERVICES ORGANISATION LIMITED',codes:['41201 - Construction of commercial buildings','43210 - Electrical installation','43220 - Plumbing, heat and air-conditioning installation']},
  '08363406':{name:'INTERIOR ARCHITECTURE LANDSCAPE LIMITED',codes:['71112 - Urban planning and landscape architectural activities']},
  '08557765':{name:'VOLARE AVIATION LIMITED',codes:['51102 - Non-scheduled passenger air transport']},
  '08586788':{name:'PAUL MACKINGS CONSULTING LIMITED',codes:['70229 - Management consultancy activities other than financial management']},
  '08823586':{name:'RMB ASSOCIATES LTD',codes:['70229 - Management consultancy activities other than financial management']},
  '09041508':{name:'JUPITER VISUAL COMMUNICATIONS LIMITED',codes:['18129 - Printing not elsewhere classified','31010 - Manufacture of office and shop furniture']},
  '09309294':{name:'LOWRY PROPCO LIMITED',codes:['68209 - Other letting and operating of own or leased real estate']},
  '09363499':{name:'CITY RIVERGATE LTD',codes:['68320 - Management of real estate on a fee or contract basis','77110 - Renting and leasing of cars and light motor vehicles']},
  '09405401':{name:'WINTERBROOK CAPITAL LIMITED',codes:['66300 - Fund management activities']},
  '10073185':{name:'CPG 2016 LIMITED',codes:['68209 - Other letting and operating of own or leased real estate']},
  '10153269':{name:'LONDON AC LIMITED',codes:['43220 - Plumbing, heat and air-conditioning installation']},
  '10893794':{name:'BRITAIN MEANS BUSINESS LTD',codes:['82990 - Other business support service activities not elsewhere classified']},
  '11177145':{name:'LOCAL GOVERNMENT ASSOCIATION',codes:['84110 - General public administration activities','94990 - Activities of other membership organisations','96090 - Other service activities']},
  '11734308':{name:'H.R. SMITH GROUP LIMITED',codes:['64202 - Activities of production holding companies']},
  '12545681':{name:'FK BUILDING LIMITED',codes:['41100 - Development of building projects']},
  '12582946':{name:'NOVA VENTURE HOLDINGS LIMITED',codes:['70100 - Activities of head offices']},
  '14304133':{name:'ATMOSPHERIC STUDIOS LIMITED',codes:['62020 - Information technology consultancy activities']},
  'OC354497':{name:'GREYBULL CAPITAL LLP',codes:[]},
}

export const normaliseCompanyNumber=(raw:string,donorName:string)=>{
  if(donorName.toLowerCase().includes('tisun investments'))return'05925324'
  if(donorName.toLowerCase().includes('oakpark alamrs'))return'04586739'
  return raw.trim().toUpperCase().padStart(8,'0')
}
