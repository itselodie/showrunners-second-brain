import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useAnalyzeScene, type SceneAnalysis } from '@workspace/api-client-react';
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, BrainCircuit, Check,
  ChevronDown, ChevronRight, CircleDot, Clock3, Command, Compass, FileText,
  Filter, FolderOpen, GitBranch, Globe2, Layers3, Lightbulb, MapPin, Menu,
  MessageSquare, PanelRight, Play, Plus, Search, Send, Settings2, ShieldCheck,
  Sparkles, Split, Tag, Target, Users, X, Zap
} from 'lucide-react';

const queryClient = new QueryClient();

type IconType = typeof Activity;

const navItems: { href: string; label: string; icon: IconType; count?: string }[] = [
  { href: '/', label: 'Room overview', icon: Activity },
  { href: '/workspace', label: 'Screenplay workspace', icon: FileText, count: 'E03' },
  { href: '/bible', label: 'Series bible', icon: BookOpen },
];

function Icon({ icon: I, size = 16 }: { icon: IconType; size?: number }) {
  return <I size={size} strokeWidth={1.7} />;
}

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };
  return (
    <div className="noise min-h-[100dvh] bg-background text-foreground">
      <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-[258px] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:translate-x-0`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-sidebar-border px-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary/60 bg-primary/10 text-primary">
            <GitBranch size={20} strokeWidth={1.7} />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_hsl(var(--sidebar))]" />
          </div>
          <div>
            <div className="display text-[15px] font-bold tracking-[-.02em] text-foreground">SHOWRUNNER'S</div>
            <div className="mono text-[9px] uppercase tracking-[.22em] text-muted-foreground">second brain</div>
          </div>
          <button data-testid="button-close-mobile-nav" onClick={() => setMobileOpen(false)} className="ml-auto text-muted-foreground md:hidden"><X size={18} /></button>
        </div>
        <div className="px-4 pt-7">
          <div className="mono mb-3 px-3 text-[9px] uppercase tracking-[.18em] text-muted-foreground/70">Production / 01</div>
          <div className="mb-6 rounded-lg border border-sidebar-border bg-sidebar-accent/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Echoes of Tomorrow</div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>Season 01</span><span className="mono">4 / 8 eps</span></div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-background"><div className="h-full w-1/2 rounded-full bg-primary" /></div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.href === location;
              return <Link data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] transition-all ${active ? 'bg-primary/12 text-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'}`}>
                <Icon icon={item.icon} size={17} /><span className="flex-1">{item.label}</span>{item.count && <span className={`mono text-[9px] ${active ? 'text-primary/80' : 'text-muted-foreground/65'}`}>{item.count}</span>}
                {active && <span className="h-1 w-1 rounded-full bg-primary" />}
              </Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 border-t border-sidebar-border pt-4">
            <div className="mono mb-3 px-3 text-[9px] uppercase tracking-[.18em] text-muted-foreground/70">Tools</div>
            <button data-testid="button-global-search" onClick={() => flash('Search is ready — try “Sarah”')} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[12px] text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"><Search size={16} /><span className="flex-1">Search the room</span><span className="mono rounded border border-sidebar-border px-1 text-[9px]">⌘K</span></button>
            <button data-testid="button-open-settings" onClick={() => flash('Room settings are saved locally')} className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[12px] text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"><Settings2 size={16} />Settings</button>
          </div>
          <div className="flex items-center gap-3 border-t border-sidebar-border pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">SM</div>
            <div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold text-foreground">Sarah Malik</div><div className="text-[10px] text-muted-foreground">Showrunner</div></div>
            <button data-testid="button-profile-menu" onClick={() => flash('Profile menu opened')} className="text-muted-foreground hover:text-foreground"><ChevronDown size={15} /></button>
          </div>
        </div>
      </aside>
      <div className="md:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[76px] items-center border-b border-border bg-background/90 px-5 backdrop-blur-md md:px-9">
          <button data-testid="button-open-mobile-nav" onClick={() => setMobileOpen(true)} className="mr-4 text-muted-foreground md:hidden"><Menu size={20} /></button>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><span className="hidden sm:inline">Echoes of Tomorrow</span><ChevronRight size={13} /><span className="text-foreground">{location === '/' ? 'Room overview' : location === '/workspace' ? 'Screenplay workspace' : 'Series bible'}</span></div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground sm:flex"><CircleDot size={12} className="text-primary" />All systems nominal</div>
            <button data-testid="button-notifications" onClick={() => flash('No new room notifications')} className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-card hover:text-foreground"><AlertTriangle size={15} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" /></button>
            <button data-testid="button-quick-add" onClick={() => flash('Quick capture opened — local draft ready')} className="hidden items-center gap-2 rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:flex"><Plus size={14} />Quick capture</button>
          </div>
        </header>
        <main className="min-h-[calc(100dvh-76px)] px-5 py-7 md:px-9 lg:px-12">{children}</main>
      </div>
      {toast && <div data-testid="status-toast" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-primary/30 bg-card px-4 py-3 text-[12px] text-foreground shadow-lg fade-in"><Check size={15} className="text-primary" />{toast}</div>}
    </div>
  );
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="mono mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[.22em] text-primary"><span className="h-px w-5 bg-primary" />{eyebrow}</div><h1 className="display text-[30px] font-bold leading-none text-foreground md:text-[38px]">{title}</h1>{detail && <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">{detail}</p>}</div>{action}</div>;
}

