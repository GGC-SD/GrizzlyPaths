// src/Roadmap.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import Papa from "papaparse";

/* small helpers */
const splitSkills = v => String(v || "").split(/[,;|/]/).map(s=>s.trim()).filter(Boolean);
const norm = s => String(s||"").toLowerCase().replace(/[^a-z0-9+/#.\s-]/g," ").replace(/\s+/g," ").trim();

/* infer skills from text or object */
const KNOWN_SKILLS = ["JavaScript","TypeScript","React","HTML","CSS","Node","Express","Python","Pandas","NumPy","Scikit-learn","TensorFlow","PyTorch","Java","C++","C#","SQL","NoSQL","PostgreSQL","MongoDB","Linux","Git","Docker","Kubernetes","CI/CD","AWS","Azure","GCP","Networking","Security","Ethical Hacking","Incident Response","ETL","Data Analysis","Machine Learning","Statistics","UX","UI","Figma"];
const getJobSkills = (jobOrText) => {
  if (typeof jobOrText === "string") {
    const t = jobOrText.toLowerCase(); const out=[];
    KNOWN_SKILLS.forEach(k=>{
      const rx=new RegExp(`\\b${k.toLowerCase().replace(/[.+*?^${}()|[\]\\]/g,"\\$&")}\\b`,"i");
      if(rx.test(t)) out.push(k);
    });
    return Array.from(new Set(out));
  }
  const job = jobOrText || {};
  const from = job.skills || job.job_skills || job.required_skills || job.skill_list || job.keywords;
  let skills = splitSkills(from);
  if (!skills.length) {
    const t = `${job.job_title||""} ${job.job_description||""}`.toLowerCase();
    KNOWN_SKILLS.forEach(k=>{ const rx=new RegExp(`\\b${k.toLowerCase().replace(/[.+*?^${}()|[\]\\]/g,"\\$&")}\\b`,"i"); if(rx.test(t)) skills.push(k); });
  }
  const seen=new Set(); return skills.filter(s=>{const k=String(s).toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true;});
};

/* infer soft skills */
const SOFT_DICT = [
  ["communication","Communication"],["teamwork","Teamwork"],["collaborat","Collaboration"],["problem","Problem solving"],["analytical","Analytical thinking"],
  ["lead","Leadership"],["time","Time management"],["organizat","Organization"],["adapt","Adaptability"],["detail","Attention to detail"],["critical","Critical thinking"],
  ["stakeholder","Stakeholder management"],["present","Presentation"],["document","Documentation"],["mentorship","Mentorship"],
];
const DEFAULT_SOFT = ["Communication","Teamwork","Problem solving","Time management","Adaptability"];
const softFromText = (text) => {
  const t = norm(text||""); const out=new Set();
  SOFT_DICT.forEach(([n,l])=>{ if(t.includes(n)) out.add(l); });
  const arr=[...out]; return arr.length?arr:DEFAULT_SOFT;
};

/* CSV */
const JOBS_CSV_URL = "https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Spring2025/final_files/merged_jobs_cleaned%20(6).csv";

/* load Course.csv */
function useCourseMaps(){
  const [courseName,setCourseName]=useState({}), [courseSkills,setCourseSkills]=useState({});
  const [loading,setLoading]=useState(true), [err,setErr]=useState("");
  useEffect(()=>{(async()=>{
    try{
      const url="https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Fall2025/grizzlypaths/src/Component/Course.csv";
      const r=await fetch(url); if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const text=(await r.text()).trim();
      const head=text.match(/^\s*COURSE_NUMBER\s*,\s*COURSE_NAME\s*,\s*COURSE_SKILLS\s*/i); if(!head) throw new Error("Missing headers");
      const rx=/\s*"*"{0,1}([A-Z]{4}\s*\d{4}[A-Z]?)"*"{0,1}\s*,\s*([^,]+?)\s*,\s*("?\[[^\]]*\]"?)/g;
      const names={}, skills={}; let m;
      while((m=rx.exec(text.slice(head[0].length)))){
        const code=m[1].trim(), name=m[2].trim();
        let raw=m[3].trim().replace(/^"|\s*"$/g,"").replace(/""/g,'"').replace(/,\s*\]/g,"]");
        let arr=[]; 
        try{const p=JSON.parse(raw); if(Array.isArray(p)) arr=p.map(s=>String(s).trim()).filter(Boolean);}
        catch{arr=raw.replace(/^\[|\]$/g,"").split(/[,;|]/).map(s=>s.replace(/["']/g,"").trim()).filter(Boolean);}
        names[code]=name; skills[code]=arr;
      }
      if(!Object.keys(names).length) throw new Error("Parsed 0 courses");
      setCourseName(names); setCourseSkills(skills);
    }catch(e){setErr(String(e.message||e));}finally{setLoading(false);}
  })()},[]);
  return { courseName, courseSkills, loading, err };
}

/* load jobs CSV */
function useJobsCSV(csvUrl=JOBS_CSV_URL){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let cancelled=false;

    const pick = (row, candidates) => {
      for (const c of candidates) {
        const k = Object.keys(row).find(k0 => k0 === c || k0.toLowerCase() === c.toLowerCase());
        if (k && row[k]!=null && String(row[k]).trim()!=="") return row[k];
      }
      return "";
    };

    const inferRole = (title="", desc="")=>{
      const t = norm(`${title} ${desc}`);
      const has = (...words)=>words.some(w=>t.includes(norm(w)));
      if (has("soc","siem","pentest","security","threat","iam","incident","vulnerability","network")) return "sec";
      if (has("data scientist","data science","ml engineer","machine learning","analytics","bi","pandas","numpy","sql","etl","tableau","power bi")) return "dsa";
      if (has("android","ios","flutter","react native","mobile app")) return "mobile";
      if (has("frontend","front-end","react","vue","angular","html","css","ui/ux","web developer","web designer")) return "web";
      if (has("backend","back-end","api","node","spring","django",".net","server","microservice","software engineer","software developer","fullstack","full-stack")) return "sd";
      if (has("qa engineer","sdet","test automation","qa analyst")) return "qa";
      if (has("dba","database administrator","database engineer","warehouse")) return "db";
      if (has("devops","sre","cloud","docker","kubernetes","terraform","aws","azure","gcp","ci/cd")) return "cloud";
      if (has("system admin","help desk","it support","network admin","sysadmin")) return "it";
      if (has("project manager","scrum master","product owner","program manager","business analyst")) return "pm";
      return "sd";
    };

    const parse = async () => {
      try{
        const res = await fetch(csvUrl);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (cancelled) return;
            const rows = Array.isArray(results.data) ? results.data : [];
            const mapped = rows.map(r=>{
              const job_title = String(pick(r, ["job_title","title","Job Title","Position","role","Role"])||"").trim();
              const company_name = String(pick(r, ["company_name","company","Company","employer"])||"").trim();
              const job_description = String(pick(r, ["job_description","description","Job Description","desc"])||"").trim();
              const job_type = String(pick(r, ["job_type","type","employment_type","Employment Type"])||"").trim();
              const job_seniority_level = String(pick(r, ["job_seniority_level","seniority","level","Seniority"])||"").trim();
              const skillsRaw = pick(r, ["skills","job_skills","required_skills","skill_list","keywords","Keywords","top_skills"]);
              const skill_list = skillsRaw ? splitSkills(skillsRaw) : getJobSkills(`${job_title} ${job_description}`);
              const _role = String(pick(r, ["_role","role_bucket","role_group"])||"").trim() || inferRole(job_title, job_description);
              return { job_title, company_name, job_description, job_type, job_seniority_level, skills: skill_list, _role };
            }).filter(x => x.job_title || x.job_description);
            setJobs(mapped);
          },
          error: (e) => { if (!cancelled) setErr(String(e?.message || e)); }
        });
      }catch(e){ if (!cancelled) setErr(String(e?.message || e)); }
      finally{ if (!cancelled) setLoading(false); }
    };

    parse();
    return () => { cancelled = true; };
  }, [csvUrl]);

  return { jobs, loading, err };
}

