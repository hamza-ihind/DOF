import assert from 'node:assert/strict';
import { neon } from '@neondatabase/serverless';
import nextEnv from '@next/env';
import { randomBytes,createHash } from 'node:crypto';
nextEnv.loadEnvConfig(process.cwd());
const sql=neon(process.env.DATABASE_URL), base='http://localhost:3100', tag='qa-'+Date.now(), email=tag+'@example.com';
let admin='',member='',other='',mid,oid,eventId,profileId,issueId; let count=0;
async function request(path,method='GET',body,cookie='',extra={}) { const res=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{cookie}:{}),...extra},body:body?JSON.stringify(body):undefined,redirect:'manual'}); const text=await res.text(); let data;try{data=JSON.parse(text)}catch{data=text}; return {res,data}; }
function check(actual,expected,label){assert.equal(actual,expected,label); count++;console.log('PASS '+label);}
try {
 let r=await request('/api/transactions');check(r.res.status,401,'Anonymous transaction access denied');
 r=await request('/api/admin/login','POST',{username:'qa-admin',password:'Local-QA-only-approval-flow-2026'});check(r.res.status,200,'Admin login');admin=r.res.headers.get('set-cookie').split(';')[0];
 r=await request('/api/auth/register','POST',{name:'QA member',email,password:'Long-test-password-2026',role:'admin',status:'active'});check(r.res.status,201,'Registration');member=r.res.headers.get('set-cookie').split(';')[0];
 mid=(await sql`SELECT id FROM users WHERE email=${email}`)[0].id;
 check((await sql`SELECT status FROM users WHERE id=${mid}`)[0].status,'pending','Registration ignores role/status escalation');
 r=await request('/api/transactions','POST',{amount:20,description:'pending attempt'},member);check(r.res.status,403,'Pending member cannot submit');
 for(const path of ['/api/members','/api/events','/api/newsletters']){ r=await request(path,'POST',{},member);check(r.res.status,403,'Member blocked from '+path); }
 r=await request('/api/admin/accounts','GET',undefined,member);check(r.res.status,403,'Member cannot list accounts');
 r=await request('/admin/events/new','GET',undefined,member);check(r.res.status,307,'Member redirected from admin pages');
 r=await request('/api/admin/accounts','PATCH',{id:mid,status:'active'},admin);check(r.res.status,200,'Admin approves member');
 r=await request('/api/transactions','POST',{amount:12.5,description:'QA contribution',memberName:'spoofed',userId:999,date:'2000-01-01'},member);check(r.res.status,201,'Approved member submits');
 const tx=(await sql`SELECT user_id,member_name,date FROM transactions WHERE user_id=${mid}`)[0];check(tx.user_id,mid,'Transaction owner assigned by server');check(tx.member_name,'QA member','Transaction name assigned by server');
 r=await request('/api/transactions','POST',{amount:-1,description:'invalid'},member);check(r.res.status,400,'Negative amounts rejected');
 r=await request('/api/transactions','POST',{amount:1.001,description:'invalid'},member);check(r.res.status,400,'Excess precision rejected');
 r=await request('/api/transactions','DELETE',undefined,member);check(r.res.status,403,'Member cannot delete transactions');
 r=await request('/api/auth/register','POST',{name:'QA other',email:'other-'+email,password:'Long-test-password-2026'});check(r.res.status,201,'Second registration');other=r.res.headers.get('set-cookie').split(';')[0];oid=(await sql`SELECT id FROM users WHERE email=${'other-'+email}`)[0].id;
 await request('/api/admin/accounts','PATCH',{id:oid,status:'active'},admin);
 r=await request('/api/transactions','GET',undefined,other);check(r.data.transactions.length,0,'Members cannot see another member transactions');
 r=await request('/api/members','POST',{name:'QA profile '+tag,role:'Volunteer',bio:'Test',location:'Biougra'},admin);check(r.res.status,201,'Create team profile');profileId=r.data.member.id;
 const event={title:'QA event '+tag,slug:tag,category:'School Refurbishment',date:'2026-10-22',location:'Biougra',excerpt:'QA summary',content:'QA report',contributingMemberIds:[profileId],timelineDays:[{dayNumber:1,title:'Day one',date:'2026-10-22',description:'QA day',images:[]}]};
 r=await request('/api/events','POST',event,admin);check(r.res.status,201,'Create event with timeline and contributor');eventId=r.data.event.id;
 r=await request('/events/'+tag);check(r.res.status,200,'Created event public page');
 r=await request('/admin/events/'+eventId+'/edit','GET',undefined,admin);check(r.res.status,200,'Event editor route');
 r=await request('/api/events','POST',event,admin);check(r.res.status,409,'Duplicate event slug rejected');
 r=await request('/api/events','PUT',{...event,id:eventId,title:'Updated QA event'},admin);check(r.res.status,200,'Update event');
 const issue={title:'QA newsletter '+tag,summary:'QA summary',content:'QA message',published:false};
 r=await request('/api/newsletters','POST',issue,admin);check(r.res.status,200,'Save newsletter draft');issueId=r.data.id;
 r=await request('/api/newsletters');check(r.data.newsletters.some(i=>i.id===issueId),false,'Draft hidden from public');
 r=await request('/api/newsletters','PUT',{...issue,id:issueId,published:true},admin);check(r.res.status,200,'Publish newsletter');
 r=await request('/api/newsletters');check(r.data.newsletters.some(i=>i.id===issueId),true,'Published newsletter visible');
 r=await request('/api/admin/accounts','PATCH',{id:mid,status:'active'},admin,{origin:'https://evil.example'});check(r.res.status,403,'Cross-origin mutation denied');
 r=await request('/api/contact','POST',{name:'QA',email:'bad',message:'test'});check(r.res.status,400,'Contact validates email');
 r=await request('/api/contact','POST',{name:'QA',email,message:'test'});check(r.res.status,503,'Unconfigured mailbox does not claim delivery');
 r=await request('/api/newsletter/subscribe','POST',{email,consent:false});check(r.res.status,400,'Newsletter requires consent');
 const token=randomBytes(32).toString('hex'),unsub=randomBytes(32).toString('hex'),hash=t=>createHash('sha256').update(t).digest('hex');
 await sql`INSERT INTO newsletter_subscribers (email, token_hash, token_expires_at, unsubscribe_hash) VALUES (${email},${hash(token)},NOW()+INTERVAL '1 hour',${hash(unsub)})`;
 r=await request('/api/newsletter/preferences','POST',{action:'confirm',token});check(r.res.status,200,'Newsletter confirmation');
 r=await request('/api/newsletter/preferences','POST',{action:'unsubscribe',token:unsub});check(r.res.status,200,'Newsletter unsubscribe');
 r=await request('/api/admin/accounts','PATCH',{id:mid,status:'pending'},admin);check(r.res.status,200,'Admin suspends member');
 r=await request('/api/transactions','GET',undefined,member);check(r.res.status,401,'Suspension revokes sessions');
 await request('/api/admin/logout','POST',undefined,admin);r=await request('/api/admin/accounts','GET',undefined,admin);check(r.res.status,401,'Logout revokes server session');
 console.log('SUCCESS '+count+' checks');
} finally {
 if(eventId)await sql`DELETE FROM events WHERE id=${eventId}`;
 if(profileId)await sql`DELETE FROM members WHERE id=${profileId}`;
 if(issueId)await sql`DELETE FROM newsletters WHERE id=${issueId}`;
 for(const id of [mid,oid].filter(Boolean)){await sql`DELETE FROM transactions WHERE user_id=${id}`;await sql`DELETE FROM users WHERE id=${id}`;}
 await sql`DELETE FROM newsletter_subscribers WHERE email=${email}`;
 console.log('QA fixtures cleaned');
}