function StatCard({ label, value, note, icon, tone = 'primary' }: { label: string; value: string; note: string; icon: IconType; tone?: 'primary' | 'accent' | 'cyan' }) {
  const colors = { primary: 'text-primary bg-primary/10 border-primary/20', accent: 'text-accent bg-accent/10 border-accent/20', cyan: 'text-secondary bg-secondary/10 border-secondary/20' };
  return <div className="panel rounded-lg p-4 transition-transform hover:-translate-y-0.5"><div className="mb-4 flex items-start justify-between"><span className="mono text-[9px] uppercase tracking-[.14em] text-muted-foreground">{label}</span><span className={`flex h-7 w-7 items-center justify-center rounded-md border ${colors[tone]}`}><Icon icon={icon} size={15} /></span></div><div data-testid={`text-stat-${label.toLowerCase().replaceAll(' ', '-')}`} className="display text-[28px] font-bold tracking-[-.05em]">{value}</div><div className="mt-1 text-[10px] text-muted-foreground">{note}</div></div>;
}

function Dashboard() {
  const [alertResolved, setAlertResolved] = useState(false);
  const [filter, setFilter] = useState('All activity');
  const activities = [
    { time: '12 min ago', initials: 'JM', name: 'Jules Mercer', action: 'flagged a continuity risk', target: 'Sarah’s travel timeline', color: 'bg-secondary/20 text-secondary' },
    { time: '38 min ago', initials: 'LK', name: 'Lena Kim', action: 'updated', target: 'E03 / Scene 24', color: 'bg-primary/20 text-primary' },
    { time: '1 hr ago', initials: 'AR', name: 'Alex Rivera', action: 'added a story event', target: 'The memory cascade', color: 'bg-accent/20 text-accent' },
    { time: '3 hrs ago', initials: 'JM', name: 'Jules Mercer', action: 'commented on', target: 'The Halcyon protocol', color: 'bg-secondary/20 text-secondary' },
  ];
  return <div className="mx-auto max-w-[1440px] fade-in">
    <SectionHeading eyebrow="Monday / 23 September 2024" title="Good evening, Sarah." detail="The room is quiet. Four threads moved while you were away — one of them needs your attention before tomorrow’s table read." action={<div className="flex items-center gap-2"><button data-testid="button-dashboard-filter" onClick={() => setFilter(filter === 'All activity' ? 'Needs attention' : 'All activity')} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground"><Filter size={14} />{filter}<ChevronDown size={13} /></button><Link data-testid="link-open-workspace" href="/workspace" className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground hover:brightness-105">Open workspace<ArrowRight size={14} /></Link></div>} />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><StatCard label="Episodes in motion" value="04" note="E01 — E04 active" icon={Layers3} /><StatCard label="Open threads" value="17" note="+3 since Friday" icon={GitBranch} tone="cyan" /><StatCard label="Continuity alerts" value="03" note="1 high confidence" icon={AlertTriangle} tone="accent" /><StatCard label="Bible coverage" value="78%" note="Across 412 story facts" icon={ShieldCheck} /></div>
    <div className="mt-7 grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
      <div className="panel rounded-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-[13px] font-bold">Continuity watch</h2><p className="mt-1 text-[10px] text-muted-foreground">Risks detected across the current cut</p></div><Link data-testid="link-view-bible-alert" href="/bible" className="text-[11px] font-semibold text-primary hover:underline">View bible <ArrowRight size={13} className="ml-1 inline" /></Link></div>
        <div className={`m-4 rounded-md border ${alertResolved ? 'border-secondary/30 bg-secondary/5' : 'border-accent/30 bg-accent/5'} p-4`}>
          <div className="flex gap-3"><div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${alertResolved ? 'bg-secondary/15 text-secondary' : 'bg-accent/15 text-accent'}`}>{alertResolved ? <Check size={17} /> : <AlertTriangle size={17} />}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`mono text-[9px] uppercase tracking-[.13em] ${alertResolved ? 'text-secondary' : 'text-accent'}`}>{alertResolved ? 'Marked for review' : 'High confidence'}</span><span className="text-[10px] text-muted-foreground">· E02 → E03</span></div><h3 data-testid="text-continuity-alert" className="mt-2 text-[14px] font-bold">Sarah Malik crosses 5,500 miles between episodes</h3><p className="mt-2 max-w-[630px] text-[11px] leading-relaxed text-muted-foreground">She is established in London at the end of Episode 2, then appears in Tokyo — Scene 24 — with no travel, cut, or explanation in between. The room’s current cut asks the audience to do impossible math.</p><div className="mt-4 flex flex-wrap gap-2"><Link data-testid="link-investigate-sarah" href="/workspace?investigate=true" className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-[10px] font-bold text-accent-foreground hover:brightness-110"><BrainCircuit size={14} />Investigate in workspace</Link><button data-testid="button-resolve-alert" onClick={() => setAlertResolved(true)} className="rounded-md border border-border px-3 py-2 text-[10px] font-semibold text-muted-foreground hover:bg-card hover:text-foreground">{alertResolved ? 'Review queued' : 'Mark for review'}</button></div></div></div>
        </div>
        <div className="grid gap-3 border-t border-border px-5 py-4 sm:grid-cols-2"><div className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-primary" /><div><div className="text-[11px] font-semibold">Prop logic / Halcyon drive</div><div className="mt-0.5 text-[10px] text-muted-foreground">Medium · E01 / E04</div></div></div><div className="flex items-center gap-3"><div className="h-1.5 w-1.5 rounded-full bg-secondary" /><div><div className="text-[11px] font-semibold">Mara’s access level</div><div className="mt-0.5 text-[10px] text-muted-foreground">Low · E03</div></div></div></div>
      </div>
      <div className="panel rounded-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-[13px] font-bold">Room activity</h2><p className="mt-1 text-[10px] text-muted-foreground">{filter === 'All activity' ? 'What changed while you were away' : 'Items that need a decision'}</p></div><button data-testid="button-activity-refresh" onClick={() => setFilter('All activity')} className="mono text-[9px] uppercase tracking-[.12em] text-primary hover:text-foreground">Reset view</button></div>
        <div className="divide-y divide-border">{activities.slice(filter === 'Needs attention' ? 0 : 0, filter === 'Needs attention' ? 2 : 4).map((activity, index) => <div data-testid={`row-activity-${index}`} key={`${activity.name}-${index}`} className="flex gap-3 px-5 py-4 transition-colors hover:bg-elevate-1"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${activity.color}`}>{activity.initials}</div><div className="min-w-0 flex-1 text-[11px] leading-relaxed"><span className="font-semibold">{activity.name}</span>{' '}{activity.action}{' '}<span className="font-semibold text-primary">{activity.target}</span><div className="mono mt-1 text-[9px] text-muted-foreground">{activity.time}</div></div><ChevronRight size={14} className="mt-1 text-muted-foreground/50" /></div>)}</div>
      </div>
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
      <div className="panel grid-texture rounded-lg p-5"><div className="flex items-center gap-2 text-primary"><Target size={16} /><span className="mono text-[9px] uppercase tracking-[.17em]">Showrunner’s focus</span></div><h2 className="display mt-6 max-w-sm text-[22px] font-bold leading-tight">What does Sarah know — and when did she know it?</h2><p className="mt-3 max-w-sm text-[11px] leading-relaxed text-muted-foreground">Resolve the geography gap, then use the answer to sharpen the reveal in Scene 24.</p><Link data-testid="link-focus-workspace" href="/workspace" className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold text-primary hover:gap-3">Continue the investigation <ArrowRight size={14} /></Link></div>
      <div className="panel rounded-lg p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[13px] font-bold">Season arc at a glance</h2><p className="mt-1 text-[10px] text-muted-foreground">Narrative confidence by episode</p></div><span className="mono rounded border border-secondary/30 bg-secondary/10 px-2 py-1 text-[9px] text-secondary">LIVE CUT</span></div><div className="space-y-4">{[['E01','The Signal','92%','bg-secondary','Seeding the impossible'],['E02','The Distance Between','84%','bg-primary','London / the last normal night'],['E03','The Shape of Memory','61%','bg-accent','Tokyo / current investigation'],['E04','Untitled','—','bg-muted-foreground','Room notes only']].map(([ep,title,progress,color,note]) => <div data-testid={`row-episode-${ep}`} key={ep} className="grid grid-cols-[42px_1fr_44px] items-center gap-3"><span className="mono text-[10px] text-muted-foreground">{ep}</span><div><div className="mb-1 flex justify-between text-[11px]"><span className="font-semibold">{title}</span><span className="text-[10px] text-muted-foreground">{note}</span></div><div className="h-1 overflow-hidden rounded-full bg-muted"><div className={`h-full ${color} rounded-full`} style={{ width: progress === '—' ? '4%' : progress }} /></div></div><span className="mono text-right text-[10px] text-muted-foreground">{progress}</span></div>)}</div></div>
    </div>
  </div>;
}

