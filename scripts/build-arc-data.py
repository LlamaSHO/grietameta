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
        'mapIds': list(q.get('map') or []),
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

# --- Mapas --------------------------------------------------------------------------
# Imágenes en arc-maps/<id>.webp. Se usan los mapas con nombres de zona (carpeta «legacy» y los de Stella Montis).
# Riven Tides solo existe como mapa base sin nombres: se monta uniendo las teselas de images/maps/riven-tides/v2/high/2.
MAP_VIEWS = {
    'dam_battlegrounds': [('dam_battlegrounds', '', 'legacy/dam_battlegrounds.png', True)],
    'buried_city': [('buried_city', '', 'legacy/buried_city.png', True)],
    'the_spaceport': [('the_spaceport', '', 'legacy/the_spaceport.png', True)],
    'the_blue_gate': [('the_blue_gate', '', 'legacy/the_blue_gate.png', True)],
    'stella_montis': [('stella_montis_upper', 'Planta superior', 'stella_montis_upper.png', True),
                      ('stella_montis_lower', 'Planta inferior', 'stella_montis_lower.png', True)],
    'riven_tides': [('riven_tides', '', 'riven-tides/v2/high/2', False)],
}
MAP_MAX_SIDE = 3000
Image.MAX_IMAGE_PIXELS = None  # los mapas originales son muy grandes


def load_map_image(src):
    path = os.path.join(REPO, 'images', 'maps', src)
    if os.path.isdir(path):  # pirámide de teselas: carpeta/X/Y.webp, de 512 px
        tiles, w, h = {}, 0, 0
        for xd in os.listdir(path):
            for fn in os.listdir(os.path.join(path, xd)):
                im = Image.open(os.path.join(path, xd, fn)).convert('RGB')
                x, y = int(xd), int(os.path.splitext(fn)[0])
                tiles[(x, y)] = im
                w, h = max(w, x * 512 + im.width), max(h, y * 512 + im.height)
        canvas = Image.new('RGB', (w, h))
        for (x, y), im in tiles.items():
            canvas.paste(im, (x * 512, y * 512))
        return canvas
    return Image.open(path).convert('RGB')


map_dir = os.path.join(OUT, 'arc-maps')
os.makedirs(map_dir, exist_ok=True)
map_registry = []
for mid, views in MAP_VIEWS.items():
    out_views = []
    for view_id, label, src, zones in views:
        im = load_map_image(src)
        im.thumbnail((MAP_MAX_SIDE, MAP_MAX_SIDE), Image.LANCZOS)
        im.save(os.path.join(map_dir, view_id + '.webp'), 'WEBP', quality=74, method=5)
        out_views.append({'file': view_id, 'label': label, 'zoneNames': zones, 'width': im.width, 'height': im.height})
    map_registry.append({'id': mid, 'name': MAP_NAMES[mid], 'views': out_views})

# Todo mapa citado por una misión debe tener imagen.
known_maps = {m['id'] for m in map_registry}
for x in quest_out:
    for mid in x['mapIds']:
        assert mid in known_maps, f"mapa sin imagen: {mid} (misión {x['id']})"

qmeta = dict(meta, count=len(quest_out))
with open(os.path.join(OUT, 'data', 'arc-quests.json'), 'w', encoding='utf-8') as f:
    json.dump({'meta': qmeta, 'maps': map_registry, 'quests': quest_out}, f, ensure_ascii=False, separators=(',', ':'))
print('Misiones:', len(quest_out), '| profundidad máxima:', max(depth.values()))
print('Mapas:', sum(len(m['views']) for m in map_registry), 'imágenes en arc-maps/')


# --- Enemigos -----------------------------------------------------------------------
# Crea data/arc-enemies.json y arc-bots/*.webp para la página de enemigos.
# Los datos de origen NO traen vida, daño por bala ni blindaje de cada ARC. Por eso las armas y
# balas recomendadas son una heurística: se compara la "Penetración de armadura ARC" de cada arma
# con el blindaje estimado del enemigo (según su nivel de amenaza) y se prefiere la munición barata.
import re

