#!/usr/bin/env python3
"""
Genera los datos de ArcMeta a partir del repositorio de la comunidad
https://github.com/RaidTheory/arcraiders-data (licencia MIT).

Uso:
    git clone --depth 1 https://github.com/RaidTheory/arcraiders-data /ruta/arcraiders-data
    python3 -I scripts/build-arc-data.py /ruta/arcraiders-data .

Crea (dentro de la carpeta de salida):
    data/arc-items.json   -> todos los objetos, en español, con la recomendación calculada
    arc-img/<id>.webp     -> iconos reducidos a 160 px
    data/LICENSE-arcraiders-data.txt

La recomendación (Vender / Reciclar / Guardar / Usar) NO viene en los datos de origen:
la calcula este script con reglas sencillas (ver recommend()). Es orientativa.
"""
import glob
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone

from PIL import Image

if len(sys.argv) != 3:
    sys.exit(__doc__)
REPO, OUT = sys.argv[1], sys.argv[2]

WEAPONS = {'Assault Rifle', 'SMG', 'Pistol', 'Battle Rifle', 'Shotgun', 'LMG', 'Sniper Rifle', 'Hand Cannon'}
USE_REASON = {
    'Quick Use': 'Consumible: úsalo durante la partida.',
    'Ammunition': 'Munición: úsala con tus armas.',
    'Augment': 'Aumento: equípalo en tu equipo.',
    'Shield': 'Escudo: equípalo en tu equipo.',
    'Modification': 'Mejora para armas: instálala en tu arma.',
    'Blueprint': 'Plano: úsalo para aprender la receta.',
    'Key': 'Llave: úsala para abrir una zona o sala.',
}
WEAPON_REASON = 'Arma: equípala o mejórala.'
NEED_ORDER = {'Taller': 0, 'Proyecto': 1, 'Misión': 2}


def es(d):
    if not isinstance(d, dict):
        return d or ''
    return d.get('es') or d.get('en') or ''


def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


now = time.time()
items = {}
for path in sorted(glob.glob(os.path.join(REPO, 'items', '*.json'))):
    it = load_json(path)
    items[it['id']] = it

# --- Dónde se necesita cada objeto -------------------------------------------------
needs = {}  # item_id -> lista de {kind, name, label, qty}


def add_need(item_id, kind, name, label, qty):
    if item_id in items:
        needs.setdefault(item_id, []).append({'kind': kind, 'name': name, 'label': label, 'qty': qty})


stations = {}
for path in sorted(glob.glob(os.path.join(REPO, 'hideout', '*.json'))):
    h = load_json(path)
    stations[h['id']] = es(h['name'])
    for lvl in h.get('levels', []):
        for r in lvl.get('requirementItemIds') or []:
            add_need(r['itemId'], 'Taller', es(h['name']), f"nivel {lvl['level']}", r.get('quantity', 1))

for p in load_json(os.path.join(REPO, 'projects.json')):
    end = p.get('endDate')
    if p.get('disabled') or (end is not None and end < now):
        continue  # proyecto desactivado o ya terminado: no hace falta guardar nada para él
    for ph in p.get('phases', []):
        for r in ph.get('requirementItemIds') or []:
            add_need(r['itemId'], 'Proyecto', es(p['name']), f"fase {ph['phase']}", r.get('quantity', 1))

for path in sorted(glob.glob(os.path.join(REPO, 'quests', '*.json'))):
    q = load_json(path)
    for r in q.get('requiredItemIds') or []:
        add_need(r['itemId'], 'Misión', es(q['name']), '', r.get('quantity', 1))


def mats(d):
    """{id: qty} -> [{id, name, qty}] con el nombre en español."""
    out = []
    for mid, qty in (d or {}).items():
        out.append({'id': mid, 'name': es(items[mid]['name']) if mid in items else mid, 'qty': qty})
    return out


def value_of(d):
    return sum(qty * items[mid].get('value', 0) for mid, qty in (d or {}).items() if mid in items)


def need_text_short(n):
    return f"{n['name']} {n['label']}".strip()


def need_text(n):
    return f"{need_text_short(n)} (×{n['qty']})"


def fmt(n):
    return f'{n:,}'.replace(',', '.')


