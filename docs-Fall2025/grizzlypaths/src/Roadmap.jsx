import React,{useMemo,useRef,useState,useEffect}from"react";
import Papa from"papaparse";

/* ========== tiny helpers ========== */
const norm=s=>String(s||"").toLowerCase().replace(/[^a-z0-9+/#.\s-]/g," ").replace(/\s+/g," ").trim();
const split=v=>String(v||"").split(/[,;|/]/).map(s=>s.trim()).filter(Boolean);
const uniq=a=>Array.from(new Set(a));
const looksTech=s=>/\b(software|developer|engineer|front-?end|back-?end|full\s*stack|web|mobile|react|angular|vue|java(script)?|python|cloud|security|data|devops|sre|qa|sdet|network|database|sql|ui|ux|design|figma|graphic|visual|content|brand|motion|multimedia|video)\b/i.test(s);
const nonEng=s=>/[^\x00-\x7F]/.test(s);
const hasAny=(t,arr=[])=>{const x=norm(t);return arr.some(w=>x.includes(norm(w)));};

/* ========== skills extract ========== */
const KNOWN=["JavaScript","TypeScript","React","HTML","CSS","Node","Express","Python","Pandas","NumPy","Scikit-learn","TensorFlow","PyTorch","Java","C++","C#","SQL","NoSQL","PostgreSQL","MongoDB","Linux","Git","Docker","Kubernetes","CI/CD","AWS","Azure","GCP","Networking","Security","Ethical Hacking","Incident Response","ETL","Data Analysis","Machine Learning","Statistics","UX","UI","Figma"];
const getSkills=x=>{
  if(typeof x==="string"){
    const t=x.toLowerCase(),out=[]; KNOWN.forEach(k=>{const rx=new RegExp(`\\b${k.toLowerCase().replace(/[.+*?^${}()|[\]\\]/g,"\\$&")}\\b`,"i"); if(rx.test(t)) out.push(k);});
    return uniq(out);
  }
  const j=x||{},from=j.skills||j.job_skills||j.required_skills||j.skill_list||j.keywords;
  let s=split(from);
  if(!s.length){
    const t=`${j.job_title||""} ${j.job_description||""}`.toLowerCase();
    KNOWN.forEach(k=>{const rx=new RegExp(`\\b${k.toLowerCase().replace(/[.+*?^${}()|[\]\\]/g,"\\$&")}\\b`,"i"); if(rx.test(t)) s.push(k);});
  }
  const seen=new Set(); return s.filter(v=>{const k=String(v).toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true;});
};

/* ========== role  ========== */
const inferRole=(title="",desc="")=>{
  const t=norm(`${title} ${desc}`), has=(...w)=>w.some(x=>t.includes(norm(x)));
  if(has("soc","siem","pentest","security","threat","iam","incident","vulnerability","network")) return "sec";
  if(has("data scientist","data science","ml engineer","machine learning","analytics","bi","pandas","numpy","sql","etl","tableau","power bi")) return "dsa";
  if(has("android","ios","flutter","react native","mobile app")) return "mobile";
  if(has("frontend","front-end","react","vue","angular","html","css","ui/ux","web developer","web designer")) return "web";
  if(has("backend","back-end","api","node","spring","django",".net","server","microservice","software engineer","software developer","fullstack","full-stack")) return "sd";
  if(has("qa engineer","sdet","test automation","qa analyst")) return "qa";
  if(has("dba","database administrator","database engineer","warehouse")) return "db";
  if(has("devops","sre","cloud","docker","kubernetes","terraform","aws","azure","gcp","ci/cd")) return "cloud";
  if(has("system admin","help desk","it support","network admin","sysadmin")) return "it";
  if(has("project manager","scrum master","product owner","program manager","business analyst")) return "pm";
  return "sd";
};
const ROLE_DEFAULT={
  sd:["JavaScript","Node","Git","SQL","Linux"],
  web:["HTML","CSS","React","JavaScript","Git"],
  mobile:["Android","iOS","Flutter","React Native","Git"],
  qa:["Selenium","Cypress","JUnit","CI/CD","Git"],
  dsa:["Python","Pandas","SQL","Machine Learning","Statistics"],
  sec:["Security","Networking","SIEM","Incident Response","Ethical Hacking"],
  db:["SQL","PostgreSQL","MongoDB","ETL","Data Analysis"],
  cloud:["AWS","Docker","Kubernetes","CI/CD","Linux"],
  it:["Networking","Linux","Windows","Scripting","Troubleshooting"],
  pm:["SQL","Data Analysis","CI/CD","Networking","Linux"]
};

/* ========== soft skills ========== */
const SOFT=[[ "communication","Communication"],["team","Teamwork"],["collaborat","Collaboration"],["problem","Problem solving"],["analytic","Analytical thinking"],["lead","Leadership"],["time","Time management"],["organizat","Organization"],["adapt","Adaptability"],["detail","Attention to detail"],["critical","Critical thinking"],["stakeholder","Stakeholder management"],["present","Presentation"],["document","Documentation"],["mentor","Mentorship"]];
const softFrom=t=>{const x=norm(t||""),out=new Set(); SOFT.forEach(([n,l])=>{if(x.includes(n)) out.add(l);}); return [...(out.size?out:new Set(["Communication","Teamwork","Problem solving","Time management","Adaptability"]))].slice(0,5);};

/* ========== CSVs ========== */
const JOBS_CSV="https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Spring2025/final_files/merged_jobs_cleaned%20(6).csv";
function useCourseMaps(){
  const [name,setName]=useState({}),[skills,setSkills]=useState({}),[loading,setL]=useState(true),[err,setE]=useState("");
  useEffect(()=>{(async()=>{
    try{
      const r=await fetch("https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Fall2025/grizzlypaths/src/Component/Course.csv");
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const text=(await r.text()).trim(), head=text.match(/^\s*COURSE_NUMBER\s*,\s*COURSE_NAME\s*,\s*COURSE_SKILLS\s*/i); if(!head) throw new Error("Missing headers");
      const rx=/\s*"*"{0,1}([A-Z]{4}\s*\d{4}[A-Z]?)"*"{0,1}\s*,\s*([^,]+?)\s*,\s*("?\[[^\]]*\]"?)/g; let m, n={}, s={};
      while((m=rx.exec(text.slice(head[0].length)))){
        const code=m[1].trim(), nm=m[2].trim();
        let raw=m[3].trim().replace(/^"|\s*"$/g,"").replace(/""/g,'"').replace(/,\s*\]/g,"]"), arr=[];
        try{const p=JSON.parse(raw); if(Array.isArray(p)) arr=p.map(z=>String(z).trim()).filter(Boolean);}
        catch{arr=raw.replace(/^\[|\]$/g,"").split(/[,;|]/).map(z=>z.replace(/["']/g,"").trim()).filter(Boolean);}
        n[code]=nm; s[code]=arr;
      }
      setName(n); setSkills(s);
    }catch(e){setE(String(e.message||e));}finally{setL(false);}
  })()},[]);
  return { courseName:name, courseSkills:skills, loading, err };
}
function useJobsCSV(url=JOBS_CSV){
  const [jobs,setJobs]=useState([]),[loading,setL]=useState(true),[err,setE]=useState("");
  useEffect(()=>{let off=false;(async()=>{
    try{
      const res=await fetch(url); if(!res.ok) throw new Error(`HTTP ${res.status}`); const text=await res.text();
      Papa.parse(text,{header:true,skipEmptyLines:true,complete:r=>{
        if(off) return;
        const pick=(row,keys)=>{for(const c of keys){const k=Object.keys(row).find(k0=>k0===c||k0.toLowerCase()===c.toLowerCase()); if(k&&String(row[k]).trim()!=="") return row[k];} return "";};
        const mapped=(Array.isArray(r.data)?r.data:[]).map(x=>{
          const title=String(pick(x,["job_title","title","Job Title","Position","role","Role"])||"").trim();
          const company=String(pick(x,["company_name","company","Company","employer"])||"").trim();
          const desc=String(pick(x,["job_description","description","Job Description","desc"])||"").trim();
          const type=String(pick(x,["job_type","type","employment_type","Employment Type"])||"").trim();
          const level=String(pick(x,["job_seniority_level","seniority","level","Seniority"])||"").trim();
          const skillsRaw=pick(x,["skills","job_skills","required_skills","skill_list","keywords","Keywords","top_skills"]);
          const skill_list=skillsRaw?split(skillsRaw):getSkills(`${title} ${desc}`);
          const _role=String(pick(x,["_role","role_bucket","role_group"])||"").trim()||inferRole(title,desc);
          return {job_title:title,company_name:company,job_description:desc,job_type:type,job_seniority_level:level,skills:skill_list,_role};
        }).filter(j=>j.job_title||j.job_description);
        setJobs(mapped);
      },error:e=>{if(!off) setE(String(e?.message||e));}});
    }catch(e){if(!off) setE(String(e?.message||e));}finally{if(!off) setL(false);}
  })(); return()=>{off=true}},[url]);
  return { jobs, loading, err };
}

/* ========== majors ========== */
const MAJORS=[
  {id:"sw", label:"Software Development", roles:["sd","web","mobile","qa"], keywords:["software","developer","engineer","frontend","backend","fullstack","web","mobile","ui","ux","qa","test"]},
  {id:"ds", label:"Data Science & Analytics", roles:["dsa"], keywords:["data","analytics","scientist","bi","ml","ai","etl","python","pandas","sql","tableau","power bi"]},
  {id:"es", label:"Enterprise Systems", roles:["db","cloud","it","pm"], keywords:["enterprise","erp","sap","salesforce","database","dba","it","sysadmin","sre","cloud","pm","ba"]},
  {id:"sec",label:"Systems Security", roles:["sec"], keywords:["security","soc","pentest","iam","incident","siem","threat","vulnerability","network"]},
  {id:"dm", label:"Digital Media", roles:["web","sd"], keywords:["digital","media","design","ui","ux","graphics","content","video","figma","product designer","visual","web designer","motion","multimedia"]},
];
const EXCLUDES={
  sw:{titles:["développeur php fullstack","systemutvecklare","travel ct tech","travel ultrasound tech","travel certified or tech"],companies:["aya healthcare"]},
  dm:{titles:["développeur php fullstack","systemutvecklare","travel ct tech","travel ultrasound tech","travel certified or tech"],companies:["aya healthcare"]},
  es:{titles:["travel ct tech","travel ultrasound tech","travel certified or tech","développeur php fullstack","systemutvecklare"],companies:["aya healthcare"]},
};
const DM_INC=/\b(ui|ux|designer|product\s*designer|visual|graphic|web\s*designer|interaction|experience|design|figma|content\s*designer|branding|brand|motion|multimedia|video\s*editor)\b/i;
const DM_REJ=/\b(engineer|developer|analyst|qa|sdet|scientist)\b/i;
const ALLOW={
  sw:(_t,w)=>/\b(software|developer|engineer|frontend|front-?end|backend|back-?end|full\s*stack|react|node|java(script)?|\.net|spring)\b/i.test(w),
  dm:(t)=>DM_INC.test(t)&&!DM_REJ.test(t)&&(/intern/i.test(t)?/(design|designer|ux|ui)/i.test(t):true),
  es:(_t,w)=>/\b(erp|sap|salesforce|oracle|netsuite|dynamics|servicenow|sharepoint|crm|workday|sysadmin|network (admin|engineer)|it support|help desk|sre|cloud (engineer|architect)|aws|azure|gcp|devops|database administrator|dba|data warehouse|etl|project manager|program manager|product owner|business analyst|solutions architect)\b/i.test(w)
};

/* ========== UI ========== */
const Card=({title,info,backText,onToggle,isFlipped=false})=>(
  <div className="card" onClick={()=>onToggle&&onToggle()} title={typeof title==="string"?title:undefined}>
    <div className={`inner ${isFlipped?"flip":""}`}>
      <div className="face front"><div className="title">{title}</div><div className="sub">{info||" "}</div><div className="pill">click to flip</div></div>
      <div className="face back">{backText||"No description provided."}</div>
    </div>
  </div>
);
const CourseCard=({code,name,skills})=>{const[flip,setFlip]=useState(false);return <Card title={`${code} — ${name}`} backText={skills?.length?`Skills: ${skills.join(" • ")}`:"No listed skills."} isFlipped={flip} onToggle={()=>setFlip(f=>!f)} />;};

const score=(job,major)=>{
  const d=String(job.job_description||""), k=(major?.keywords||[]).map(norm), t=norm(`${job.job_title||""} ${d}`), s=getSkills(job);
  let hits=0; k.forEach(x=>{if(t.includes(x)) hits++}); return hits*1.6 + Math.min(d.length,3500)/3500 + Math.min(s.length,15)/15;
};

/* ========== component ========== */
export default function Roadmap({onBack}){
  const {courseName,courseSkills,loading:cLoad,err:cErr}=useCourseMaps();
  const {jobs:JOBS,loading:jLoad,err:jErr}=useJobsCSV();

  const[majorId,setMajor]=useState(null),[active,setActive]=useState(null),[sel,setSel]=useState(null);
  const[showHard,setHard]=useState(false),[showSoft,setSoft]=useState(false);
  const skillsRef=useRef(null);

  const top5Jobs=useMemo(()=>{
    const m=MAJORS.find(x=>x.id===majorId); if(!m) return [];
    const ex=EXCLUDES[m.id]||{titles:[],companies:[]}, allow=ALLOW[m.id]||(()=>true), seen=new Set(), pool=[];
    for(const j of JOBS){
      if(!m.roles.includes(String(j._role))) continue;
      const title=String(j.job_title||""), comp=String(j.company_name||""), desc=String(j.job_description||""), whole=`${title} ${desc}`;
      if(hasAny(title,ex.titles)||hasAny(comp,ex.companies)) continue;
      if(nonEng(title)||!looksTech(whole)||!allow(title,whole)) continue;
      const key=[norm(title),norm(comp),norm(desc.slice(0,220))].join("|"); if(seen.has(key)) continue; seen.add(key);
      pool.push(j);
    }
    let picked=pool.map(j=>({j,score:score(j,m)})).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.j);
    const hasDup=(arr,j)=>arr.some(p=>[norm(p.job_title),norm(p.company_name),norm(String(p.job_description||"").slice(0,220))].join("|")=== [norm(j.job_title),norm(j.company_name),norm(String(j.job_description||"").slice(0,220))].join("|"));
    const need=()=>picked.length<5, tryAdd=cands=>{for(const x of cands){if(picked.length>=5)break;if(!hasDup(picked,x.j))picked.push(x.j)}};

    if(["dm","es"].includes(m.id)&&need()){
      const tier1=[]; for(const j of JOBS){
        if(!m.roles.includes(String(j._role))) continue;
        const t=String(j.job_title||""),c=String(j.company_name||""),d=String(j.job_description||""),w=`${t} ${d}`;
        if(hasAny(t,ex.titles)||hasAny(c,ex.companies)||nonEng(t)||!looksTech(w)||!allow(t,w)||hasDup(picked,j)) continue;
        tier1.push({j,score:score(j,m)});
      }
      tier1.sort((a,b)=>b.score-a.score); tryAdd(tier1);
    }
    if(["dm","es"].includes(m.id)&&need()){
      const tier2=[]; for(const j of JOBS){
        const t=String(j.job_title||""),c=String(j.company_name||""),d=String(j.job_description||""),w=`${t} ${d}`, tt=norm(w);
        if(hasAny(t,ex.titles)||hasAny(c,ex.companies)||nonEng(t)||!looksTech(w)||!allow(t,w)||hasDup(picked,j)) continue;
        const kwHit=(m.keywords||[]).some(k=>tt.includes(norm(k))); if(!kwHit) continue;
        tier2.push({j,score:score(j,m)});
      }
      tier2.sort((a,b)=>b.score-a.score); tryAdd(tier2);
    }
    if(need()){
      const tier3=[]; for(const j of JOBS){
        const t=String(j.job_title||""),c=String(j.company_name||""),d=String(j.job_description||""),w=`${t} ${d}`;
        if(hasAny(t,ex.titles)||hasAny(c,ex.companies)||nonEng(t)||!looksTech(w)||(["dm","es"].includes(m.id)&&!(ALLOW[m.id]||(()=>true))(t,w))||hasDup(picked,j)) continue;
        tier3.push({j,score:score(j,m)});
      }
      tier3.sort((a,b)=>b.score-a.score); tryAdd(tier3);
    }
    return picked.slice(0,5);
  },[majorId,JOBS]);

  const selected = sel!=null && top5Jobs[sel] ? top5Jobs[sel] : null;

  /*HARD skills */
  const hardSkills=useMemo(()=>{
    if(!selected) return [];
    const ttl=(selected.job_title||"").trim(), peers=top5Jobs.filter(j=>(j.job_title||"").trim()===ttl);
    const cnt=new Map(); peers.forEach(j=>getSkills(j).forEach(s=>cnt.set(s,(cnt.get(s)||0)+1)));
    let base=[...cnt.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([s])=>s);
    if(!base.length) base=getSkills(selected);
    const role=selected._role||inferRole(selected.job_title||"",selected.job_description||"");
    return uniq([...(base||[]),...((ROLE_DEFAULT[role]||ROLE_DEFAULT.sd))]).slice(0,5);
  },[selected,top5Jobs]);

  const softSkills=useMemo(()=>{
    if(!selected) return [];
    return softFrom(top5Jobs.map(j=>j.job_description||"").join("\n")).slice(0,5);
  },[selected,top5Jobs]);

  /* courses */
  const courses=useMemo(()=>{
    if(!selected) return [];
    const jt=norm(`${selected.job_title||""} ${selected.job_description||""}`), hs=new Set(hardSkills.map(norm));
    const codes=Object.keys(courseName);
    const scored=codes.map(code=>{
      const nm=courseName[code]||"", sk=(courseSkills[code]||[]).map(norm);
      let sc=0; sk.forEach(s=>{if(hs.has(s)) sc+=3; if(jt.includes(s)) sc+=1;});
      const nmN=norm(nm); hardSkills.forEach(h=>{if(nmN.includes(norm(h))) sc+=0.5;});
      return {code,sc};
    }).sort((a,b)=>b.sc-a.sc);
    const top=scored.filter(s=>s.sc>0).slice(0,5).map(s=>s.code);
    return top.length?top:scored.slice(0,5).map(s=>s.code);
  },[selected,hardSkills,courseName,courseSkills]);

  return (
    <div>
      <style>{css}</style>
      <header className="mb-4 position-relative">
        <h1 className="position-absolute top-50 start-50 translate-middle m-0">Information Technology Roadmap</h1>
        <div className="d-flex justify-content-end"><button onClick={onBack} className="btn btn-outline-primary">← Dashboard</button></div>
      </header>

      <div className="wrap">
        <section className="stage">
          {(cErr||jErr)&&<div className="error">Load error: {cErr||jErr}</div>}
          {(cLoad||jLoad)&&<div className="hint">Loading data…</div>}

          <h2>Choose a Major</h2>
          <div className="grid">
            {MAJORS.map(m=>(
              <Card key={m.id} title={m.label} backText={`Select ${m.label}`} isFlipped={majorId===m.id}
                onToggle={()=>{if(majorId===m.id){setMajor(null);setActive(null);setSel(null);setHard(false);setSoft(false);}else{setMajor(m.id);setActive(null);setSel(null);setHard(false);setSoft(false);}}}
              />
            ))}
          </div>

          {majorId&&(
            <>
              <h2 style={{marginTop:16}}>Jobs</h2>
              <div className="hint">Flip a job to read its description. Clicking also selects it to show skills & courses.</div>
              <div className="grid">
                {top5Jobs.map((j,i)=>(
                  <Card key={`job-${i}`} isFlipped={active===i}
                    title={j.job_title||"Job"}
                    info={`${j.company_name||"Unknown Company"}${j.job_type?" • "+j.job_type:""}${j.job_seniority_level?" • "+j.job_seniority_level:""}`}
                    backText={String(j.job_description||"No description provided.")}
                    onToggle={()=>{setActive(c=>c===i?null:i);setSel(i);setTimeout(()=>skillsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),10);}}
                  />
                ))}
                {top5Jobs.length===0&&<Card title="No jobs available" info="Try another major" />}
              </div>
            </>
          )}

          {selected&&(
            <>
              <h2 ref={skillsRef} style={{marginTop:18}}>Skills for “{selected.job_title}”</h2>
              <div className="toggleRow">
                <button className="chipBtn" onClick={()=>setHard(v=>!v)}>{showHard?"− Hide Hard Skills":"+ Show Hard Skills"}</button>
                <button className="chipBtn" onClick={()=>setSoft(v=>!v)}>{showSoft?"− Hide Soft Skills":"+ Show Soft Skills"}</button>
              </div>

              {showHard&&<div className="grid mt8">{hardSkills.map(h=><Card key={`hs-${h}`} title={h.toUpperCase()} info=" " backText={`Skill: ${h}`} onToggle={()=>{}} />)}</div>}
              {showSoft&&<div className="grid mt8">{softSkills.map(s=><Card key={`ss-${s}`} title={s} info="" backText={`Soft skill: ${s}`} onToggle={()=>{}} />)}</div>}

              <h2 style={{marginTop:18}}>Courses that teach these skills</h2>
              <div className="grid">{courses.map(c=><CourseCard key={c} code={c} name={courseName[c]||"Course"} skills={courseSkills[c]||[]} />)}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* ========== CSS ========== */
const css=`
:root{--primaryButtonColor:#FF0000;--primaryButtonRadius:12px;--primaryButtonHover:darkred;--primaryButtonText:white}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:linear-gradient(to right,#36d352,#ace5bc);min-height:100vh;color:#163b20}
header{padding:18px 20px;text-align:center}
h1{margin:0;font-size:22px}
.wrap{max-width:1100px;margin:0 auto;padding:0 16px 28px}
.stage{background:#fff;border:1px solid #000;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,.08);padding:16px}
.hint{font-size:12px;color:#2b6a41;margin:4px 2px 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.card{perspective:1000px;cursor:pointer}
.inner{position:relative;width:100%;height:160px;transform-style:preserve-3d;transition:transform .3s ease}
.inner.flip{transform:rotateY(180deg)}
.face{position:absolute;inset:0;background:#fff;border:1px solid #000;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px 12px;backface-visibility:hidden;box-shadow:0 5px 15px rgba(0,0,0,.05);overflow:auto}
.front:hover{box-shadow:0 0 0 3px rgba(0,0,0,.10)}
.back{transform:rotateY(180deg);font-size:12.5px;color:#2b6a41;overflow:auto;text-align:left;padding:14px 16px;line-height:1.45;white-space:pre-wrap}
.title{font-weight:700;line-height:1.2;overflow-wrap:anywhere;font-size:clamp(12px,1.8vw,16px);max-height:3.6em}
.sub{font-size:clamp(11px,1.5vw,13px);color:#2b6a41;margin-top:6px;line-height:1.2;overflow-wrap:anywhere;max-height:2.6em}
.pill{margin-top:8px;font-size:11px;padding:3px 8px;border-radius:999px;border:1px solid #000;color:#2b6a41}
.error{font-size:13px;color:#a31d1d;background:#fff3f3;border:1px solid #ffcccc;padding:10px;border-radius:8px}
h2{margin:12px 0 6px;font-size:18px}
.toggleRow{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
.chipBtn{border:1px solid #000;background:#fff;border-radius:14px;padding:8px 12px;font-weight:700;cursor:pointer}
.chipBtn:hover{box-shadow:0 0 0 3px rgba(0,0,0,.10)}
.mt8{margin-top:8px}
@media (max-width:600px){.grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));}}
`;