BOT_ES = {
    'arc_bastion': ('Asalto pesado', 'Máquinas enormes con forma de cangrejo: lentas pero devastadoras. Destrozan escudos y hacen un daño enorme con sus ataques pesados.',
                    'Destruye el bidón de su parte trasera para dejar al descubierto su punto débil.', 3),
    'arc_bombardier': ('Artillería pesada', 'Enorme unidad de artillería diseñada para bombardear a larga distancia. Muy blindada y con un poder explosivo devastador.',
                       'Dispara al bidón amarillo de la parte trasera: daña directamente su núcleo.', 3),
    'arc_fireball': ('Denegación de zona', 'Pequeño ARC blindado que rueda y escupe fuego. Abre su panel frontal cerca de los Raiders para quemarlos, dejando a la vista su núcleo blando.',
                     'Su núcleo queda expuesto cuando usa el lanzallamas.', 2),
    'arc_hornet': ('Dron medio', 'Dron de clase media con rotores blindados. Dispara proyectiles rápidos y precisos tras un breve aviso con láser rojo. Pensado para destrozar escudos y armaduras ligeras.',
                   'Propulsores traseros sin blindaje.', 0),
    'arc_leaper': ('Máquina de asedio', 'Enorme máquina de asedio con forma de araña, muy blindada y capaz de dar saltos imposibles para alcanzar posiciones elevadas.',
                   'El fuego es lo más eficaz. También puedes dispararle al ojo.', 3),
    'arc_matriarch': ('Jefe', 'Una imponente máquina ARC que hace que la Reina parezca amable. Aparece con una condición de mapa concreta.',
                      'Núcleo central brillante, que queda expuesto cuando ataca. También son vulnerables las articulaciones de las patas y las zonas rojas de la corona.', 4),
    'arc_pop': ('Explosivo', 'Pequeño ARC explosivo que detona al acercarte. Hay que eliminarlo rápido para evitar el daño en área.',
                'Simplemente dispárale.', 0),
    'arc_rocketeer': ('Artillería voladora', 'Formidable ARC volador que domina el espacio aéreo con potentes cohetes y daño en área devastador. Diseñado para saturar zonas de explosiones.',
                      'Destruye dos propulsores o dispara a su núcleo, que está en la parte inferior.', 3),
    'arc_sentinel': ('Torreta francotiradora', 'Torretas estáticas pero letales que se sitúan en puntos elevados. Escanean objetivos con precisión a larga distancia y te fijan desde lejos.',
                     'El bidón amarillo sin blindaje será tu objetivo principal.', 2),
    'arc_shredder': ('Denegación de zona', 'El Shredder aparece en Stella Montis y pone a prueba a los Raiders en encuentros a corta distancia.',
                     'Su punto débil principal es la «barra-ojo» de la cabeza. También puedes disparar al núcleo naranja que se ve entre sus placas.', 2),
    'arc_snitch': ('Dron explorador', 'Dron explorador rápido y sin blindaje con tres rotores. Es frágil, pero funciona como alarma aérea: avisa a refuerzos cuando ve a Raiders.',
                   'Propulsores o placa inferior.', 0),
    'arc_spotter': ('Dron explorador', 'Drones de apoyo voladores del Bombardier. Apuntan con un láser a cualquier Raider a la vista para que el Bombardier dispare con precisión. Si destruyes los dos, reaparece otra pareja. Si el Bombardier cae, huyen.',
                    'Propulsores sin blindaje.', 0),
    'arc_surveyor': ('Reconocimiento', 'El más grande de los ARC rodantes. Se detiene cada cierto tiempo para transmitir señales. Rara vez ataca: suele huir de los Raiders. Se rompe en muchos trozos al recibir daño.',
                     'Expone su núcleo de energía cuando dispara su rayo azul al cielo.', 0),
    'arc_the_queen': ('Jefe', 'Una máquina colosal desplegada durante los eventos de la Cosechadora. Es el Goliat de las fuerzas ARC, con una durabilidad increíble y un arsenal letal. Requiere coordinación de todo el escuadrón.',
                      'Las articulaciones amarillas de las patas. Expone su núcleo cuando dispara el láser.', 4),
    'arc_tick': ('Depredador de emboscada', 'Pequeños robots con forma de araña que saltan sobre los jugadores y se agarran a su cabeza. Rápidos y desorientadores, castigan a los Raiders descuidados.',
                 'Simplemente dispárale. También cae de un golpe cuerpo a cuerpo.', 0),
    'arc_turret': ('Sistema de defensa', 'Pequeña torreta sin blindaje para defensa a corta distancia. Se monta en paredes interiores, detecta movimiento y dispara en ráfaga al ver Raiders.',
                   'Sin blindaje: con dispararle basta.', 0),
    'arc_wasp': ('Dron volador', 'Robots voladores con potentes ametralladoras. Actúan en enjambres, son rápidos, ágiles e implacables. Su zumbido y chirrido son la primera señal de aviso.',
                 'Propulsores sin blindaje.', 0),
}
THREAT_ES = {'Low': 'Baja', 'Moderate': 'Moderada', 'High': 'Alta', 'Critical': 'Crítica', 'Extreme': 'Extrema'}
ARMOR_LABEL = {0: 'Sin blindaje o ligero', 2: 'Blindaje medio', 3: 'Blindaje pesado', 4: 'Blindaje extremo'}
ARMOR_NOTE = {
    0: 'Aquí no hace falta penetración: cualquier arma vale. Elige las que gastan munición barata.',
    2: 'Necesitas al menos penetración «Moderada». Con armas de penetración baja pierdes mucho daño en el blindaje.',
    3: 'Necesitas penetración «Fuerte» o mejor. Las armas de munición ligera casi no hacen nada contra el blindaje.',
    4: 'Lo mejor es la penetración «Muy fuerte» o «Fuerte» y mucha munición. Apunta solo a los puntos débiles.',
}
PEN_RANK = {'Very Weak': 0, 'Weak': 1, 'Moderate': 2, 'Strong': 3, 'Very Strong': 4}
PEN_ES = {'Very Weak': 'Muy baja', 'Weak': 'Baja', 'Moderate': 'Moderada', 'Strong': 'Fuerte', 'Very Strong': 'Muy fuerte'}
AMMO_ID = {'Light Ammo': 'light_ammo', 'Medium Ammo': 'medium_ammo', 'Heavy Ammo': 'heavy_ammo',
           'Shotgun Ammo': 'shotgun_ammo', 'Energy Clip': 'energy_clip'}
