from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import math, random, wave, struct

root = Path(__file__).resolve().parents[1]
random.seed(20260529)


def ensure(path):
    path.parent.mkdir(parents=True, exist_ok=True)


def save_transparent(path, size, draw_fn):
    ensure(path)
    img = Image.new('RGBA', size, (0,0,0,0))
    d = ImageDraw.Draw(img)
    draw_fn(img, d)
    img.save(path)


def polygon_ship(d, cx, cy, scale, primary, accent, direction='up', heavy=False):
    sign = -1 if direction == 'up' else 1
    body = [(cx, cy + sign*-44*scale), (cx - 28*scale, cy + sign*28*scale), (cx, cy + sign*16*scale), (cx + 28*scale, cy + sign*28*scale)]
    if direction == 'up':
        body = [(cx, cy-44*scale),(cx-28*scale, cy+28*scale),(cx,cy+16*scale),(cx+28*scale,cy+28*scale)]
        left_wing=[(cx-12*scale,cy-8*scale),(cx-54*scale,cy+30*scale),(cx-18*scale,cy+18*scale)]
        right_wing=[(cx+12*scale,cy-8*scale),(cx+54*scale,cy+30*scale),(cx+18*scale,cy+18*scale)]
        engine_y=cy+36*scale
    else:
        body = [(cx, cy+44*scale),(cx-28*scale, cy-28*scale),(cx,cy-16*scale),(cx+28*scale,cy-28*scale)]
        left_wing=[(cx-12*scale,cy+8*scale),(cx-54*scale,cy-30*scale),(cx-18*scale,cy-18*scale)]
        right_wing=[(cx+12*scale,cy+8*scale),(cx+54*scale,cy-30*scale),(cx+18*scale,cy-18*scale)]
        engine_y=cy-36*scale
    if heavy:
        body=[(cx, cy+sign*48*scale),(cx-42*scale,cy-sign*16*scale),(cx-32*scale,cy-sign*40*scale),(cx+32*scale,cy-sign*40*scale),(cx+42*scale,cy-sign*16*scale)]
    d.polygon(left_wing, fill=(45,52,70,255), outline=(120,130,150,180))
    d.polygon(right_wing, fill=(45,52,70,255), outline=(120,130,150,180))
    d.polygon(body, fill=primary, outline=(190,200,210,180))
    d.ellipse((cx-10*scale, cy-10*scale, cx+10*scale, cy+10*scale), fill=accent)
    d.line((cx,cy-28*scale if direction=='up' else cy+28*scale,cx,cy+20*scale if direction=='up' else cy-20*scale), fill=(210,230,255,160), width=max(1,int(3*scale)))
    d.ellipse((cx-16*scale, engine_y-6*scale, cx-4*scale, engine_y+6*scale), fill=accent)
    d.ellipse((cx+4*scale, engine_y-6*scale, cx+16*scale, engine_y+6*scale), fill=accent)

# Player
save_transparent(root/'public/assets/images/player/player_ship_01.png', (128,128), lambda img,d: polygon_ship(d,64,64,1.0,(78,96,120,255),(74,220,255,255),'up'))
# Enemies
save_transparent(root/'public/assets/images/enemies/enemy_small_01.png', (64,64), lambda img,d: polygon_ship(d,32,32,0.48,(86,56,56,255),(255,96,54,255),'down'))
save_transparent(root/'public/assets/images/enemies/enemy_fast_01.png', (64,64), lambda img,d: polygon_ship(d,32,32,0.42,(70,54,62,255),(255,80,42,255),'down'))
save_transparent(root/'public/assets/images/enemies/enemy_heavy_01.png', (96,96), lambda img,d: polygon_ship(d,48,48,0.72,(86,70,66,255),(255,126,42,255),'down', True))
# Boss
save_transparent(root/'public/assets/images/enemies/boss_carrier_01.png', (512,512), lambda img,d: (
    d.polygon([(256,430),(90,170),(160,80),(256,130),(352,80),(422,170)], fill=(68,64,74,255), outline=(160,150,150,200)),
    d.polygon([(256,380),(150,160),(256,80),(362,160)], fill=(95,85,86,255), outline=(210,170,150,180)),
    d.rectangle((188,190,324,302), fill=(45,45,56,255), outline=(150,140,160,180)),
    d.ellipse((226,226,286,286), fill=(255,88,44,255)),
    [d.ellipse((128+i*64,318,158+i*64,348), fill=(255,120,44,255)) for i in range(5)],
    [d.rectangle((96+i*80,155,126+i*80,205), fill=(42,42,54,255), outline=(180,120,90,160)) for i in range(5)]
))