/* majors */
const MAJORS = [
  { id:"sw",  label:"Software Development",      roles:["sd","web","mobile","qa"],   keywords:["software","developer","engineer","frontend","backend","fullstack","web","mobile","ui","ux","qa","test"] },
  { id:"ds",  label:"Data Science & Analytics",  roles:["dsa"],                      keywords:["data","analytics","scientist","bi","ml","ai","etl","python","pandas","sql","tableau","power bi"] },
  { id:"es",  label:"Enterprise Systems",        roles:["db","cloud","it","pm"],     keywords:["enterprise","erp","sap","salesforce","database","dba","it","sysadmin","sre","cloud","pm","ba"] },
  { id:"sec", label:"Systems Security",          roles:["sec"],                      keywords:["security","soc","pentest","iam","incident","siem","threat","vulnerability","network"] },
  // DM gets sd+web buckets but is strictly filtered to design roles below
  { id:"dm",  label:"Digital Media",             roles:["web","sd"],                 keywords:["digital","media","design","ui","ux","graphics","content","video","figma","product designer","visual","web designer","motion","multimedia"] },
];

/* course match mapping */
const TECH_TO_ACADEMIC={
  python:["Python","AI / ML","Analytics / BI"],java:["Java"],javascript:["JavaScript","Web Frontend"],typescript:["JavaScript","Web Frontend"],
  react:["React","Web Frontend"],html:["Web Frontend"],css:["Web Frontend"],graphql:["Web Backend / APIs"],rest:["Web Backend / APIs"],api:["Web Backend / APIs"],
  node:["Web Backend / APIs"],express:["Web Backend / APIs"],spring:["Web Backend / APIs"],sql:["Databases / SQL"],postgres:["Databases / SQL"],mysql:["Databases / SQL"],
  snowflake:["Databases / SQL"],nosql:["NoSQL"],mongodb:["NoSQL"],pandas:["Analytics / BI"],numpy:["Analytics / BI"],scikit:["AI / ML"],tensorflow:["AI / ML"],
  pytorch:["AI / ML"],"power bi":["Analytics / BI"],tableau:["Analytics / BI"],excel:["Analytics / BI"],spark:["Analytics / BI"],hadoop:["Analytics / BI"],
  aws:["Cloud / DevOps"],azure:["Cloud / DevOps"],gcp:["Cloud / DevOps"],docker:["Cloud / DevOps"],kubernetes:["Cloud / DevOps"],terraform:["Cloud / DevOps"],
  "ci/cd":["Cloud / DevOps"],android:["Mobile"],ios:["Mobile"],flutter:["Mobile"],"react native":["Mobile"],selenium:["Project / Capstone"],cypress:["Project / Capstone"],
  pytest:["Project / Capstone"],junit:["Project / Capstone"],git:["Project / Capstone"],linux:["Operating Systems"],bash:["Operating Systems"]
};