def recommend(it, need_list, recycle_value):
    """Devuelve (acción, motivo). Reglas, por orden:
    1. Si lo pide el taller, un proyecto activo o una misión -> Guardar.
    2. Si es equipo, consumible, plano, llave, arma o mejora -> Usar.
    3. Si al reciclarlo se obtiene algún material que piden el taller, un proyecto o una
       misión (o los materiales valen más que venderlo) -> Reciclar.
    4. En cualquier otro caso -> Vender.
    """
    value = it.get('value', 0)
    recycles = it.get('recyclesInto') or {}
    if need_list:
        total = sum(n['qty'] for n in need_list)
        shown = ', '.join(need_text(n) for n in need_list[:3])
        extra = f' y {len(need_list) - 3} más' if len(need_list) > 3 else ''
        return 'Guardar', f'Lo piden: {shown}{extra}. Necesitas {total} en total.'
    if it.get('questItem'):
        return 'Guardar', 'Objeto de misión: guárdalo hasta entregarlo.'
    t = it.get('type')
    base = WEAPON_REASON if t in WEAPONS else USE_REASON.get(t)
    if base:
        # En planos y llaves no se afirma que se puedan vender: los datos no lo indican.
        if t not in ('Blueprint', 'Key') and value > 0:
            base += f' Valor de venta: {fmt(value)}.'
        return 'Usar', base
    wanted = [mid for mid in recycles if mid in needs]
    if wanted or (recycle_value > value and recycle_value > 0):
        parts = []
        for mid in wanted[:2]:
            first = sorted(needs[mid], key=lambda n: (NEED_ORDER[n['kind']], n['name'], n['label']))[0]
            parts.append(f"{es(items[mid]['name'])} (se pide en {need_text_short(first)})")
        if parts:
            why = 'Al reciclarlo obtienes materiales que necesitas: ' + ', '.join(parts) + '.'
        else:
            why = 'Los materiales que da valen más que su venta.'
        return 'Reciclar', f'{why} Materiales por valor de {fmt(recycle_value)} frente a {fmt(value)} si lo vendes.'
    if recycle_value > 0:
        return 'Vender', f'Se vende por {fmt(value)}; reciclarlo daría materiales por valor de {fmt(recycle_value)} que no te piden.'
    return 'Vender', f'Se vende por {fmt(value)}. No se puede reciclar.'


# --- Imágenes -----------------------------------------------------------------------
img_dir = os.path.join(OUT, 'arc-img')
os.makedirs(img_dir, exist_ok=True)
src_img = os.path.join(REPO, 'images', 'items')


def make_image(item_id):
    src = os.path.join(src_img, item_id + '.png')
    if not os.path.isfile(src):
        return False
    with Image.open(src) as im:
        im = im.convert('RGBA')
        im.thumbnail((160, 160), Image.LANCZOS)
        im.save(os.path.join(img_dir, item_id + '.webp'), 'WEBP', quality=80, method=4)
    return True


# --- Construcción -------------------------------------------------------------------
result = []
for item_id, it in items.items():
    need_list = sorted(needs.get(item_id, []), key=lambda n: (NEED_ORDER[n['kind']], n['name'], n['label']))
    rec_val = value_of(it.get('recyclesInto'))
    action, reason = recommend(it, need_list, rec_val)

    bench = it.get('craftBench')
    if isinstance(bench, list):
        bench = bench[0] if bench else None
    recipe = None
    if it.get('recipe'):
        recipe = {
            'bench': 'En partida' if bench == 'in_raid' else stations.get(bench, bench),
            'level': it.get('stationLevelRequired'),
            'materials': mats(it['recipe']),
        }

    effects = []
    for label, e in (it.get('effects') or {}).items():
        if isinstance(e, dict) and e.get('value') not in (None, '', 0):
            effects.append([es(e) or label, str(e['value'])])

    result.append({
        'id': item_id,
        'name': es(it['name']),
        'description': es(it.get('description')),
        'type': it.get('type'),
        'rarity': it.get('rarity'),
        'value': it.get('value', 0),
        'weightKg': it.get('weightKg'),
        'stackSize': it.get('stackSize'),
        'hasImage': make_image(item_id),
        'action': action,
        'reason': reason,
        'recyclesInto': mats(it.get('recyclesInto')),
        'recycleValue': rec_val,
        'salvagesInto': mats(it.get('salvagesInto')),
        'neededFor': need_list,
        'recipe': recipe,
        'effects': effects,
    })

result.sort(key=lambda x: x['name'].lower())

# Comprobación de integridad: cada material referenciado debe existir.
ids = {r['id'] for r in result}
for r in result:
    for m in r['recyclesInto'] + r['salvagesInto'] + (r['recipe']['materials'] if r['recipe'] else []):
        assert m['id'] in ids, f"material desconocido {m['id']} en {r['id']}"