# Bullets
save_transparent(root/'public/assets/images/bullets/bullet_player_01.png', (32,32), lambda img,d: (
    d.ellipse((10,3,22,29), fill=(65,214,255,220)),
    d.ellipse((13,6,19,26), fill=(230,255,255,255))
))
save_transparent(root/'public/assets/images/bullets/bullet_enemy_01.png', (32,32), lambda img,d: (
    d.ellipse((5,5,27,27), fill=(255,89,42,210)),
    d.ellipse((10,10,22,22), fill=(255,215,120,255))
))

# Backgrounds
bg_dir = root/'public/assets/images/backgrounds'
bg_dir.mkdir(parents=True, exist_ok=True)
far = Image.new('RGB',(512,512),(3,8,23)); d=ImageDraw.Draw(far)
for _ in range(220):
    x=random.randrange(512); y=random.randrange(512); v=random.randrange(90,210); r=random.choice([1,1,1,2])
    d.ellipse((x,y,x+r,y+r), fill=(v,v,min(255,v+35)))
far.save(bg_dir/'bg_star_tile_far_01.png')
mid = Image.new('RGBA',(512,512),(0,0,0,0)); d=ImageDraw.Draw(mid)
for _ in range(24):
    x=random.randrange(-60,512); y=random.randrange(-60,512); r=random.randrange(50,140)
    color=random.choice([(35,90,160,26),(92,70,170,22),(40,160,190,18)])
    d.ellipse((x-r,y-r,x+r,y+r), fill=color)
mid=mid.filter(ImageFilter.GaussianBlur(18)); mid.save(bg_dir/'bg_nebula_tile_mid_01.png')
dust = Image.new('RGBA',(512,512),(0,0,0,0)); d=ImageDraw.Draw(dust)
for _ in range(120):
    x=random.randrange(512); y=random.randrange(512); l=random.randrange(1,5); a=random.randrange(45,125)
    d.line((x,y,x,y+l), fill=(180,235,255,a), width=1)
dust.save(bg_dir/'bg_dust_tile_near_01.png')

# Explosion sheet
sheet = Image.new('RGBA',(512,512),(0,0,0,0)); d=ImageDraw.Draw(sheet)
for frame in range(16):
    col=frame%4; row=frame//4; ox=col*128; oy=row*128; cx=ox+64; cy=oy+64
    t=frame/15
    radius=8+52*math.sin(min(1,t*1.25)*math.pi/2)
    alpha=int(255*(1-t*0.8))
    d.ellipse((cx-radius,cy-radius,cx+radius,cy+radius), fill=(255,170,45,alpha))
    d.ellipse((cx-radius*0.45,cy-radius*0.45,cx+radius*0.45,cy+radius*0.45), fill=(255,250,190,alpha))
    for _ in range(8):
        ang=random.random()*math.tau; rr=radius*random.uniform(0.5,1.2)
        x=cx+math.cos(ang)*rr; y=cy+math.sin(ang)*rr
        d.ellipse((x-2,y-2,x+2,y+2), fill=(255,95,35,max(0,alpha-60)))
sheet.save(root/'public/assets/images/effects/effect_explosion_01.png')

# UI assets
ui_dir = root/'public/assets/images/ui'; ui_dir.mkdir(parents=True, exist_ok=True)
save_transparent(ui_dir/'ui_button_01.png', (256,96), lambda img,d: (d.rounded_rectangle((4,4,252,92), radius=22, fill=(17,34,55,220), outline=(80,210,255,190), width=3),))
save_transparent(ui_dir/'ui_module_card_01.png', (360,520), lambda img,d: (d.rounded_rectangle((6,6,354,514), radius=26, fill=(15,23,42,220), outline=(80,210,255,160), width=3),))
save_transparent(ui_dir/'ui_slot_01.png', (128,128), lambda img,d: (d.rounded_rectangle((10,10,118,118), radius=18, fill=(15,23,42,220), outline=(80,210,255,160), width=4), d.rectangle((34,34,94,94), outline=(110,230,255,100), width=2)))
save_transparent(ui_dir/'icon_money_01.png', (64,64), lambda img,d: (d.ellipse((10,10,54,54), fill=(220,174,52,255), outline=(255,230,128,220), width=4), d.arc((20,20,44,44),0,300,fill=(255,250,190,255),width=3)))
save_transparent(ui_dir/'icon_hp_01.png', (64,64), lambda img,d: (d.rounded_rectangle((15,14,49,50), radius=12, fill=(220,45,72,255)), d.polygon([(32,52),(12,30),(22,16),(32,25),(42,16),(52,30)], fill=(240,75,95,255))))
save_transparent(ui_dir/'icon_shield_01.png', (64,64), lambda img,d: (d.polygon([(32,6),(54,16),(50,42),(32,58),(14,42),(10,16)], fill=(54,171,255,230), outline=(185,235,255,255)),))