WTYPE_ES = {'Assault Rifle': 'Fusil de asalto', 'SMG': 'Subfusil', 'Pistol': 'Pistola', 'Battle Rifle': 'Fusil de combate',
            'Shotgun': 'Escopeta', 'LMG': 'Ametralladora ligera', 'Sniper Rifle': 'Fusil de francotirador', 'Hand Cannon': 'Cañón de mano'}
RARITY_ORDER = {'Common': 0, 'Uncommon': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4}

by_id = {r['id']: r for r in result}


def effect(it, prefix):
    for label, val in it['effects']:
        if label.lower().startswith(prefix):
            return val
    return None


fam = {}
for r in result:
    if r['type'] in WEAPONS:
        fam.setdefault(re.sub(r'_(i|ii|iii|iv)$', '', r['id']), []).append(r)
weapons = []
for key, tiers in fam.items():
    tiers.sort(key=lambda t: t['id'])
    pen = next((effect(t, 'penetraci') for t in tiers if effect(t, 'penetraci')), None)
    ammo = next((effect(t, 'tipo de muni') for t in tiers if effect(t, 'tipo de muni')), None)
    if pen not in PEN_RANK or ammo not in AMMO_ID:
        continue  # sin datos fiables (Canto, Dolabra): no se recomiendan
    icon = next((t['id'] for t in tiers if t['hasImage']), None)
    first = tiers[0]
    name = re.sub(r'\s+(I|II|III|IV)$', '', first['name'])
    weapons.append({'id': key, 'name': name, 'type': WTYPE_ES[first['type']], 'pen': pen, 'penEs': PEN_ES[pen],
                    'ammoId': AMMO_ID[ammo], 'rarity': first['rarity'], 'icon': icon,
                    'ammoValue': by_id[AMMO_ID[ammo]]['value']})