def git(*args):
    try:
        return subprocess.check_output(['git', '-C', REPO, *args], text=True).strip()
    except Exception:
        return ''

meta = {
    'generated': datetime.now(timezone.utc).strftime('%Y-%m-%d'),
    'sourceCommit': git('rev-parse', '--short', 'HEAD'),
    'sourceDate': git('log', '-1', '--format=%cs'),
    'count': len(result),
}

os.makedirs(os.path.join(OUT, 'data'), exist_ok=True)
with open(os.path.join(OUT, 'data', 'arc-items.json'), 'w', encoding='utf-8') as f:
    json.dump({'meta': meta, 'items': result}, f, ensure_ascii=False, separators=(',', ':'))
shutil.copyfile(os.path.join(REPO, 'LICENSE'), os.path.join(OUT, 'data', 'LICENSE-arcraiders-data.txt'))

counts = {}
for r in result:
    counts[r['action']] = counts.get(r['action'], 0) + 1
print(meta)
print('Recomendaciones:', counts)
print('Sin imagen:', sum(1 for r in result if not r['hasImage']))


# --- Misiones -----------------------------------------------------------------------
# Crea data/arc-quests.json para la página de seguimiento de misiones.
# Los nombres de mapa en español de la fuente son claves rotas, así que se usan los nombres del juego.
MAP_NAMES = {
    'dam_battlegrounds': 'Dam Battlegrounds',
    'buried_city': 'Buried City',
    'the_spaceport': 'Spaceport',
    'the_blue_gate': 'Blue Gate',
    'stella_montis': 'Stella Montis',
    'riven_tides': 'Riven Tides',
}
# Recompensas que no son objetos del catálogo.
EXTRA_REWARD_NAMES = {'coins': 'Monedas', 'raider_tokens': 'Raider Tokens', 'extended_barrel': 'Cañón extendido'}


def reward_list(lst):
    out = []
    for r in lst or []:
        iid = r['itemId']
        name = es(items[iid]['name']) if iid in items else EXTRA_REWARD_NAMES.get(iid, iid.replace('_', ' ').capitalize())
        out.append({'id': iid, 'name': name, 'qty': r.get('quantity', 1), 'isItem': iid in items})
    return out


quests = {}
for path in sorted(glob.glob(os.path.join(REPO, 'quests', '*.json'))):
    q = load_json(path)
    quests[q['id']] = q

# Profundidad en la cadena de misiones (0 = primera): sirve para ordenarlas.
depth = {}


def get_depth(qid, seen=()):
    if qid in depth:
        return depth[qid]
    assert qid not in seen, f'ciclo en misiones: {qid}'
    prev = [p for p in (quests[qid].get('previousQuestIds') or []) if p in quests]
    depth[qid] = 0 if not prev else 1 + max(get_depth(p, seen + (qid,)) for p in prev)
    return depth[qid]


quest_out = []
for qid, q in quests.items():
    quest_out.append({
        'id': qid,
        'name': es(q['name']),
        'trader': q.get('trader') or '',
        'maps': [MAP_NAMES.get(m, m) for m in (q.get('map') or [])],
        'description': es(q.get('description')).replace('\r\n', '\n'),
        'objectives': [es(o) for o in (q.get('objectives') or []) if es(o)],
        'xp': q.get('xp') or 0,
        'required': reward_list(q.get('requiredItemIds')),
        'rewards': reward_list(q.get('rewardItemIds')),
        'granted': reward_list(q.get('grantedItemIds')),
        'other': list(q.get('otherRequirements') or []),
        'prev': [p for p in (q.get('previousQuestIds') or []) if p in quests],
        'next': [n for n in (q.get('nextQuestIds') or []) if n in quests],
        'depth': get_depth(qid),
    })
quest_out.sort(key=lambda x: (x['depth'], x['trader'], x['name'].lower()))
for n, x in enumerate(quest_out):
    x['order'] = n

# Integridad: todo id referenciado existe y las misiones de una cadena son coherentes.
qids = {x['id'] for x in quest_out}
for x in quest_out:
    assert set(x['prev']) <= qids and set(x['next']) <= qids, x['id']

qmeta = dict(meta, count=len(quest_out))
with open(os.path.join(OUT, 'data', 'arc-quests.json'), 'w', encoding='utf-8') as f:
    json.dump({'meta': qmeta, 'quests': quest_out}, f, ensure_ascii=False, separators=(',', ':'))
print('Misiones:', len(quest_out), '| profundidad máxima:', max(depth.values()))
