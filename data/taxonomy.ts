// キャラクター/モンスターの分類定義。
// ここを編集すれば生成対象の網羅範囲が変わります（枚数・費用に直結）。
//
// - key:     安定したID（英小文字・ハイフン）。ファイル名やJSONのキーに使う。変更しない方が安全。
// - labelJa: 日本語の表示名（SPAや配信JSONに載る）。
// - prompt:  画像生成プロンプトに差し込む英語の断片。

export interface Attribute {
  key: string
  labelJa: string
  prompt: string
}

/** 種族（10） */
export const races: Attribute[] = [
  { key: 'human', labelJa: '人間', prompt: 'human' },
  { key: 'elf', labelJa: 'エルフ', prompt: 'elf with long pointed ears and slender, graceful features' },
  { key: 'dwarf', labelJa: 'ドワーフ', prompt: 'dwarf, short and stocky with broad shoulders and rugged features' },
  { key: 'halfling', labelJa: 'ハーフリング', prompt: 'halfling, small in stature with a round friendly face and curly hair' },
  { key: 'gnome', labelJa: 'ノーム', prompt: 'gnome, very small with bright curious eyes and a large nose' },
  { key: 'half-orc', labelJa: 'ハーフオーク', prompt: 'half-orc with greenish-gray skin, small protruding tusks, and a strong heavy jaw' },
  { key: 'tiefling', labelJa: 'ティーフリング', prompt: 'tiefling with curved horns, reddish skin, a long tail, and faintly glowing eyes' },
  // ※「dragonborn」の語は人型に引っ張られるため使わず、描写で竜頭を指定する。
  { key: 'dragonborn', labelJa: 'ドラゴンボーン', prompt: 'bipedal humanoid creature with the head of a dragon — an elongated scaly reptilian snout and jaws lined with sharp fangs, prominent curved horns sweeping back, and reptilian slit-pupil eyes — its whole body covered in dragon-like scales, standing upright on two legs, with no hair and no human facial features' },
  { key: 'lizardfolk', labelJa: 'リザードフォーク', prompt: 'lizardfolk with green scaled reptilian skin, slit eyes, and a fanged snout' },
  { key: 'beastfolk', labelJa: '獣人', prompt: 'beastfolk with feline ears, a fur-covered face, slit-pupil eyes, and whiskers' },
]

/** 性別（2） */
export const genders: Attribute[] = [
  { key: 'male', labelJa: '男性', prompt: 'male' },
  { key: 'female', labelJa: '女性', prompt: 'female' },
]

/** 年齢（3） */
export const ages: Attribute[] = [
  { key: 'young', labelJa: '若年', prompt: 'young adult, around their twenties, with smooth youthful features' },
  { key: 'middle', labelJa: '壮年', prompt: 'middle-aged, around their forties, with mature confident features' },
  { key: 'elderly', labelJa: '老年', prompt: 'elderly, in their sixties or older, with a wrinkled weathered face and gray hair' },
]

/** 職業（12） */
export const professions: Attribute[] = [
  { key: 'fighter', labelJa: '戦士', prompt: 'fighter clad in sturdy plate-and-mail armor, holding a longsword' },
  { key: 'wizard', labelJa: '魔法使い', prompt: 'wizard in arcane robes and a wide-brimmed hat, holding a rune-carved staff' },
  { key: 'cleric', labelJa: '僧侶', prompt: 'cleric in holy vestments bearing a sacred symbol, holding an ornate mace' },
  { key: 'rogue', labelJa: '盗賊', prompt: 'rogue in dark hooded leather armor, holding a dagger, with a sly expression' },
  { key: 'ranger', labelJa: '狩人', prompt: 'ranger in practical leather gear and a traveling cloak, carrying a longbow and quiver' },
  { key: 'bard', labelJa: '吟遊詩人', prompt: 'bard in colorful fashionable clothing, holding a lute, with a charming smile' },
  { key: 'paladin', labelJa: '聖騎士', prompt: 'paladin in shining ornate holy plate armor with a tabard, with a noble radiant bearing' },
  { key: 'monk', labelJa: '武闘家', prompt: 'monk in simple martial-arts robes with wrapped hands and a calm disciplined expression' },
  { key: 'barbarian', labelJa: '野蛮人', prompt: 'barbarian in fur and leather with bare muscular arms, wielding a massive axe, with a fierce look' },
  { key: 'sorcerer', labelJa: '魔術師', prompt: 'sorcerer in elegant mystical attire with glowing magical energy swirling around the hands' },
  { key: 'spellblade', labelJa: '魔法戦士', prompt: 'spellblade in light enchanted armor, holding a glowing rune-etched sword' },
  { key: 'commoner', labelJa: '庶民', prompt: 'commoner in simple humble peasant clothing' },
]