/* explicit excludes from your screenshots */
const MAJOR_EXCLUDES = {
  sw: { titles:["développeur php fullstack","systemutvecklare","travel ct tech","travel ultrasound tech","travel certified or tech"], companies:["aya healthcare"] },
  dm: { titles:["développeur php fullstack","systemutvecklare","travel ct tech","travel ultrasound tech","travel certified or tech"], companies:["aya healthcare"] },
  es: { titles:["travel ct tech","travel ultrasound tech","travel certified or tech","développeur php fullstack","systemutvecklare"], companies:["aya healthcare"] }
};

const isNonEnglish = (s="") => /[^\x00-\x7F]/.test(s);
const looksTech = (s="") => /\b(software|developer|engineer|frontend|front-end|backend|back-end|full\s*stack|web|mobile|react|angular|vue|java(script)?|python|cloud|security|data|devops|sre|qa|sdet|network|database|sql|ui|ux|design|figma|graphic|visual|content|brand|motion|multimedia|video)\b/i.test(s);
const containsAny = (text, arr=[]) => { const t = norm(text); return arr.some(x => t.includes(norm(x))); };

/* strict allow rules to avoid overlap */
const DM_TITLE_INCLUDE = /\b(ui|ux|designer|product\s*designer|visual|graphic|web\s*designer|interaction|experience|design|figma|content\s*designer|branding|brand|motion|multimedia|video\s*editor)\b/i;
const DM_TITLE_REJECT  = /\b(engineer|developer|analyst|qa|sdet|scientist)\b/i; // never in DM titles
const isDesignInternOk = (title) => /intern/i.test(title) ? /(design|designer|ux|ui)/i.test(title) : true;