# Module icons
module_keywords = {
 'weapon_laser_1': ('laser', (80,210,255)), 'weapon_fast_1': ('multi', (80,210,255)), 'weapon_double_1': ('twin', (80,210,255)), 'weapon_spread_1': ('spread', (80,210,255)), 'weapon_railgun_1': ('rail', (110,235,255)),
 'reactor_small_1': ('core', (80,220,255)), 'reactor_power_1': ('power', (120,240,255)), 'reactor_engine_1': ('engine', (80,220,255)), 'reactor_overload_1': ('over', (255,110,40)),
 'shield_basic_1': ('shield', (80,180,255)), 'shield_regen_1': ('regen', (90,230,210)), 'shield_heavy_1': ('armor', (80,150,255)), 'shield_burst_1': ('burst', (120,210,255)),
 'utility_engine_1': ('boost', (80,220,255)), 'utility_radar_1': ('radar', (245,190,70)), 'utility_repair_1': ('repair', (80,230,180)), 'utility_core_1': ('life', (90,170,255)),
}
mod_dir=root/'public/assets/images/modules'; mod_dir.mkdir(parents=True, exist_ok=True)
for mid,(kind,color) in module_keywords.items():
    def draw_icon(img,d,kind=kind,color=color):
        cx=48; cy=48; c=(*color,255)
        d.rounded_rectangle((20,20,76,76), radius=10, fill=(36,44,58,255), outline=(120,140,160,180), width=2)
        if kind in ['laser','rail']:
            d.rectangle((28,40,72,56), fill=(48,58,70,255), outline=c, width=2); d.line((72,48,86,48), fill=c, width=4)
        elif kind in ['multi','twin']:
            for yy in ([38,48,58] if kind=='multi' else [42,54]): d.rectangle((28,yy-4,74,yy+4), fill=(48,58,70,255), outline=c, width=1)
        elif kind=='spread':
            for ang in [-0.45,0,0.45]: d.line((30,58,70+math.cos(ang)*16,48+math.sin(ang)*28), fill=c, width=4)
        elif kind in ['core','power','over','life']:
            d.ellipse((28,28,68,68), fill=(20,28,40,255), outline=c, width=3); d.ellipse((38,38,58,58), fill=c)
        elif kind in ['engine','boost']:
            d.rectangle((28,30,68,58), fill=(50,58,70,255), outline=c, width=2); d.polygon([(36,58),(48,84),(60,58)], fill=c)
        elif kind in ['shield','armor','burst','regen']:
            d.polygon([(48,18),(76,30),(70,64),(48,82),(26,64),(20,30)], fill=(30,44,58,255), outline=c); d.arc((28,28,68,68), 20, 330, fill=c, width=3)
        elif kind=='radar':
            d.ellipse((30,30,66,66), outline=c, width=3); d.line((48,48,76,26), fill=c, width=3); d.arc((18,18,88,88), 300, 40, fill=c, width=2)
        elif kind=='repair':
            d.line((30,64,66,28), fill=c, width=6); d.rectangle((42,24,72,36), fill=(50,58,70,255), outline=c, width=2)
    save_transparent(mod_dir/f'module_{mid}.png', (96,96), draw_icon)

# Data JSON copies
(root/'public/assets/data').mkdir(parents=True, exist_ok=True)
for name in ['enemies','modules','stages','boss']:
    (root/f'public/assets/data/{name}.json').write_text('{}\n')

# Placeholder audio WAVs
sfx_dir=root/'public/assets/audio/sfx'; sfx_dir.mkdir(parents=True, exist_ok=True)
for name in ['sfx_shoot','sfx_enemy_hit','sfx_explosion','sfx_module_select','sfx_slot_unlock','sfx_player_hit','sfx_boss_warning','sfx_victory','sfx_defeat']:
    path=sfx_dir/f'{name}.wav'
    with wave.open(str(path),'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(22050)
        frames=[]
        for i in range(1102):
            val=int(12000*math.sin(2*math.pi*440*i/22050)*math.exp(-i/1102*5))
            frames.append(struct.pack('<h',val))
        w.writeframes(b''.join(frames))
# Tiny placeholder mp3 marker, not loaded by current runtime.
bgm_dir=root/'public/assets/audio/bgm'; bgm_dir.mkdir(parents=True, exist_ok=True)
(bgm_dir/'bgm_battle.mp3').write_bytes(b'ID3\x04\x00\x00\x00\x00\x00\x00')
print('assets generated')
