import React,{useMemo,useRef,useState,useEffect,memo}from"react";
import Papa from"papaparse";

/* ------------ config ------------ */
const TOP_SKILLS=10;          
const MAX_COURSE_SKILLS=TOP_SKILLS;

/* ------------ utils ------------ */
const norm=s=>String(s||"").toLowerCase().replace(/[^a-z0-9+/#.\s-]/g," ").replace(/\s+/g," ").trim();
const split=v=>String(v||"").split(/[,;|/]/).map(s=>s.trim()).filter(Boolean);
const uniq=a=>Array.from(new Set(a));
const escapeRegExp=str=>String(str).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

/* ------------ skill vocab + extract ------------ */
const KNOWN=["JavaScript","TypeScript","React","HTML","CSS","Node","Express","Python","Pandas","NumPy","Scikit-learn","TensorFlow","PyTorch","Java","C++","C#","SQL","NoSQL","PostgreSQL","MongoDB","Linux","Git","Docker","Kubernetes","CI/CD","AWS","Azure","GCP","Networking","Security","Ethical Hacking","Incident Response","ETL","Data Analysis","Machine Learning","Statistics","UX","UI","Figma"];
const getSkillsFromPosting=j=>{
  const explicit=split(j?.skills||j?.job_skills||j?.required_skills||j?.skill_list||j?.keywords);
  const text=`${j?.job_title||""} ${j?.job_description||""}`.toLowerCase();
  const detected=[]; KNOWN.forEach(k=>{const rx=new RegExp(`\\b${escapeRegExp(k.toLowerCase())}\\b`,"i"); if(rx.test(text)) detected.push(k);});
  return uniq([...explicit,...detected]);
};

/* ------------ soft skills ------------ */
const SOFT=[["communication","Communication"],["team","Teamwork"],["collaborat","Collaboration"],["problem","Problem solving"],["analytic","Analytical thinking"],["lead","Leadership"],["time","Time management"],["organizat","Organization"],["adapt","Adaptability"],["detail","Attention to detail"],["critical","Critical thinking"],["stakeholder","Stakeholder management"],["present","Presentation"],["document","Documentation"],["mentor","Mentorship"]];
const softFrom=t=>{const x=norm(t||""),out=new Set(); SOFT.forEach(([n,l])=>{if(x.includes(n)) out.add(l);}); return [...(out.size?out:new Set(["Communication","Teamwork","Problem solving","Time management","Adaptability"]))].slice(0,5);};

/* ------------ CSV ------------ */
const JOBS_CSV="https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Spring2025/final_files/merged_jobs_cleaned%20(6).csv";

function useCourseMaps(){
  const [name,setName]=useState({}),[skills,setSkills]=useState({}),[loading,setL]=useState(true),[err,setE]=useState("");
  useEffect(()=>{(async()=>{
    try{
      const r=await fetch("https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Fall2025/grizzlypaths/src/Component/Course.csv");
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const text=(await r.text()).trim(),head=text.match(/^\s*COURSE_NUMBER\s*,\s*COURSE_NAME\s*,\s*COURSE_SKILLS\s*/i); if(!head) throw new Error("Missing headers");
      const rx=/\s*"*"{0,1}([A-Z]{4}\s*\d{4}[A-Z]?)"*"{0,1}\s*,\s*([^,]+?)\s*,\s*("?\[[^\]]*\]"?)/g; let m,nm={},sk={};
      while((m=rx.exec(text.slice(head[0].length)))){
        const code=m[1].trim(), name=m[2].trim();
        let raw=m[3].trim().replace(/^"|\s*"$/g,"").replace(/""/g,'"').replace(/,\s*\]/g,"]"), arr=[];
        try{const p=JSON.parse(raw); if(Array.isArray(p)) arr=p.map(z=>String(z).trim()).filter(Boolean);}
        catch{arr=raw.replace(/^\[|\]$/g,"").split(/[,;|]/).map(z=>z.replace(/["']/g,"").trim()).filter(Boolean);}
        nm[code]=name; sk[code]=arr;
      }
      setName(nm); setSkills(sk);
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
          const skills=getSkillsFromPosting({job_title:title,job_description:desc,skills:pick(x,["skills","job_skills","required_skills","skill_list","keywords","Keywords","top_skills"])});
          return {job_title:title,company_name:company,job_description:desc,job_type:type,job_seniority_level:level,skills};
        });
        setJobs(mapped);
      },error:e=>{if(!off) setE(String(e?.message||e));}});
    }catch(e){if(!off) setE(String(e?.message||e));}finally{if(!off) setL(false);}
  })(); return()=>{off=true}},[url]);
  return { jobs, loading, err };
}