const screenplayLines = [
  { type: 'scene', text: '24. INT. TOKYO METRO — NIGHT' },
  { type: 'action', text: 'The train folds through the city like a thought Sarah cannot finish. Fluorescent light. Wet glass. A reflection that arrives half a second late.' },
  { type: 'action', text: 'SARAH MALIK, 34, stands alone between commuters. Her London coat is still buttoned against a different kind of weather.' },
  { type: 'character', text: 'SARAH' },
  { type: 'dialogue', text: 'You said the signal only happened once.' },
  { type: 'parenthetical', text: '(into a dead phone)' },
  { type: 'dialogue', text: 'So why can I hear it everywhere?' },
  { type: 'action', text: 'The doors open at SHIBUYA. Nobody gets on. Nobody gets off.' },
  { type: 'action', text: 'Across the platform, a woman in a red scarf watches Sarah with the quiet patience of someone who has already seen this scene.' },
  { type: 'character', text: 'WOMAN IN RED' },
  { type: 'dialogue', text: 'You’re late.' },
  { type: 'character', text: 'SARAH' },
  { type: 'dialogue', text: 'I came as soon as I could.' },
  { type: 'action', text: 'A beat. Sarah looks down at her hands. There is rain on them. Tokyo rain.' },
];

const seriesBibleContext = {
  characters: [
    { name: 'Sarah Malik', role: 'Protagonist', facts: ['Memory researcher', 'Wants to prove the signal is real', 'Fears her memories are borrowed'] },
    { name: 'Mara Voss', role: 'Antagonist', facts: ['Temporal systems specialist', 'Adversary and mirror to Sarah'] },
    { name: 'Elias Vale', role: 'Supporting', facts: ['MI6 liaison', 'Ally and witness'] },
    { name: 'The Woman in Red', role: 'Unknown', facts: ['Recurring anomaly', 'Has appeared around signal events'] },
  ],
  locations: [
    { name: 'London', status: 'Canon location', lastSeen: 'E02 / Scene 19', detail: 'Sarah’s flat above the closed bakery. The place where the ordinary timeline ends.' },
    { name: 'Tokyo', status: 'Continuity risk', firstSeen: 'E03 / Scene 24', detail: 'Tokyo Metro at night. Sarah arrives carrying no luggage and no explanation.' },
  ],
  relationships: [
    { between: 'Sarah Malik and Mara Voss', nature: 'adversary / mirror' },
    { between: 'Sarah Malik and Elias Vale', nature: 'ally / witness' },
    { between: 'Sarah Malik and The Woman in Red', nature: 'unknown / signal' },
  ],
  storyEvents: [
    { episode: 'E01', title: 'The signal is heard', detail: 'Sarah records a voice inside a dead frequency.' },
    { episode: 'E02', title: 'The distance between', detail: 'Sarah chooses London over the team. The timeline holds.' },
    { episode: 'E03', title: 'The memory cascade', detail: 'A second Sarah appears in the evidence.' },
  ],
  timeline: [
    { date: 'Sep 18, 2024', event: 'Sarah hears the signal', source: 'E01 / Scene 07' },
    { date: 'Sep 21, 2024', event: 'The Halcyon drive is recovered', source: 'E02 / Scene 12' },
    { date: 'Sep 22, 2024 · 22:40 BST', event: 'Sarah is in London', source: 'E02 / Scene 19' },
    { date: 'Sep 24, 2024 · night', event: 'Sarah is in Tokyo', source: 'E03 / Scene 24' },
  ],
};