const ALLOW_RULES = {
  sw: (_title, whole) => /\b(software|developer|engineer|frontend|front-end|backend|back-end|full\s*stack|react|node|java(script)?|.net|spring)\b/i.test(whole),
  dm: (title, whole) => {
    // title must be design-oriented and not dev/analyst; allow "Design/UX Intern" only
    if (!DM_TITLE_INCLUDE.test(title)) return false;
    if (DM_TITLE_REJECT.test(title)) return false;
    if (!isDesignInternOk(title)) return false;
    return true;
  },
  es: (_title, whole) => {
    const w = whole.toLowerCase();
    const enterprise = /\b(erp|sap|salesforce|oracle|netsuite|dynamics|servicenow|sharepoint|crm|workday)\b/i.test(w);
    const itops = /\b(sysadmin|systems? administrator|network (admin|engineer)|it support|help desk|sre|cloud (engineer|architect)|aws|azure|gcp|devops|site reliability)\b/i.test(w);
    const dataDb = /\b(database administrator|dba|data warehouse|etl)\b/i.test(w);
    const pmba = /\b(project manager|program manager|product owner|business analyst|solutions architect)\b/i.test(w);
    const pureDev = /\b(software (engineer|developer)|frontend|front-end|backend|back-end|full\s*stack|mobile developer)\b/i.test(w);
    const ds    = /\b(data scientist|machine learning|ml engineer)\b/i.test(w);
    const security = /\b(security|soc|siem|pentest|iam)\b/i.test(w);
    const designOnly = /\b(ui|ux|designer|graphic|visual|figma|brand(ing)?|motion|content)\b/i.test(w) && !enterprise && !itops && !pmba && !dataDb;
    return (enterprise || itops || pmba || dataDb) && !pureDev && !ds && !security && !designOnly;
  }
};

/* tiny UI atoms */
function Card({ title, info, backText, onToggle, isFlipped=false }) {
  return (
    <div className="card" onClick={()=>onToggle&&onToggle()} title={typeof title==="string"?title:undefined}>
      <div className={`inner ${isFlipped?"flip":""}`}>
        <div className="face front"><div className="title">{title}</div><div className="sub">{info||" "}</div><div className="pill">click to flip</div></div>
        <div className="face back">{backText || "No description provided."}</div>
      </div>
    </div>
  );
}
function CourseCard({ code, name, skills }) {
  const [flip, setFlip] = useState(false);
  return <Card title={`${code} — ${name}`} backText={skills?.length?`Skills: ${skills.join(" • ")}`:"No listed skills."} isFlipped={flip} onToggle={()=>setFlip(f=>!f)} />;
}

/* scoring */
function scoreJobForMajor(job, major){
  const desc = String(job.job_description||"");
  const skills = getJobSkills(job);
  const t = norm(`${job.job_title||""} ${desc}`);
  const kw = (major?.keywords||[]).map(norm);
  let kwHits = 0; kw.forEach(k=>{ if(t.includes(k)) kwHits+=1; });
  const len = Math.min(desc.length, 3500) / 3500;
  const sCount = Math.min(skills.length, 15) / 15;
  return kwHits*1.6 + len*1.0 + sCount*1.2;
}

