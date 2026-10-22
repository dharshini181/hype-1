import {AnimatePresence,motion} from 'framer-motion';import {useEffect,useState} from 'react';import {sfx} from '../lib/sound';
type BIP=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
const KEY='hype-install-dismissed';
const standalone=()=>matchMedia('(display-mode: standalone)').matches||(navigator as unknown as {standalone?:boolean}).standalone===true;
const isIos=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
const read=()=>{try{return localStorage.getItem(KEY)==='1'}catch{return false}};
const write=()=>{try{localStorage.setItem(KEY,'1')}catch{/* storage blocked */}};
/** Small "install as app" pop-up. Android/desktop get a real Install button; iPhone gets a short Add to Home Screen hint. */
export function InstallPrompt(){
const [ev,setEv]=useState<BIP|null>(null),[show,setShow]=useState(false);
useEffect(()=>{if(standalone()||read())return;let t:number|undefined;
const onBip=(e:Event)=>{e.preventDefault();setEv(e as BIP);t=window.setTimeout(()=>setShow(true),1500)};
const onInstalled=()=>{setShow(false);write()};
window.addEventListener('beforeinstallprompt',onBip);window.addEventListener('appinstalled',onInstalled);
if(isIos())t=window.setTimeout(()=>setShow(true),1500);
return()=>{window.removeEventListener('beforeinstallprompt',onBip);window.removeEventListener('appinstalled',onInstalled);if(t)clearTimeout(t)}},[]);
const close=()=>{setShow(false);write()};
const install=async()=>{if(!ev)return;sfx('coin');await ev.prompt();const c=await ev.userChoice;setShow(false);if(c.outcome==='accepted')write()};
return <AnimatePresence>{show&&<motion.div role="dialog" aria-label="Install HYPE app" initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}} transition={{type:'spring',stiffness:260,damping:22}}
className="fixed inset-x-3 bottom-[max(.75rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex max-w-sm items-center gap-3 rounded-2xl border-2 border-gold bg-panel p-2.5 shadow-[0_0_20px_rgba(255,215,0,.45),0_5px_0_rgba(0,0,0,.55)]">
<img src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-xl"/>
<div className="min-w-0 flex-1"><p className="font-display text-sm leading-tight text-gold">Install HYPE app</p>
<p className="text-[.7rem] leading-tight text-snow/80">{ev?'Play full screen, right from your home screen.':'Tap Share, then "Add to Home Screen".'}</p></div>
{ev&&<button onClick={install} className="cab-btn !min-h-9 shrink-0 bg-gold !px-3 text-sm">Install</button>}
<button onClick={close} aria-label="Dismiss" className="shrink-0 px-1.5 font-pixel text-xs text-snow/70">✕</button></motion.div>}</AnimatePresence>}
