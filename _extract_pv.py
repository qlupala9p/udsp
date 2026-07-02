import pdfplumber, os, re

p = os.path.join(os.environ['TEMP'], 'Complete-PV-list.pdf')
pdf = pdfplumber.open(p)

C1, C2 = 125, 310  # x boundaries: <125 col1(PV), <310 col2(meaning), else col3(example)
LINE_TOL = 4       # words within this top-diff are same visual line

def col_of(x0):
    if x0 < C1: return 0
    if x0 < C2: return 1
    return 2

def group_lines(words):
    words = sorted(words, key=lambda w: (round(w['top']), w['x0']))
    lines = []
    for w in words:
        if lines and abs(w['top'] - lines[-1]['top']) <= LINE_TOL:
            lines[-1]['words'].append(w)
            lines[-1]['top'] = min(lines[-1]['top'], w['top'])
        else:
            lines.append({'top': w['top'], 'words': [w]})
    for ln in lines:
        ln['words'].sort(key=lambda w: w['x0'])
        ln['cols'] = ['', '', '']
        for w in ln['words']:
            c = col_of(w['x0'])
            ln['cols'][c] = (ln['cols'][c] + ' ' + w['text']).strip()
    return lines

def parse_page(pg, gap=16):
    lines = [ln for ln in group_lines(pg.extract_words()) if ln['top'] > 95]
    lines.sort(key=lambda l: l['top'])
    # cluster lines into rows by vertical gap
    rows_lines = []
    for ln in lines:
        if rows_lines and (ln['top'] - rows_lines[-1][-1]['top']) <= gap:
            rows_lines[-1].append(ln)
        else:
            rows_lines.append([ln])
    out = []
    for grp in rows_lines:
        pv = ' '.join(l['cols'][0] for l in grp if l['cols'][0])
        m = ' '.join(l['cols'][1] for l in grp if l['cols'][1])
        e = ' '.join(l['cols'][2] for l in grp if l['cols'][2])
        pv = re.sub(r'\s+', ' ', pv).strip()
        m = re.sub(r'\s+', ' ', m).strip()
        e = re.sub(r'\s+', ' ', e).strip()
        if pv.lower() in ('phrasal verb', 'phrasal', 'verb') or m == 'Meaning':
            continue
        out.append((pv, m, e, bool(pv)))
    return out

import json

def clean(s):
    s = s.replace('\\', '')
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.replace(' .', '.').replace('..', '.')
    return s

allrows = []
for pi, pg in enumerate(pdf.pages):
    page_rows = parse_page(pg)
    for ci, (pv, m, e, has_pv) in enumerate(page_rows):
        # A page's first content cluster with no phrasal verb is the tail of
        # the previous page's last row (row split across the page break).
        if ci == 0 and not has_pv and allrows:
            ppv, pm, pe = allrows[-1]
            allrows[-1] = (ppv, (pm + ' ' + m).strip(), (pe + ' ' + e).strip())
        else:
            allrows.append((pv, m, e))

# clean + dedupe
seen = set()
rows = []
for pv, m, e in allrows:
    pv = clean(pv)
    m = clean(m)
    e = clean(e)
    if not pv:
        continue
    if not m and not e:
        continue
    key = (pv.lower(), m, e)
    if key in seen:
        continue
    seen.add(key)
    rows.append((pv, m, e))

print('RAW ROWS:', len(allrows), 'CLEAN/DEDUPED:', len(rows))
print('empty meaning:', sum(1 for _, m, _ in rows if not m))
print('empty example:', sum(1 for _, _, e in rows if not e))
for pv, m, e in rows:
    if pv in ('bring on', 'bring out', 'bring forward', 'bring in'):
        print(f'PV={pv!r}\n  M={m!r}\n  E={e!r}')

# write JS file
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'phrasalverbsen.js')
lines = []
lines.append('// Complete Phrasal Verbs list (English).')
lines.append('// Source: languageforlife.es "Complete Phrasal Verbs List" (Complete-PV-list.pdf).')
lines.append('// Extracted as: phrasal verb (word), meaning (definition), and example sentence.')
lines.append('// Same structure as the data/words*.js files (window.PHRASAL_VERBS_EN).')
lines.append('')
lines.append('window.PHRASAL_VERBS_EN = [')
for pv, m, e in rows:
    lines.append('  {')
    lines.append('    word: ' + json.dumps(pv.lower(), ensure_ascii=False) + ',')
    lines.append('    pos: "phrasal verb",')
    lines.append('    level: "PV",')
    lines.append('    definition: ' + json.dumps(m, ensure_ascii=False) + ',')
    lines.append('    example: ' + json.dumps(e, ensure_ascii=False) + ',')
    lines.append('  },')
lines.append('];')
lines.append('')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print('WROTE', out_path, 'entries:', len(rows))