function Workspace() {
  const [activeEvidence, setActiveEvidence] = useState('travel');
  const [draft, setDraft] = useState(false);
  const analysis = useAnalyzeScene();
  const analyze = () => {
    analysis.mutate({
      data: {
        scene: { episode: 'E03', sceneNumber: 24, lines: screenplayLines.map((line) => `${line.type.toUpperCase()}: ${line.text}`) },
        seriesBible: seriesBibleContext,
      },
    });
  };

  const autoTriggeredRef = useRef(false);
  useEffect(() => {
    if (autoTriggeredRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('investigate') === 'true') {
      autoTriggeredRef.current = true;
      analyze();
    }
  }, []);

  const running = analysis.isPending;
  return <div className="mx-auto max-w-[1500px] fade-in">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2"><Link data-testid="link-workspace-back" href="/" className="text-[11px] text-muted-foreground hover:text-primary">Room overview</Link><ChevronRight size={13} className="text-muted-foreground" /><span className="text-[11px] text-foreground">E03 / Scene 24</span></div><h1 className="display text-[28px] font-bold tracking-[-.04em] md:text-[34px]">The Shape of Memory</h1><p className="mt-2 text-[11px] text-muted-foreground">Draft 4 · Updated by Lena Kim 38 minutes ago · <span className="text-secondary">Autosaved locally</span></p></div><div className="flex items-center gap-2"><button data-testid="button-save-draft" onClick={() => setDraft(true)} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] font-semibold hover:bg-muted"><Check size={14} className={draft ? 'text-secondary' : 'text-muted-foreground'} />{draft ? 'Draft saved' : 'Save draft'}</button><button data-testid="button-analyze-scene" onClick={analyze} disabled={running} className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground hover:brightness-105 disabled:opacity-60">{running ? <Activity size={14} className="animate-pulse" /> : <Sparkles size={14} />}{running ? 'Reading the scene…' : analysis.data ? 'Re-analyze scene' : 'Analyze scene'}</button></div></div>
    <div className="mb-4 flex items-center gap-1 overflow-x-auto border-b border-border"><button data-testid="tab-scene-24" className="border-b-2 border-primary px-4 py-3 text-[11px] font-bold text-primary">SCENE 24</button><button data-testid="button-add-scene" onClick={() => setDraft(true)} className="px-4 py-3 text-[11px] text-muted-foreground hover:text-foreground"><Plus size={13} className="mr-1 inline" />Add scene</button><span className="ml-auto hidden items-center gap-2 px-3 text-[10px] text-muted-foreground sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Scene intelligence active</span></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(480px,1fr)_385px]">
      <div className="panel min-h-[690px] overflow-hidden rounded-lg"><div className="flex items-center justify-between border-b border-border bg-card/70 px-5 py-3"><div className="flex items-center gap-3"><FileText size={15} className="text-primary" /><span className="mono text-[9px] uppercase tracking-[.17em] text-muted-foreground">Screenplay / E03 / 24</span></div><div className="flex items-center gap-3 text-muted-foreground"><button data-testid="button-format-screenplay" onClick={() => setDraft(true)} title="Format scene"><Command size={14} /></button><button data-testid="button-expand-screenplay" onClick={() => setDraft(true)} title="Focus editor"><PanelRight size={14} /></button></div></div><div className="mx-auto max-w-[700px] px-8 py-10 md:px-16"><div className="mb-10 border-b border-border pb-4"><div className="mono text-[9px] uppercase tracking-[.15em] text-muted-foreground">INT. / NIGHT / TOKYO</div><div className="mt-2 flex items-center justify-between"><span className="text-[11px] font-bold">SCENE 24</span><span className="mono text-[9px] text-muted-foreground">p. 31</span></div></div><div data-testid="content-screenplay" className="space-y-5">{screenplayLines.map((line, i) => <div key={`${line.type}-${i}`} className={`${line.type === 'scene' ? 'mono text-[11px] font-bold uppercase tracking-[.12em] text-primary' : ''} ${line.type === 'action' ? 'text-[13px] leading-[1.8] text-foreground/85' : ''} ${line.type === 'character' ? 'ml-[35%] pt-2 text-[11px] font-bold uppercase tracking-[.14em] text-secondary' : ''} ${line.type === 'dialogue' ? 'ml-[20%] max-w-[280px] text-[13px] leading-[1.65] text-foreground/85' : ''} ${line.type === 'parenthetical' ? 'ml-[28%] text-[11px] italic text-muted-foreground' : ''}`}>{line.text}</div>)}</div><div className="mt-10 border-t border-dashed border-border pt-4 text-center"><span className="mono text-[9px] uppercase tracking-[.16em] text-muted-foreground/70">End scene</span></div></div></div>
       <InvestigationPanel analysis={analysis.data} error={analysis.error} activeEvidence={activeEvidence} setActiveEvidence={setActiveEvidence} onAnalyze={analyze} running={running} />
    </div>
  </div>;
}