/** モンスター（20種・各2枚）。商標的な固有名は避け汎用名のみ。 */
export const monsters: Attribute[] = [
  { key: 'goblin', labelJa: 'ゴブリン', prompt: 'a goblin, a small green-skinned humanoid with pointed ears, sharp teeth, and crude leather gear' },
  { key: 'kobold', labelJa: 'コボルド', prompt: 'a kobold, a small reptilian dog-like humanoid with scales and a short snout' },
  { key: 'orc', labelJa: 'オーク', prompt: 'an orc, a large muscular green-skinned brute with tusks and crude armor' },
  { key: 'ogre', labelJa: 'オーガ', prompt: 'an ogre, a huge lumbering brute with thick gray skin wielding a massive club' },
  { key: 'troll', labelJa: 'トロル', prompt: 'a troll, a tall gangly green monster with long clawed arms and rubbery flesh' },
  { key: 'skeleton', labelJa: 'スケルトン', prompt: 'an animated skeleton warrior with hollow eye sockets, wielding a rusty sword' },
  { key: 'zombie', labelJa: 'ゾンビ', prompt: 'a zombie, a shambling rotting undead humanoid with decaying flesh and vacant eyes' },
  { key: 'slime', labelJa: 'スライム', prompt: 'a slime, a gelatinous translucent blob creature with a glossy wet surface' },
  { key: 'direwolf', labelJa: 'ダイアウルフ', prompt: 'a dire wolf, a huge feral wolf with shaggy fur and bared fangs' },
  { key: 'giant-spider', labelJa: '巨大蜘蛛', prompt: 'a giant spider, an enormous menacing arachnid with hairy legs and many eyes' },
  { key: 'harpy', labelJa: 'ハーピー', prompt: 'a harpy, a creature with a bird body, feathered wings, sharp talons, and a humanoid face' },
  { key: 'minotaur', labelJa: 'ミノタウロス', prompt: 'a minotaur, a towering bull-headed humanoid with great horns wielding a battle axe' },
  { key: 'golem', labelJa: 'ゴーレム', prompt: 'a golem, a massive humanoid construct made of carved stone etched with glowing runes' },
  { key: 'imp', labelJa: 'インプ', prompt: 'an imp, a tiny red winged devil with small horns, a barbed tail, and a mischievous grin' },
  { key: 'gargoyle', labelJa: 'ガーゴイル', prompt: 'a gargoyle, a winged stone creature with horns, clawed hands, and a fierce stony expression' },
  { key: 'sprite', labelJa: 'スプライト', prompt: 'a sprite, a tiny delicate fairy with glowing translucent insect wings' },
  { key: 'mandrake', labelJa: 'マンドラゴラ', prompt: 'a mandrake, a small plant creature with a humanoid root-shaped body and leafy growth on its head' },
  { key: 'cockatrice', labelJa: 'コカトリス', prompt: 'a cockatrice, a creature with the head and legs of a rooster and the wings and tail of a small dragon' },
  { key: 'dragon', labelJa: 'ドラゴン', prompt: 'a dragon, a majestic large winged reptile with horns, thick scales, and a long tail' },
  { key: 'wyvern', labelJa: 'ワイバーン', prompt: 'a wyvern, a two-legged winged dragon-like creature with a venomous barbed tail' },
]

/** モンスター1種あたりの生成枚数。 */
export const MONSTER_VARIANTS = 2

/** カテゴリ別の属性辞書（taxonomy.json 出力やSPAのフィルタ構築に使用）。 */
export const taxonomy = { races, genders, ages, professions, monsters } as const

/** key → labelJa の早見表を作る補助。 */
export function labelMap(attrs: Attribute[]): Record<string, string> {
  return Object.fromEntries(attrs.map((a) => [a.key, a.labelJa]))
}