/* ------------ majors & job types ------------ */
const MAJORS=[
  {id:"sw",label:"Software Development",color:"#6C63FF"},
  {id:"ds",label:"Data Science & Analytics",color:"#3E8EFA"},
  {id:"es",label:"Enterprise Systems",color:"#00B894"},
  {id:"sec",label:"Systems Security",color:"#E17055"},
  {id:"dm",label:"Digital Media",color:"#A55EEA"},
];
const JOB_TYPES={
  sw:["Software Engineer","Software Developer","Project Manager","Cloud","Automation Engineer"],
  ds:["AI","Data Analyst","Product Manager","Data Scientist","Data Engineer"],
  es:["Project Manager","Cloud Engineer","Systems Analyst","Enterprise Architect","Security Analyst"],
  sec:["Systems Analyst","Systems Engineer","Threat Intelligence Analyst","Application Security Engineer","Security Analyst"],
  dm:["Marketing","UI","UX","Web Designer","UX/UI Designer"],
};
const MAP_RULES={
  sw:[["Software Engineer",/\b(software\s*engineer|swe)\b/i],["Software Developer",/\b(software\s*developer|developer(?!.*web)|programmer)\b/i],["Project Manager",/\b(project\s*manager|scrum\s*master|program\s*manager)\b/i],["Cloud",/\b(cloud|aws|azure|gcp|devops|sre|kubernetes|terraform)\b/i],["Automation Engineer",/\b(automation\s*engineer|test\s*automation|qa|sdet)\b/i]],
  ds:[["AI",/\b(ai|machine\s*learning|ml|deep\s*learning|llm|nlp)\b/i],["Data Analyst",/\b(data\s*analyst|bi\s*analyst|business\s*intelligence)\b/i],["Product Manager",/\b(product\s*manager|product\s*owner)\b/i],["Data Scientist",/\b(data\s*scientist)\b/i],["Data Engineer",/\b(data\s*engineer|etl|warehouse|pipelines)\b/i]],
  es:[["Project Manager",/\b(project\s*manager|program\s*manager)\b/i],["Cloud Engineer",/\b(cloud\s*engineer|devops|sre|aws|azure|gcp)\b/i],["Systems Analyst",/\b(systems?\s*analyst|business\s*analyst|ba)\b/i],["Enterprise Architect",/\b(enterprise\s*architect|solutions?\s*architect|soa|architecture)\b/i],["Security Analyst",/\b(security\s*analyst|soc|siem|iam|threat)\b/i]],
  sec:[["Systems Analyst",/\b(systems?\s*analyst|grc|governance|risk|compliance)\b/i],["Systems Engineer",/\b(systems?\s*engineer|security\s*engineer|blue\s*team)\b/i],["Threat Intelligence Analyst",/\b(threat\s*intelligence|ti\s*analyst|threat\s*analyst)\b/i],["Application Security Engineer",/\b(application\s*security|appsec|secure\s*code|sast|dast)\b/i],["Security Analyst",/\b(security\s*analyst|soc|siem|incident|ir|detection)\b/i]],
  dm:[["Marketing",/\b(marketing|brand|content\s*marketing|growth)\b/i],["UI",/\b(ui(?!\/ux)|interface\s*designer)\b/i],["UX",/\b(ux(?!\/ui)|user\s*experience|researcher)\b/i],["Web Designer",/\b(web\s*designer|web\s*design)\b/i],["UX\/UI Designer",/\b(ux\/ui|ui\/ux|product\s*designer)\b/i]],
};