function InvestigationPanel({ analysis, error, activeEvidence, setActiveEvidence, onAnalyze, running }: { analysis?: SceneAnalysis; error: unknown; activeEvidence: string; setActiveEvidence: (value: string) => void; onAnalyze: () => void; running: boolean }) {
  const errorMessage = error && typeof error === 'object' && 'data' in error && typeof error.data === 'object' && error.data && 'error' in error.data ? String(error.data.error) : 'The continuity pass could not be completed.';
  return <aside className="panel h-fit overflow-hidden rounded-lg xl:sticky xl:top-[100px]"><div className="border-b border-border bg-gradient-to-r from-primary/10 to-transparent px-5 py-4"><div className="flex items-center gap-2 text-primary"><BrainCircuit size={18} /><span className="mono text-[9px] uppercase tracking-[.18em]">Narrative intelligence</span><span className="ml-auto flex h-2 w-2 rounded-full bg-secondary" /></div><h2 className="display mt-3 text-[20px] font-bold">Scene investigation</h2><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Continuity, character logic, and story pressure in this scene.</p></div>{!analysis && !running && !error ? <div className="p-5"><div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed border-border bg-background/30 text-center"><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><Play size={16} fill="currentColor" /></div><p className="text-[11px] font-semibold">Scene has not been analyzed</p><p className="mt-1 max-w-[220px] text-[10px] leading-relaxed text-muted-foreground">Run the room’s continuity pass to surface evidence and pressure points.</p></div><button data-testid="button-run-investigation" onClick={onAnalyze} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-[11px] font-bold text-primary-foreground hover:brightness-105"><Zap size={14} />Run continuity pass</button></div> : running ? <div className="space-y-3 p-5"><div className="h-3 w-2/3 animate-pulse rounded bg-muted" /><div className="h-20 animate-pulse rounded bg-muted" /><div className="h-3 w-1/2 animate-pulse rounded bg-muted" /><div className="h-16 animate-pulse rounded bg-muted" /><p className="mono pt-3 text-center text-[9px] uppercase tracking-[.16em] text-primary">Reading canon and scene…</p></div> : error && !analysis ? <div className="p-5"><div className="rounded-md border border-accent/30 bg-accent/8 p-4"><div className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-accent" /><p data-testid="text-analysis-error" className="text-[11px] leading-relaxed text-accent">{errorMessage}</p></div></div><button data-testid="button-retry-analysis" onClick={onAnalyze} className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 py-2.5 text-[11px] font-bold text-primary hover:bg-primary/10"><Sparkles size={14} />Try again</button></div> : <div className="fade-in"><div className="border-b border-border p-5"><div className="mb-3 flex items-center justify-between"><span className="mono text-[9px] uppercase tracking-[.16em] text-accent">{analysis?.findings[0]?.severity ?? 'high'} confidence conflict</span><span className="mono text-[10px] text-accent">{analysis?.findings[0]?.confidence ?? 0} / 100</span></div><h3 className="text-[14px] font-bold leading-snug">{analysis?.findings[0]?.title}</h3><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{analysis?.summary}</p>{analysis?.findings.map((finding) => <div key={finding.title} className="mt-4 rounded-md border border-accent/25 bg-accent/8 p-3"><div className="flex gap-2"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-accent" /><p className="text-[11px] leading-relaxed"><strong className="text-accent">{finding.severity}:</strong> {finding.explanation}</p></div><div className="mt-2 space-y-1">{finding.evidence.map((item) => <div key={item} className="mono text-[9px] text-muted-foreground">{item}</div>)}</div></div>)}</div><div className="p-5"><div className="mb-3 flex items-center justify-between"><span className="mono text-[9px] uppercase tracking-[.16em] text-muted-foreground">Narrative repairs</span><span className="text-[10px] text-muted-foreground">{analysis?.repairs.length ?? 0} options</span></div><div className="space-y-2">{analysis?.repairs.map((repair) => <div key={repair.title} className="rounded-md border border-border p-3"><div className="text-[10px] font-bold text-primary">{repair.title}</div><p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{repair.description}</p><p className="mt-2 text-[9px] leading-relaxed text-secondary">Tradeoff: {repair.tradeoff}</p></div>)}</div><div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground"><Lightbulb size={14} className="text-primary" />Generated by {analysis?.provider ?? 'the room intelligence layer'}.</div><button data-testid="button-reanalyze-scene" onClick={onAnalyze} disabled={running} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 py-2.5 text-[11px] font-bold text-primary hover:bg-primary/10"><Sparkles size={14} />Refresh investigation</button></div></div>}</aside>;
}

const bibleSections = [
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'relationships', label: 'Relationships', icon: GitBranch },
  { id: 'events', label: 'Story events', icon: Zap },
  { id: 'timeline', label: 'Chronological timeline', icon: Clock3 },
];

function Bible() {
  const [section, setSection] = useState('characters');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);
  const filtered = useMemo(() => section === 'characters' ? ['Sarah Malik', 'Mara Voss', 'Elias Vale', 'The Woman in Red'].filter((name) => name.toLowerCase().includes(query.toLowerCase())) : [], [query, section]);
  return <div className="mx-auto max-w-[1440px] fade-in"><SectionHeading eyebrow="Canon / Season 01" title="Series bible" detail="The living record of Echoes of Tomorrow. Every fact here has a source, a confidence, and a consequence." action={<div className="flex items-center gap-2"><div className="relative hidden sm:block"><Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" /><input data-testid="input-bible-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a fact…" className="w-44 rounded-md border border-border bg-card py-2 pl-9 pr-3 text-[11px] outline-none placeholder:text-muted-foreground focus:border-primary/60" /></div><button data-testid="button-bible-add" onClick={() => setSaved(true)} className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground"><Plus size={14} />Add fact</button></div>} />
    <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card/50 p-1">{bibleSections.map((item) => <button data-testid={`button-bible-section-${item.id}`} key={item.id} onClick={() => setSection(item.id)} className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-[10px] font-semibold transition-colors ${section === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon icon={item.icon} size={14} />{item.label}</button>)}</div>
    {section === 'characters' ? <Characters filtered={filtered} query={query} /> : section === 'locations' ? <Locations /> : section === 'relationships' ? <Relationships /> : section === 'events' ? <Events saved={saved} /> : <Timeline />}
  </div>;
}

function Characters({ filtered, query }: { filtered: string[]; query: string }) {
  return <div className="grid gap-5 lg:grid-cols-[1fr_1fr]"><div className="space-y-3">{filtered.map((name, i) => <button data-testid={`button-character-${name.toLowerCase().replaceAll(' ', '-')}`} key={name} className={`panel flex w-full items-center gap-4 rounded-lg p-4 text-left transition-all hover:-translate-y-0.5 ${i === 0 ? 'border-primary/40' : ''}`}><div className={`flex h-11 w-11 items-center justify-center rounded-full text-[12px] font-bold ${i === 0 ? 'bg-accent/20 text-accent' : 'bg-secondary/15 text-secondary'}`}>{name.split(' ').map((n) => n[0]).join('')}</div><div className="min-w-0 flex-1"><div className="text-[13px] font-bold">{name}</div><div className="mt-1 text-[10px] text-muted-foreground">{i === 0 ? 'Protagonist · Memory researcher' : i === 1 ? 'Antagonist · Temporal systems' : i === 2 ? 'Supporting · MI6 liaison' : 'Unknown · Recurring anomaly'}</div></div><span className="mono text-[9px] text-muted-foreground">{i === 0 ? 'CORE' : 'S01'}</span><ChevronRight size={15} className="text-muted-foreground" /></button>)}{!filtered.length && <div className="panel rounded-lg p-10 text-center"><Search size={20} className="mx-auto text-muted-foreground" /><p className="mt-3 text-[12px] font-semibold">No character matches “{query}”</p><p className="mt-1 text-[10px] text-muted-foreground">Try a name or clear the search.</p></div>}</div><CharacterDetail /></div>;
}

function CharacterDetail() {
  return <div className="panel overflow-hidden rounded-lg"><div className="border-b border-border bg-gradient-to-br from-accent/12 to-transparent p-5"><div className="flex items-start justify-between"><div><span className="mono text-[9px] uppercase tracking-[.17em] text-accent">Character / core</span><h2 className="display mt-3 text-[26px] font-bold">Sarah Malik</h2><p className="mt-1 text-[11px] text-muted-foreground">34 · Memory researcher · London / Tokyo</p></div><span className="rounded border border-secondary/30 bg-secondary/10 px-2 py-1 mono text-[9px] text-secondary">CANON</span></div><div className="mt-6 grid grid-cols-2 gap-3"><div><div className="mono text-[9px] text-muted-foreground">WANT</div><div className="mt-1 text-[11px]">Prove the signal is real.</div></div><div><div className="mono text-[9px] text-muted-foreground">FEAR</div><div className="mt-1 text-[11px]">That her memories are borrowed.</div></div></div></div><div className="space-y-4 p-5"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold"><Tag size={13} className="text-primary" />Known facts</div><ul className="space-y-2 text-[11px] leading-relaxed text-muted-foreground"><li className="border-l border-primary/50 pl-3">Was in London, E02 / Scene 19, 22:40 BST.</li><li className="border-l border-primary/50 pl-3">Arrives in Tokyo, E03 / Scene 24, “night.”</li><li className="border-l border-accent/50 pl-3 text-accent">Transit between locations is unaccounted for.</li></ul></div><div className="flex items-center justify-between border-t border-border pt-4"><span className="mono text-[9px] uppercase tracking-[.12em] text-muted-foreground">Last sourced</span><span className="text-[10px] text-primary">E03 / Scene 24</span></div></div></div>;
}

function Locations() {
  return <div className="grid gap-5 md:grid-cols-2"><div className="panel rounded-lg p-5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary/15 text-secondary"><Globe2 size={18} /></div><div><h2 className="text-[14px] font-bold">London</h2><p className="text-[10px] text-muted-foreground">Last seen: E02 / Scene 19</p></div></div><p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">Rain on the glass. Sarah’s flat above the closed bakery. The place where the ordinary timeline ends.</p><div className="mt-5 border-t border-border pt-3 mono text-[9px] uppercase tracking-[.12em] text-primary">Canon location</div></div><div className="panel rounded-lg border-accent/40 p-5"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/15 text-accent"><MapPin size={18} /></div><div><h2 className="text-[14px] font-bold">Tokyo</h2><p className="text-[10px] text-muted-foreground">First appearance: E03 / Scene 24</p></div></div><p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">The metro, the rain, a woman in red. Sarah arrives carrying no luggage and no explanation.</p><div className="mt-5 border-t border-accent/20 pt-3 mono text-[9px] uppercase tracking-[.12em] text-accent">Continuity risk</div></div><div className="panel grid-texture rounded-lg p-5 md:col-span-2"><div className="flex items-center gap-2 text-accent"><Split size={16} /><span className="mono text-[9px] uppercase tracking-[.16em]">Unmissable contradiction</span></div><div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"><div className="rounded-md border border-primary/25 bg-primary/7 p-4"><div className="mono text-[9px] text-primary">E02 · SCENE 19 · 22:40 BST</div><div className="mt-2 text-[15px] font-bold">Sarah is in London.</div><div className="mt-1 text-[10px] text-muted-foreground">“I’m not leaving this city until I know what it heard.”</div></div><ArrowRight className="hidden text-accent md:block" /><div className="rounded-md border border-accent/30 bg-accent/7 p-4"><div className="mono text-[9px] text-accent">E03 · SCENE 24 · NIGHT</div><div className="mt-2 text-[15px] font-bold">Sarah is in Tokyo.</div><div className="mt-1 text-[10px] text-muted-foreground">“I came as soon as I could.” No transit event is logged.</div></div></div><p className="mt-4 text-center text-[11px] font-semibold text-accent">5,500 miles · less than 36 hours · zero explanation</p></div></div>;
}

function Relationships() {
  return <div className="panel rounded-lg p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-[14px] font-bold">Pressure map</h2><p className="mt-1 text-[10px] text-muted-foreground">The relationships that make the mystery move.</p></div><span className="mono text-[9px] text-secondary">4 active edges</span></div><div className="mx-auto flex max-w-[700px] flex-col items-center gap-3"><div className="rounded-full border-2 border-accent/50 bg-accent/10 px-5 py-3 text-[12px] font-bold text-accent">Sarah Malik</div><div className="h-6 w-px bg-gradient-to-b from-accent to-primary" /><div className="grid w-full gap-3 sm:grid-cols-3"><div className="rounded-md border border-border bg-card p-4 text-center"><div className="text-[11px] font-bold">Mara Voss</div><div className="mt-2 mono text-[9px] text-accent">adversary / mirror</div></div><div className="rounded-md border border-border bg-card p-4 text-center"><div className="text-[11px] font-bold">Elias Vale</div><div className="mt-2 mono text-[9px] text-secondary">ally / witness</div></div><div className="rounded-md border border-border bg-card p-4 text-center"><div className="text-[11px] font-bold">Woman in Red</div><div className="mt-2 mono text-[9px] text-primary">unknown / signal</div></div></div></div></div>;
}

function Events({ saved }: { saved: boolean }) {
  const events = [{ ep: 'E01', title: 'The signal is heard', desc: 'Sarah records a voice inside a dead frequency.', tone: 'secondary' }, { ep: 'E02', title: 'The distance between', desc: 'Sarah chooses London over the team. The timeline holds.', tone: 'primary' }, { ep: 'E03', title: 'The memory cascade', desc: 'A second Sarah appears in the evidence.', tone: 'accent' }];
  const toneClasses: Record<string, string> = { secondary: 'bg-secondary/15 text-secondary', primary: 'bg-primary/15 text-primary', accent: 'bg-accent/15 text-accent' };
  return <div className="space-y-3">{saved && <div data-testid="status-bible-saved" className="flex items-center gap-2 rounded-md border border-secondary/25 bg-secondary/8 px-4 py-3 text-[11px] text-secondary"><Check size={14} />New fact draft added to the room’s capture queue.</div>}{events.map((event) => <div data-testid={`card-story-event-${event.ep}`} key={event.ep} className="panel flex gap-4 rounded-lg p-5"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md mono text-[10px] font-bold ${toneClasses[event.tone]}`}>{event.ep}</div><div className="flex-1"><h2 className="text-[13px] font-bold">{event.title}</h2><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{event.desc}</p></div><ChevronRight size={15} className="text-muted-foreground" /></div>)}</div>;
}

function Timeline() {
  return <div className="panel rounded-lg p-5"><div className="mb-6 flex items-center gap-2"><Clock3 size={16} className="text-primary" /><h2 className="text-[14px] font-bold">The story, in order</h2></div><div className="relative ml-3 border-l border-border pl-7">{[['SEP 18 · 2024','Sarah hears the signal','E01 / Scene 07'],['SEP 21 · 2024','The Halcyon drive is recovered','E02 / Scene 12'],['SEP 22 · 2024 · 22:40 BST','Sarah is in London','E02 / Scene 19'],['SEP 24 · 2024 · NIGHT','Sarah is in Tokyo','E03 / Scene 24 · CONTRADICTION']].map(([date,title,source], i) => <div data-testid={`row-timeline-${i}`} key={date} className="relative pb-7 last:pb-0"><span className={`absolute -left-[34px] top-0 h-3 w-3 rounded-full border-2 ${i === 3 ? 'border-accent bg-accent/20' : 'border-primary bg-background'}`} /><div className="mono text-[9px] tracking-[.12em] text-primary">{date}</div><div className="mt-2 text-[13px] font-bold">{title}</div><div className={`mt-1 text-[10px] ${i === 3 ? 'text-accent' : 'text-muted-foreground'}`}>{source}</div></div>)}</div></div>;
}

function Router() {
  const [location] = useLocation();
  return <AppShell><ErrorBoundary resetKey={location}><Switch><Route path="/" component={Dashboard} /><Route path="/workspace" component={Workspace} /><Route path="/bible" component={Bible} /><Route><div className="py-20 text-center"><Compass size={28} className="mx-auto text-primary" /><h1 className="mt-5 display text-2xl font-bold">This page is off the call sheet.</h1><Link href="/" className="mt-4 inline-block text-[12px] text-primary hover:underline">Return to room overview</Link></div></Route></Switch></ErrorBoundary></AppShell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
