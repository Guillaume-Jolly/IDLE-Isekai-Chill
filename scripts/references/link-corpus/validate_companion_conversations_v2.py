#!/usr/bin/env python3
import json, re, sys, csv
from pathlib import Path
from collections import Counter
BAD_PATTERNS = [
    ("broken_article_plural", re.compile(r"\b(?:de les|à les|à le)\b", re.I)),
    ("broken_que_un", re.compile(r"\b(?:que|qu')\s+(?:un|une)\b", re.I)),
    ("raw_internal_id", re.compile(r"\b(?:arcane-library|ribbon-workshop|star-market|mist-garden|clear-spring|moon-farm|traveler-theater|prairie-solaire|foret-ancienne|marais-brumeux|montagnes-cristallines|desert-rouge|rivage-corallien|volcan-noir|ruines-astrales)\b")),
    ("raw_resource_key", re.compile(r"\b(?:coins|stone|silk|wood|food|gifts|stardust|crystals)\b")),
    ("explicit_sexual", re.compile(r"\b(?:nudité|sexe|sexuel|sexuelle|déshabill|poitrine|fesses|orgasme|pénétration)\b", re.I)),
    ("bad_biome_article", re.compile(r"\bvers\s+(?:Forêt ancienne|Prairie solaire|Marais brumeux|Montagnes cristallines|Désert rouge|Rivage corallien|Volcan noir|Ruines astrales)\b")),
]
VISIBLE_FIELDS = ['title','setting','context','affinityUnlockText','maxAffinityText']
ROUND_FIELDS = ['narrator','companionLine','prompt']
CHOICE_FIELDS = ['text','reaction']
def load(path):
    p=Path(path)
    if p.suffix=='.jsonl':
        return [json.loads(x) for x in p.read_text(encoding='utf-8').splitlines() if x.strip()]
    return json.loads(p.read_text(encoding='utf-8'))
def iter_visible(o):
    for f in VISIBLE_FIELDS:
        if isinstance(o.get(f),str): yield f,o[f]
    for r in o.get('rounds',[]):
        for f in ROUND_FIELDS:
            if isinstance(r.get(f),str): yield 'round.'+f,r[f]
        for ch in r.get('choices',[]):
            for f in CHOICE_FIELDS:
                if isinstance(ch.get(f),str): yield 'choice.'+f,ch[f]
    for k,v in o.get('resultTexts',{}).items():
        if isinstance(v,str): yield 'resultTexts.'+k,v
def validate(path,out_csv=None):
    data=load(path); issues=[]; ids=set(); counts=Counter(); choice_texts=[]; line_texts=[]; prompts=[]
    for idx,o in enumerate(data,1):
        oid=o.get('id',f'line-{idx}')
        if oid in ids: issues.append([oid,'structure','duplicate_id',''])
        ids.add(oid); counts[(o.get('companionId'),o.get('affinity'))]+=1
        if len(o.get('rounds',[]))!=3: issues.append([oid,'structure','round_count',str(len(o.get('rounds',[])))])
        for r in o.get('rounds',[]):
            choices=r.get('choices',[])
            if len(choices)!=4: issues.append([oid,'structure','choice_count',r.get('id','')])
            tones=sorted(ch.get('tone') for ch in choices)
            if tones != ['direct','playful','romantic','sincere']: issues.append([oid,'structure','tone_set',','.join(map(str,tones))])
            for ch in choices:
                if ch.get('score') not in (0,1): issues.append([oid,'structure','bad_score',str(ch.get('score'))])
                choice_texts.append(ch.get('text',''))
            line_texts.append(r.get('companionLine','')); prompts.append(r.get('prompt',''))
        for field,text in iter_visible(o):
            for code,pat in BAD_PATTERNS:
                if pat.search(text): issues.append([oid,field,code,text[:240]])
    for cid in sorted({o.get('companionId') for o in data}):
        for aff in range(1,6):
            if counts[(cid,aff)] != 100: issues.append([f'{cid}-aff{aff}','coverage','bad_count',str(counts[(cid,aff)])])
    stats={
        'conversation_count':len(data),
        'choice_count':sum(len(r.get('choices',[])) for o in data for r in o.get('rounds',[])),
        'unique_choice_texts':len(set(choice_texts)), 'total_choice_texts':len(choice_texts),
        'unique_companion_lines':len(set(line_texts)), 'total_companion_lines':len(line_texts),
        'unique_prompts':len(set(prompts)), 'issue_count':len(issues)
    }
    if out_csv:
        with open(out_csv,'w',newline='',encoding='utf-8') as f:
            w=csv.writer(f); w.writerow(['conversation_id','field','issue','excerpt']); w.writerows(issues)
    return data,issues,stats
if __name__=='__main__':
    data,issues,stats=validate(sys.argv[1], sys.argv[2] if len(sys.argv)>2 else None)
    print(json.dumps(stats,ensure_ascii=False,indent=2))
    if issues: sys.exit(1)