assert len(weapons) >= 15
for w in weapons:
    assert w['ammoId'] in by_id


def pick_weapons(need):
    cand = [w for w in weapons if PEN_RANK[w['pen']] >= min(need, 3)]
    if need == 0:
        # Sin blindaje: lo más barato de usar y fácil de conseguir.
        cand.sort(key=lambda w: (w['ammoValue'], RARITY_ORDER[w['rarity']], w['name']))
    else:
        # Con blindaje: penetración lo más ajustada posible a la necesaria (sin pasarse: un arma
        # legendaria contra un dron medio es un derroche), luego munición barata y fácil de conseguir.
        target = need
        cand.sort(key=lambda w: (abs(PEN_RANK[w['pen']] - target), w['ammoValue'], RARITY_ORDER[w['rarity']], w['name']))
    return cand[:5]


bot_src = json.load(open(os.path.join(REPO, 'bots.json'), encoding='utf-8'))
bot_dir = os.path.join(OUT, 'arc-bots')
os.makedirs(bot_dir, exist_ok=True)
enemies = []
for b in bot_src:
    bid = b['id']
    if bid not in BOT_ES:
        continue
    typ, desc, weak, need = BOT_ES[bid]
    src = os.path.join(REPO, 'images', 'bots', bid + '.png')
    has_img = os.path.isfile(src)
    if has_img:
        with Image.open(src) as im:
            im = im.convert('RGB')
            im.thumbnail((640, 640), Image.LANCZOS)
            im.save(os.path.join(bot_dir, bid + '.webp'), 'WEBP', quality=78, method=5)
    drops = []
    for did in b['drops']:
        assert did in by_id, f'drop desconocido {did} en {bid}'
        d = by_id[did]
        drops.append({'id': did, 'name': d['name'], 'rarity': d['rarity'], 'value': d['value'],
                      'action': d['action'], 'hasImage': d['hasImage']})
    ws = pick_weapons(need)
    ammo_ids = []
    for w in ws:
        if w['ammoId'] not in ammo_ids:
            ammo_ids.append(w['ammoId'])
    ammo = [{'id': a, 'name': by_id[a]['name'], 'value': by_id[a]['value'], 'hasImage': by_id[a]['hasImage']} for a in ammo_ids]
    maps = []
    for m in b['maps']:
        n = MAP_NAMES.get(m) or MAP_NAMES.get(re.sub(r'_(lower|upper)$', '', m))
        assert n, f'mapa sin nombre {m}'
        if n not in maps:
            maps.append(n)
    enemies.append({
        'id': bid, 'name': b['name'].title() if b['name'].isupper() else b['name'], 'type': typ,
        'threat': b['threat'], 'threatEs': THREAT_ES[b['threat']], 'description': desc, 'weakness': weak,
        'maps': maps, 'destroyXp': b['destroyXp'], 'lootXp': b['lootXp'], 'hasImage': has_img,
        'armor': ARMOR_LABEL[need], 'armorNote': ARMOR_NOTE[need],
        'weapons': [{k: w[k] for k in ('id', 'name', 'type', 'penEs', 'ammoId', 'rarity', 'icon')} for w in ws],
        'ammo': ammo, 'drops': drops,
    })
assert len(enemies) == len(BOT_ES) == 17
with open(os.path.join(OUT, 'data', 'arc-enemies.json'), 'w', encoding='utf-8') as f:
    json.dump({'meta': dict(meta, count=len(enemies)), 'enemies': enemies}, f, ensure_ascii=False, separators=(',', ':'))
print('Enemigos:', len(enemies), '| armas candidatas:', len(weapons))