/* ------------ UI atoms  ------------ */
const Card=memo(function Card({title,info,onToggle,isFlipped=false,weight=1,accent}){
  return (
    <div className="card" style={{'--w':weight,'--accent':accent||'#4a7'}} onClick={()=>onToggle&&onToggle()} role="button" aria-label={title}>
      <div className={`inner ${isFlipped?"flip":""}`}>
        <div className="face front"><div className="title">{title}</div><div className="sub">{info||" "}</div></div>
        <div className="face back"></div>
      </div>
    </div>
  );
});
const CourseCard=memo(function CourseCard({code,name,skills}){
  const[flip,setFlip]=useState(false);
  return <Card title={`${code} — ${name}`} onToggle={()=>setFlip(f=>!f)} isFlipped={flip} weight={1} accent="#95a" info={skills?.length?`Skills: ${skills.join(" • ")}`:"No listed skills."} />;
});

/* ------------ scales ------------ */
const scale01=(v,min,max)=> max<=min?1:(v-min)/(max-min);
const toWeightJob=(v,min,max,lo=0.35,hi=3.4)=> lo+(hi-lo)*scale01(v,min,max);
const toWeightSkill=(v,min,max,lo=0.45,hi=2.6)=> lo+(hi-lo)*scale01(v,min,max);

/* ------------ integerize ------------ */
function integerizeCounts(countMap,total){
  const entries=[...countMap.entries()].map(([skill,raw])=>({skill,raw,floor:Math.floor(raw),frac:raw-Math.floor(raw)}));
  let sumFloor=entries.reduce((a,e)=>a+e.floor,0), remain=Math.max(0,total-sumFloor);
  entries.sort((a,b)=> b.frac-b.frac || b.raw-a.raw || a.skill.localeCompare(b.skill));
  for(let i=0;i<remain;i++) if(entries[i]) entries[i].floor+=1;
  return entries.map(e=>({skill:e.skill,count:e.floor})).sort((a,b)=>b.count-a.count||a.skill.localeCompare(b.skill));
}