/* main component */
export default function Roadmap({ onBack }) {
  const { courseName, courseSkills, loading: coursesLoading, err: courseErr } = useCourseMaps();
  const { jobs: JOBS, loading: jobsLoading, err: jobsErr } = useJobsCSV();

  const [majorId, setMajorId] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showHard, setShowHard] = useState(false);
  const [showSoft, setShowSoft] = useState(false);
  const skillsRef = useRef(null);

  const { top5Jobs } = useMemo(()=>{
    if(!majorId) return { top5Jobs: [] };
    const major = MAJORS.find(m=>m.id===majorId);
    if(!major) return { top5Jobs: [] };

    const allowedRoles = new Set((major.roles||[]).map(String));
    const excludes = MAJOR_EXCLUDES[major.id] || { titles:[], companies:[] };
    const allowFn = ALLOW_RULES[major.id] || (()=>true);

    const seen = new Set();
    const primaryPool = [];

    // pass 1: role bucket + major rules
    for (const j of JOBS) {
      if(!allowedRoles.has(String(j._role))) continue;

      const title = String(j.job_title||"");
      const company = String(j.company_name||"");
      const desc = String(j.job_description||"");
      const whole = `${title} ${desc}`;

      if (containsAny(title, excludes.titles)) continue;
      if (containsAny(company, excludes.companies)) continue;
      if (isNonEnglish(title)) continue;
      if (!looksTech(whole)) continue;
      if (!allowFn(title, whole)) continue;

      const key=[norm(title),norm(company),norm(desc.slice(0,220))].join("|");
      if(seen.has(key)) continue; seen.add(key);
      primaryPool.push(j);
    }

    let picked = primaryPool
      .map(j=>({ j, score: scoreJobForMajor(j, major) }))
      .sort((a,b)=>b.score-a.score)
      .slice(0,5)
      .map(x=>x.j);

    const alreadyHas = (arr, j) => arr.some(p =>
      [norm(p.job_title),norm(p.company_name),norm(String(p.job_description||"").slice(0,220))].join("|") ===
      [norm(j.job_title),norm(j.company_name),norm(String(j.job_description||"").slice(0,220))].join("|")
    );
    const needMore = () => picked.length < 5;
    const tryAdd = (cands) => { for (const x of cands) { if (picked.length>=5) break; if (!alreadyHas(picked, x.j)) picked.push(x.j); } };

    if (["dm","es"].includes(major.id) && needMore()) {
      // pass 2: same buckets, still must satisfy allowFn
      const tier1 = [];
      for (const j of JOBS) {
        if(!allowedRoles.has(String(j._role))) continue;
        const title=String(j.job_title||""); const company=String(j.company_name||""); const desc=String(j.job_description||"");
        const whole = `${title} ${desc}`;
        if (containsAny(title, excludes.titles) || containsAny(company, excludes.companies) || isNonEnglish(title)) continue;
        if (!looksTech(whole) || !allowFn(title, whole)) continue;
        if (alreadyHas(picked, j)) continue;
        tier1.push({ j, score: scoreJobForMajor(j, major) });
      }
      tier1.sort((a,b)=>b.score-a.score);
      tryAdd(tier1);
    }

    if (["dm","es"].includes(major.id) && needMore()) {
      // pass 3: any role, but must satisfy allowFn + major keywords
      const tier2 = [];
      for (const j of JOBS) {
        const title=String(j.job_title||""); const company=String(j.company_name||""); const desc=String(j.job_description||"");
        const whole = `${title} ${desc}`;
        if (containsAny(title, excludes.titles) || containsAny(company, excludes.companies) || isNonEnglish(title)) continue;
        if (!looksTech(whole) || !allowFn(title, whole)) continue;
        const tt = norm(whole);
        const kwMatch = (major.keywords||[]).some(k => tt.includes(norm(k)));
        if (!kwMatch) continue;
        if (alreadyHas(picked, j)) continue;
        tier2.push({ j, score: scoreJobForMajor(j, major) });
      }
      tier2.sort((a,b)=>b.score-a.score);
      tryAdd(tier2);
    }

    if (needMore()) {
      // pass 4: safety — still enforce allowFn for dm/es so wrong jobs can't slip in
      const tier3 = [];
      for (const j of JOBS) {
        const title=String(j.job_title||""); const company=String(j.company_name||""); const desc=String(j.job_description||"");
        const whole = `${title} ${desc}`;
        if (containsAny(title, excludes.titles) || containsAny(company, excludes.companies) || isNonEnglish(title)) continue;
        if (!looksTech(whole)) continue;
        if (["dm","es"].includes(major.id) && !allowFn(title, whole)) continue; // <- keep DM/ES pure
        if (alreadyHas(picked, j)) continue;
        tier3.push({ j, score: scoreJobForMajor(j, major) });
      }
      tier3.sort((a,b)=>b.score-a.score);
      tryAdd(tier3);
    }

    return { top5Jobs: picked.slice(0,5) };
  }, [majorId, JOBS]);

  const selectedJob = (selectedIdx!=null && top5Jobs[selectedIdx]) ? top5Jobs[selectedIdx] : null;

  const hardSkills = useMemo(()=>{
    if(!selectedJob) return [];
    const title=(selectedJob.job_title||"").trim();
    const peers=top5Jobs.filter(j=>(j.job_title||"").trim()===title);
    const counts=new Map();
    peers.forEach(j=>{ getJobSkills(j).forEach(s=>counts.set(s,(counts.get(s)||0)+1)); });
    const agg=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([s])=>s);
    return (agg.length?agg:getJobSkills(selectedJob)).slice(0,5);
  }, [selectedJob, top5Jobs]);

  const softSkills = useMemo(()=>{
    if(!selectedJob) return [];
    const peersText=top5Jobs.filter(Boolean).map(j=>j.job_description||"").join("\n");
    return softFromText(peersText).slice(0,5);
  }, [selectedJob, top5Jobs]);

  const recommendCourses = useMemo(()=>{
    const codes = Object.keys(courseName);
    if(!codes.length) return () => [];
    const meta = codes.map(code=>{
      const name=courseName[code]||"", skills=courseSkills[code]||[];
      const tokens=new Set(norm([name,...skills].join(" ")).split(" ").filter(Boolean));
      return {code,name,skills,tokens};
    });
    const buckets=[
      {key:"security",words:["security","soc","pentest","iam","incident","siem","threat","vulnerability","network"]},
      {key:"cloud",words:["cloud","devops","sre","docker","kubernetes","aws","azure","gcp","terraform","ci/cd"]},
      {key:"frontend",words:["frontend","ui","react","javascript","html","css","web"]},
      {key:"backend",words:["backend","api","server","node","spring","graphql","rest","database","sql"]},
      {key:"data",words:["data","analytics","bi","python","ml","ai","pandas","numpy","spark","hadoop"]},
      {key:"mobile",words:["mobile","android","ios","flutter","react native"]},
      {key:"database",words:["database","dba","etl","warehouse","postgres","mysql","mongodb","nosql"]},
      {key:"ops",words:["linux","bash","system","admin","operating","networks","sre"]}
    ];
    return (job, n=5)=>{
      if(!job) return [];
      const title=(job.job_title||""); const desc = norm(`${title} ${job.job_description||""}`);
      const jt = new Set(desc.split(" ").filter(Boolean));
      const tag = new Set(getJobSkills(job).map(s=>norm(s)));
      Object.keys(TECH_TO_ACADEMIC).forEach(t=>{ if(desc.includes(norm(t))) (TECH_TO_ACADEMIC[t]||[]).forEach(a=>tag.add(norm(a)));});
      const jbKeys=new Set(buckets.filter(b=>b.words.some(w=>desc.includes(w)||jt.has(norm(w)))).map(b=>b.key));
      const scored = meta.map(c=>{
        let overlap=0; (c.skills||[]).map(norm).forEach(s=>{ if(tag.has(s)) overlap+=3; });
        let hits=0; c.tokens.forEach(tok=>{ if(jt.has(tok)) hits++; });
        let bucket=0; for(const b of buckets){ const has=b.words.some(w=>c.tokens.has(norm(w))); if(has&&jbKeys.has(b.key)) bucket+=2; }
        let tBoost=0; if(title&&c.name){ const ts=title.toLowerCase().split(" "); tBoost=ts.reduce((s,t)=>s+(c.name.toLowerCase().includes(t)?0.3:0),0); }
        return {code:c.code, score:overlap+hits*0.4+bucket+tBoost};
      }).sort((a,b)=>b.score-a.score);

      const primary = (scored.filter(s=>s.score>0).length?scored.filter(s=>s.score>0):scored).map(s=>s.code);
      const chosen=[], seen=new Set();
      const push = code => { if(code && !seen.has(code) && courseName[code]) { seen.add(code); chosen.push(code); } };
      for(const c of primary){ if(chosen.length>=n) break; push(c); }
      if(chosen.length<n){ for(const s of scored){ if(chosen.length>=n) break; push(s.code); } }
      return chosen.slice(0, n);
    };
  }, [courseName, courseSkills]);

  const courses = useMemo(()=>recommendCourses(selectedJob, 5), [selectedJob, recommendCourses]);

  return (
    <div>
      <style>{globalCSS}</style>

      <header className="mb-4 position-relative">
        <h1 className="position-absolute top-50 start-50 translate-middle m-0">Information Technology Roadmap</h1>
        <div className="d-flex justify-content-end">
          <button onClick={onBack} className="btn btn-outline-primary">← Dashboard</button>
        </div>
      </header>

      <div className="wrap">
        <section className="stage">
          {(courseErr || jobsErr) && <div className="error">Load error: {courseErr || jobsErr}</div>}
          {(coursesLoading || jobsLoading) && <div className="hint">Loading data…</div>}

          <h2>Choose a Major</h2>
          <div className="grid">
            {MAJORS.map(m=>(
              <Card
                key={m.id}
                title={m.label}
                backText={`Select ${m.label}`}
                isFlipped={majorId===m.id}
                onToggle={()=>{
                  if(majorId === m.id){
                    setMajorId(null); setActiveIdx(null); setSelectedIdx(null); setShowHard(false); setShowSoft(false);
                  }else{
                    setMajorId(m.id); setActiveIdx(null); setSelectedIdx(null); setShowHard(false); setShowSoft(false);
                  }
                }}
              />
            ))}
          </div>

          {majorId && (
            <>
<h2 style={{marginTop:16}}>Jobs</h2>
              <div className="hint">Flip a job to read its description. Clicking a card also selects it to show skills & courses below.</div>
              <div className="grid">
                {top5Jobs.map((j, idx)=>(
                  <Card
                    key={`job-${idx}`}
                    isFlipped={activeIdx===idx}
                    title={j.job_title || "Job"}
                    info={`${j.company_name || "Unknown Company"}${j.job_type ? " • " + j.job_type : ""}${j.job_seniority_level ? " • " + j.job_seniority_level : ""}`}
                    backText={String(j.job_description || "No description provided.")}
                    onToggle={()=>{
                      setActiveIdx(cur=>cur===idx?null:idx);
                      setSelectedIdx(idx);
                      setTimeout(()=>skillsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),10);
                    }}
                  />
                ))}
                {top5Jobs.length===0 && <Card title="No jobs available" info="Try another major" />}
              </div>
            </>
          )}

          {selectedJob && (
            <>
              <h2 ref={skillsRef} style={{marginTop:18}}>Skills for “{selectedJob.job_title}”</h2>
              <div className="toggleRow">
                <button className="chipBtn" onClick={()=>setShowHard(v=>!v)}>
                  {showHard ? "− Hide Hard Skills" : "+ Show Hard Skills"}
                </button>
                <button className="chipBtn" onClick={()=>setShowSoft(v=>!v)}>
                  {showSoft ? "− Hide Soft Skills" : "+ Show Soft Skills"}
                </button>
              </div>

              {showHard && (
                <div className="grid mt8">
                  {hardSkills.map(hs=>(
                    <Card key={`hs-${hs}`} title={hs.toUpperCase()} info=" " backText={`Skill: ${hs}`} onToggle={()=>{}} />
                  ))}
                  {hardSkills.length===0 && <Card title="No hard skills detected" info="" />}
                </div>
              )}

              {showSoft && (
                <div className="grid mt8">
                  {softSkills.map(ss=>(
                    <Card key={`ss-${ss}`} title={ss} info="" backText={`Soft skill: ${ss}`} onToggle={()=>{}} />
                  ))}
                </div>
              )}
            </>
          )}

          {selectedJob && (
            <>
              <h2 style={{marginTop:18}}>Courses that teach these skills</h2>
              <div className="grid">
                {courses.map(code=>(
                  <CourseCard key={code} code={code} name={courseName[code]||"Course"} skills={courseSkills[code]||[]} />
                ))}
                {(!coursesLoading && courses.length===0) && <Card title="No strong course matches" info="Try another job or major" />}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* styles */
const globalCSS = `
:root{--primaryButtonColor:#FF0000;--primaryButtonRadius:12px;--primaryButtonHover:darkred;--primaryButtonText:white}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial, sans-serif;background:linear-gradient(to right,#36d352,#ace5bc);min-height:100vh;color:#163b20}
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
.title{font-weight:700;line-height:1.2;overflow-wrap:anywhere;font-size:clamp(12px, 1.8vw, 16px);max-height:3.6em}
.sub{font-size:clamp(11px, 1.5vw, 13px);color:#2b6a41;margin-top:6px;line-height:1.2;overflow-wrap:anywhere;max-height:2.6em}
.pill{margin-top:8px;font-size:11px;padding:3px 8px;border-radius:999px;border:1px solid #000;color:#2b6a41}
.error{font-size:13px;color:#a31d1d;background:#fff3f3;border:1px solid #ffcccc;padding:10px;border-radius:8px}
h2{margin:12px 0 6px;font-size:18px}
.toggleRow{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
.chipBtn{border:1px solid #000;background:#fff;border-radius:14px;padding:8px 12px;font-weight:700;cursor:pointer}
.chipBtn:hover{box-shadow:0 0 0 3px rgba(0,0,0,.10)}
.mt8{margin-top:8px}
@media (max-width:600px){.grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr));}}
`;
