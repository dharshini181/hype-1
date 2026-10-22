/** Bubble Burst rules. Kept free of React so they can be unit tested. Positions are percentages of the play area. */
export const COLORS=['#FF69B4','#FF1493','#FF00FF','#FF4500','#FFD700'];
export type Level={secs:number;every:number;rise:[number,number];goal:number};
export const LEVELS:Record<string,Level>={Easy:{secs:40,every:.85,rise:[16,26],goal:250},Medium:{secs:45,every:.65,rise:[22,34],goal:450},Hard:{secs:50,every:.5,rise:[28,44],goal:700}};
export type Bubble={id:number;x:number;y:number;r:number;vy:number;color:string;gold:boolean;ph:number;age:number};
/** Radius is a percentage of the play area width. Smaller bubbles are harder to hit, so they pay more. */
export const SIZES=[{r:6,pts:30},{r:8,pts:20},{r:10.5,pts:10}] as const;
export const GOLD_PTS=50;
/** rand is injectable so tests are deterministic. */
export function spawn(id:number,lv:Level,rand:()=>number=Math.random):Bubble{
  const gold=rand()<.1,s=SIZES[Math.min(SIZES.length-1,Math.floor(rand()*SIZES.length))],r=gold?7:s.r;
  return{id,x:r+rand()*(100-2*r),y:-r*1.4,r,vy:lv.rise[0]+rand()*(lv.rise[1]-lv.rise[0]),color:gold?'#FFD700':COLORS[Math.floor(rand()*4)],gold,ph:rand()*Math.PI*2,age:0}}
export const base=(b:Bubble)=>b.gold?GOLD_PTS:(SIZES.find(s=>s.r===b.r)?.pts??10);
/** x1 up to x4: every 5 pops in a row (no bubble escaping) adds one. */
export const multiplier=(streak:number)=>Math.min(4,1+Math.floor(streak/5));
export const popScore=(b:Bubble,streak:number)=>base(b)*multiplier(streak);
/** Moves bubbles up; those whose bottom edge has left the top are returned as escaped. y is the bubble centre measured upward from the bottom. */
export function step(bs:Bubble[],dt:number):{alive:Bubble[];escaped:Bubble[]}{
  const alive:Bubble[]=[],escaped:Bubble[]=[];
  for(const b of bs){const n={...b,y:b.y+b.vy*dt,age:b.age+dt};(n.y-n.r*1.3>100?escaped:alive).push(n)}
  return{alive,escaped}}
export const sway=(b:Bubble)=>Math.sin(b.ph+b.age*1.6)*1.6;