/* ------------ component ------------ */
export default function Roadmap({onBack}){
  const {courseName,courseSkills,loading:cLoad,err:cErr}=useCourseMaps();
  const {jobs:JOBS,loading:jLoad,err:jErr}=useJobsCSV();
  const[majorId,setMajor]=useState(null),[activeType,setActiveType]=useState(null);
  const jobTypesRef=useRef(null),skillsRef=useRef(null);
  const scrollTo=ref=>ref?.current?.scrollIntoView({behavior:"smooth",block:"start"});

  const mapToType=(mid,title)=>{
    const rules=MAP_RULES[mid]||[];
    for(const [label,rx]of rules) if(rx.test(String(title))) return label;
    const fallback=(JOB_TYPES[mid]||[]).slice(-1)[0];
    return fallback||"Other";
  };

  /* ----- pick allowed top skills & filter postings ----- */
  const summarizeType=(typeId)=>{
    const postingsAll=JOBS.filter(j=>mapToType(majorId,String(j.job_title||""))===typeId);
    const rawAll=new Map();
    const postingsWithAny=postingsAll.filter(j=>{
      const s=getSkillsFromPosting(j); if(!s.length) return false;
      const w=1/s.length; s.forEach(k=>rawAll.set(k,(rawAll.get(k)||0)+w)); return true;
    });
    const allowed=[...rawAll.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,TOP_SKILLS).map(([k])=>k);
    const allowSet=new Set(allowed);
    const postingsKept=postingsWithAny.filter(j=>getSkillsFromPosting(j).some(s=>allowSet.has(s)));
    const rawAllowed=new Map();
    postingsKept.forEach(j=>{
      const s=getSkillsFromPosting(j).filter(x=>allowSet.has(x));
      const w=1/s.length; s.forEach(k=>rawAllowed.set(k,(rawAllowed.get(k)||0)+w));
    });
    const intList=integerizeCounts(rawAllowed,postingsKept.length);
    return {allowed, postings:postingsKept, intList};
  };

  /* ----- job type cards: counts based on filtered postings that match  ----- */
  const bucketCounts=useMemo(()=>{
    if(!majorId) return [];
    const types=JOB_TYPES[majorId]||[];
    const rows=types.map(label=>{
      const {postings}=summarizeType(label);
      return [label, postings.length];
    });
    const min=rows.length?Math.min(...rows.map(r=>r[1])):1, max=rows.length?Math.max(...rows.map(r=>r[1])):1;
    return rows.map(([label,count])=>({label,count,weight:toWeightJob(count,min,max)}));
  },[majorId,JOBS]);

  /* ----- skills for active type ----- */
  const typeSkills=useMemo(()=>{
    if(!activeType||!majorId) return {ordered:[],counts:new Map(),postings:0,allowed:new Set()};
    const {allowed,postings,intList}=summarizeType(activeType);
    return {
      ordered:intList.map(e=>e.skill),
      counts:new Map(intList.map(e=>[e.skill,e.count])),
      postings:postings.length,
      allowed:new Set(allowed)
    };
  },[activeType,majorId,JOBS]);

  const hardWeights=useMemo(()=>{
    const skills=typeSkills.ordered,counts=skills.map(s=>typeSkills.counts.get(s)||0);
    const min=Math.min(...(counts.length?counts:[1])),max=Math.max(...(counts.length?counts:[1]));
    return skills.map(s=>{const c=typeSkills.counts.get(s)||0; return {skill:s,count:c,weight:toWeightSkill(c,min,max)};});
  },[typeSkills]);

  /* ----- soft skills  ----- */
  const softSkills=useMemo(()=>{
    const desc=JOBS.filter(j=>activeType?mapToType(majorId,String(j.job_title||""))===activeType:true).map(j=>j.job_description||"").join("\n");
    return softFrom(desc).slice(0,5);
  },[activeType,majorId,JOBS]);

  /* ----- courses:skills; cap skills listed ----- */
  const courses=useMemo(()=>{
    const allowed=typeSkills.allowed; if(!allowed.size) return [];
    const codes=Object.keys(courseName);
    const scored=codes.map(code=>{
      const courseSkillNorm=(courseSkills[code]||[]).map(norm);
      const overlap=courseSkillNorm.filter(s=>allowed.has(KNOWN.find(k=>norm(k)===s)||"__none__"));
      return {code,overlap};
    }).filter(x=>x.overlap.length>0);
    scored.sort((a,b)=>b.overlap.length-a.overlap.length||a.code.localeCompare(b.code));
    return scored.slice(0,5).map(x=>x.code);
  },[typeSkills,courseName,courseSkills]);

  useEffect(()=>{setActiveType(null); if(majorId) setTimeout(()=>scrollTo(jobTypesRef),50);},[majorId]);

  const accent=MAJORS.find(m=>m.id===majorId)?.color||"#4a7";

  return(
    <div>
      <style>{GLOBAL_CSS}</style>
      <header className="mb-4 position-relative">
        <h1 className="position-absolute top-50 start-50 translate-middle m-0">Information Technology Roadmap</h1>
        <div className="d-flex justify-content-end"><button onClick={onBack} className="btn btn-outline-primary">← Dashboard</button></div>
      </header>

      <div className="wrap">
        <section className="stage" aria-live="polite">
          {(cErr||jErr)&&<div className="error">Load error: {cErr||jErr}</div>}
          {(cLoad||jLoad)&&<div className="hint">Loading data…</div>}

          <div className="legend">
            <span className="step">1</span> Pick a <b>Major</b> &nbsp;→&nbsp; 
            <span className="step">2</span> Click a <b>Job Type</b> &nbsp;→&nbsp;
            <span className="step">3</span> Explore <b>Skills</b> & <b>Courses</b>
          </div>

          <div className="crumbs">
            {majorId&&<span>› {MAJORS.find(m=>m.id===majorId)?.label}</span>}
            {activeType&&<span>› {activeType}</span>}
          </div>

          <h2>Choose a Major</h2>
          <div className="grid">
            {MAJORS.map(m=>(
              <Card key={m.id} title={m.label} isFlipped={majorId===m.id}
                onToggle={()=>setMajor(majorId===m.id?null:m.id)} accent={m.color}
              />
            ))}
          </div>

          {majorId&&<>
            <h2 ref={jobTypesRef} style={{marginTop:16}}>Job Types in {MAJORS.find(m=>m.id===majorId)?.label}</h2>
            <div className="grid">
              {bucketCounts.map(b=>(
                <Card key={b.label} title={b.label}
                  info={`${b.count} postings`} isFlipped={activeType===b.label}
                  weight={b.weight} accent={accent}
                  onToggle={()=>{const next=activeType===b.label?null:b.label; setActiveType(next); if(next) setTimeout(()=>skillsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),60);}}
                />
              ))}
            </div>
          </>}

          {activeType&&<>
            <h2 ref={skillsRef} style={{marginTop:18}}>Skills for “{activeType}”</h2>
            <div className="grid mt8">
              {hardWeights.filter(h=>h.count>0).map(h=>(
                <Card key={`hs-${h.skill}`} title={h.skill.toUpperCase()}
                  info={<span><span className="dot" /> {h.count}</span>}
                  weight={h.weight} accent={accent} onToggle={()=>{}}
                />
              ))}
            </div>

            <h3 style={{marginTop:14,fontSize:16}}>Common Soft Skills</h3>
            <div className="grid mt8">
              {softSkills.map(s=><Card key={`ss-${s}`} title={s} info="" accent={accent} onToggle={()=>{}} />)}
            </div>

            <h2 style={{marginTop:18}}>Courses that teach these skills</h2>
            <div className="grid">
              {courses.map(code=>{
                const raw=(courseSkills[code]||[]);
                const display=(raw||[])
                  .filter(s=>typeSkills.allowed.has(KNOWN.find(k=>norm(k)===norm(s))||"__none__"))
                  .slice(0,MAX_COURSE_SKILLS);
                if(display.length===0) return null;
                return <CourseCard key={code} code={code} name={courseName[code]||"Course"} skills={display} />;
              })}
            </div>
          </>}
        </section>
      </div>
    </div>
  );
}

/* ------------ styles ------------ */
const GLOBAL_CSS=`
:root{--ink:#163b20;--inkSub:#2b6a41;--card:#fff;--stroke:#bad7c8;}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,system-ui,Arial,sans-serif;background:linear-gradient(to right,#36d352,#ace5bc);min-height:100vh;color:var(--ink)}
header{padding:18px 20px;text-align:center}
h1{margin:0;font-size:22px}
.wrap{max-width:1100px;margin:0 auto;padding:0 16px 28px}
.stage{
  background:#fff;
  border:none;               /* removed faint outline */
  border-radius:16px;
  box-shadow:none;           /* removed subtle shadow lines */
  padding:16px
}
.hint{font-size:12px;color:var(--inkSub);margin:4px 2px 12px}
.legend{display:flex;align-items:center;gap:10px;background:#f3fff8;border:1px solid #bce6d2;padding:8px 12px;border-radius:12px;margin-bottom:10px;font-size:14px}
.legend .step{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:#0b8a4b;color:#fff;font-weight:800;font-size:12px}
.crumbs{display:flex;gap:8px;align-items:center;color:#0b5f38;font-size:13px;margin:8px 0}
.crumbs span{opacity:.9}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;justify-content:center}  /* considered change this */

.card{perspective:1000px;cursor:pointer;contain:content}                              /* Might remove due to performance concerns */
.inner{
  position:relative;width:100%;height:calc(160px * var(--w,1));
  transform-style:preserve-3d;will-change:transform;transform:translateZ(0);
  transition:transform .2s ease;
  background:var(--card);
  border-radius:14px;border:1px solid var(--stroke);        /* considered change this */
}
.inner:hover{transform:translateY(-1px)}
.inner.flip{transform:rotateY(180deg)}
.face{
  position:absolute;inset:0;background:var(--card);border-radius:14px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:12px 14px;backface-visibility:hidden;overflow:auto;
  -ms-overflow-style:none;scrollbar-width:none
}
.face::-webkit-scrollbar{display:none}
.face.front{border-left:6px solid var(--accent,#4a7);}        /* considered change this */
.back{transform:rotateY(180deg)}

.title{font-weight:900;letter-spacing:.2px;line-height:1.2;overflow-wrap:anywhere;font-size:clamp(13px,calc(13px + .8vw * var(--w,1)),21px);max-height:3.6em}
.sub{display:flex;align-items:center;gap:6px;font-size:clamp(11px,calc(10px + .4vw * var(--w,1)),15px);color:var(--inkSub);margin-top:6px;line-height:1.2;overflow-wrap:anywhere;max-height:2.6em}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent,#4a7)}

.error{font-size:13px;color:#a31d1d;background:#fff3f3;border:1px solid #ffcccc;padding:10px;border-radius:10px}
h2{margin:12px 0 6px;font-size:18px}
h3{margin:10px 0 4px}
.mt8{margin-top:8px}
@media (max-width:600px){.grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));}}
@media (prefers-reduced-motion: reduce){
  .inner, .inner:hover{transition:none;transform:none}
}
`;
