// === Utils ===
const byId = id => document.getElementById(id);
const voyelle = ch => /^[aeiouyàâäéèêëîïôöùûüÿh]/i.test(ch);
const articlePossessif = n => (n.g === 'p' ? 'mes' : (n.g === 'f' ? (voyelle(n.w) ? 'mon' : 'ma') : 'mon'));
const aOuOnt = s => (s.g === 'p' ? 'ont' : 'a');
const maj = s => s.charAt(0).toUpperCase() + s.slice(1);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const coinFlip = (p = 0.5) => Math.random() < p;

// === Roles ===
const REL = [
    { w: 'mari', g: 'm' }, { w: 'femme', g: 'f' }, { w: 'époux', g: 'm' }, { w: 'épouse', g: 'f' },
    { w: 'fiancé', g: 'm' }, { w: 'fiancée', g: 'f' },
    { w: 'petit ami', g: 'm' }, { w: 'petite amie', g: 'f' },
    { w: 'meilleur ami', g: 'm' }, { w: 'meilleure amie', g: 'f' },
    { w: 'voisin', g: 'm' }, { w: 'voisine', g: 'f' },
    { w: 'patron', g: 'm' }, { w: 'patronne', g: 'f' },
    { w: 'collègue', g: 'm' }, { w: 'collègue', g: 'f' },
    { w: 'frère', g: 'm' }, { w: 'soeur', g: 'f' }, { w: 'sœur', g: 'f' },
    { w: 'fils', g: 'm' }, { w: 'fille', g: 'f' },
    { w: 'mère', g: 'f' }, { w: 'père', g: 'm' },
    { w: 'colocataire', g: 'm' }, { w: 'colocataire', g: 'f' },
    { w: 'banquier', g: 'm' }, { w: 'banquière', g: 'f' },
    { w: 'coach', g: 'm' }, { w: 'coach', g: 'f' },
    { w: 'professeur', g: 'm' }, { w: 'professeure', g: 'f' },
    { w: 'voleurs', g: 'p' }, { w: 'amis', g: 'p' }, { w: 'parents', g: 'p' }, { w: 'collègues', g: 'p' }
];
// Non‑famille (pour soft/hard)
const REL_NONFAM = REL.filter(r => !['frère', 'soeur', 'sœur', 'fils', 'fille', 'mère', 'père', 'parents'].includes(r.w));

// === Core lexicon ===
const ACTIONS = [
    'menait une double vie', 'a disparu sans laisser de trace', 'm\u2019a trahi', 'm\u2019a manipulé', 'a volé mon identité', 'a ruiné notre mariage', 'a orchestré un mensonge', 'vivait sous une fausse identité', 'a tout avoué', 'm\u2019a abandonné devant l\u2019évidence', 'a dévoilé un secret inavouable', 'a mis ma famille en danger', 'a retourné tout le quartier contre moi', 'm\u2019a piégé avec un contrat', 'a détruit ma réputation en ligne', 'a disparu le jour du mariage', 'm\u2019a accusé à tort', 'a avoué l\u2019évidence'
];
const EVENEMENTS = [
    'Une lettre anonyme a tout révélé', 'Un test ADN a bouleversé nos vies', 'Un appel en pleine nuit a tout changé', 'Une photo oubliée a percé le secret', 'La vérité a éclaté pendant l’anniversaire', 'Une étrangère a frappé à ma porte', 'Un message vocal a tout fait basculer', 'Une plainte a été déposée', 'Une vidéo a fuité sur les réseaux', 'Un colis piégé a été livré par erreur'
];
const CONSEQUENCES = [
    'et tout a basculé', 'et ma vie n’a plus jamais été la même', 'jusqu’à détruire ma famille', 'au point de briser nos liens', 'et la vérité a enfin éclaté', 'et j’étais la dernière au courant'
];

const INTENSIFIEURS = ['terriblement', 'violemment', 'douloureusement', 'brutalement', 'cruellement', 'inexplicablement', 'soudainement', 'fiévreusement', 'sensuellement', 'de façon scandaleuse'];
const QUALIFICATIFS = ['inavouable', 'impensable', 'explosif', 'inattendu', 'tordu', 'dangereux', 'insoutenable', 'obsessionnel', 'toxique', 'interdit', 'provocant', 'suggestif', 'sulfureux', 'incandescent'];
const VERITES = ['la vérité', 'un secret de famille', 'un passé caché', 'une double vie', 'une trahison', 'un complot', 'une dette inavouable', 'une liaison interdite', 'un désir inavoué', 'un adultère', 'une passion brûlante'];
const VERBES = ['avouer', 'confesser', 'révéler', 'démasquer', 'découvrir'];

// === Themes ===
const THEMES = {
    bureau: {
        suggestifs: [
            'multipliait les sous‑entendus au travail', 'a franchi la ligne de la bienséance', 'm\u2019a invité à un tête‑à‑tête “professionnel”', 'laissait des messages vocaux trop chaleureux', 's\u2019attardait après les réunions pour me parler en privé', 'a transformé une formation en jeu de séduction', 'a fait circuler des rumeurs salées à mon sujet', 'm\u2019a proposé un “debrief” très tardif', 'ajoutait des émojis équivoques à tous ses messages', 'a laissé un post‑it ambigu sur mon bureau'
        ],
        events: [
            'Un dîner professionnel a dérapé', 'Une réunion s’est terminée derrière des portes closes', 'Des messages privés ont fuité', 'Une photo compromettante a circulé au bureau', 'La machine à café a tout entendu'
        ],
        consequences: ['jusqu’à faire jaser tout le service', 'et la frontière pro‑perso a disparu', 'et la rumeur a explosé en ligne']
    },
    voisinage: {
        suggestifs: [
            'me lançait des regards par‑dessus la haie', 'trouvait toujours un prétexte pour passer chez moi', 'me laissait des notes équivoques dans l’ascenseur', 'mettait la musique trop fort pour attirer mon attention', 'm\u2019a invité à “arroser les plantes” à minuit'
        ],
        events: [
            'Un voisin a surpris une scène gênante', 'Le syndic a reçu une plainte anonyme', 'Une caméra de palier a tout filmé', 'Un colis livré par erreur a révélé trop de choses'
        ],
        consequences: ['et tout l’immeuble a jasé', 'et nos portes sont restées entrouvertes…']
    },
    soiree: {
        suggestifs: [
            'm\u2019a murmuré des compliments à double sens', 'a proposé un dernier verre très insistant', 's\u2019est rapproché pendant la chanson', 'a dansé beaucoup trop près', 'a envoyé un chauffeur pour un “after”'
        ],
        events: [
            'Une story a tout révélé au petit matin', 'Une vidéo a tourné entre amis', 'Une photo floue a mis le feu aux poudres', 'Le DJ a arrêté la musique au pire moment'
        ],
        consequences: ['et plus rien n’était innocent', 'et l’after a tout changé']
    },
    sms: {
        suggestifs: [
            'm\u2019envoyait des messages nocturnes équivoques', 'a proposé de “parler en DM” très tard', 'a réagi à toutes mes stories avec des yeux en cœur', 'm\u2019a envoyé un audio trop intime', 'm\u2019a ajouté à une liste très privée'
        ],
        events: [
            'Un message suggestif a été intercepté', 'Une capture d’écran a fuité', 'Une conversation a été forwardée au mauvais destinataire', 'Un ancien backup a tout ressorti'
        ],
        consequences: ['et nos regards ont tout avoué', 'et la rumeur a explosé en ligne']
    },
    voyage: {
        suggestifs: [
            'a réservé deux billets “par commodité”', 'a prolongé le séjour pour “mieux débriefer”', 'a proposé de partager la suite “pour économiser”', 'a annulé sa chambre au dernier moment', 'a insisté pour s’asseoir à côté pendant le vol'
        ],
        events: [
            'Le réceptionniste a posé trop de questions', 'La réservation portait deux noms', 'La navette nous a déposés au même endroit', 'Un bagage a été livré à la mauvaise chambre'
        ],
        consequences: ['et le voyage d’affaires a pris un autre sens', 'et le retour n’a plus jamais été le même']
    },
    club: {
        suggestifs: [
            'a collé ses pas sur les miens jusqu’à l’obsession', 'm\u2019a soufflé des promesses à l’oreille', 'a réservé une table à l’écart “pour être tranquilles”', 'a demandé au videur de nous laisser passer derrière', 'a proposé un after à huis clos'
        ],
        events: [
            'La cabine du DJ a capté notre échange', 'Une note de bar au double des autres a trahi la soirée', 'Une vidéo stroboscopique a fuité', 'La piste s’est vidée au pire moment'
        ],
        consequences: ['et la nuit a dérapé en un instant', 'et tout le club a parlé de nous']
    },
    plage: {
        suggestifs: [
            'a proposé une baignade de minuit', 'a oublié sa serviette “par accident”', 'a tracé des messages dans le sable', 'm\u2019a invité à regarder les étoiles à l’écart', 'a partagé son transat beaucoup trop près'
        ],
        events: [
            'Un selfie a tout montré en arrière‑plan', 'Le maître‑nageur nous a rappelés à l’ordre', 'La glacière contenait plus que des sodas'
        ],
        consequences: ['et la nuit s’est prolongée bien au‑delà', 'et la plage n’était plus la même le lendemain']
    },
    campus: { // étudiants adultes uniquement
        suggestifs: [
            'a proposé une “révision” à huis clos', 'a envoyé une playlist beaucoup trop explicite', 'a insisté pour un after dans l’appart d’à côté', 'a réservé la salle commune rien que pour nous', 'a laissé un message sur le tableau blanc à double sens'
        ],
        events: [
            'La soirée d’intégration (18+) a dégénéré', 'Le gardien a fait un rapport', 'La caméra du couloir a enregistré un aller‑retour suspect', 'Un groupe privé a partagé des captures'
        ],
        consequences: ['et la résidence a tout appris au matin', 'et mon nom a circulé partout']
    }
};

// Generic soft list
const SUGGESTIFS_GENERIC = [
    'faisait des allusions très suggestives', 'me proposait des rendez‑vous plus que tardifs', 'm\u2019envoyait des messages nocturnes équivoques', 'entretenait une liaison clandestine', 'avait des arrière‑pensées à peine voilées', 'jouait avec la limite de la séduction', 'a entretenu un flirt assumé devant tous', 'a glissé des invitations ambiguës lors des réunions'
];
const FORMULES_GRIVOISES = ['et nos regards ont tout avoué', 'jusqu’à faire jaser tout le service', 'et la tentation a pris le dessus', 'au point de mettre le feu aux poudres', 'et la rumeur a explosé en ligne', 'et plus rien n’était innocent', 'et tout s’est joué entre les lignes'];

// HARD lexicon (non explicite, mais plus cru / direct)
const HARD_SUGGESTIFS = [
    'a laissé des messages brûlants sur mon téléphone', 'a verrouillé la porte pour un tête‑à‑tête sans témoins', 'a exigé un debrief à huis clos, très tard', 'a poussé le jeu beaucoup trop loin au milieu de la réunion', 'a proposé un after à l’écart, conditions non négociables', 'a fait circuler des vidéos beaucoup trop intimes', 'a laissé des preuves compromettantes dans mon casier', 'm\u2019a frôlé sans équivoque sous la table', 'a soufflé des propositions indécentes à l’oreille', 'a transformé la tension en dérapage assumé'
];
const HARD_EVENTS = [
    'Une alerte de modération a tout révélé', 'Le service juridique a été saisi', 'Des captures d’écran ont fuité partout', 'Un micro resté ouvert a tout enregistré', 'La caméra de sécurité n’a rien loupé'
];
const HARD_CONSEQUENCES = [
    'et la honte est devenue virale', 'et j’ai tout perdu en une nuit', 'et la carrière s’est effondrée', 'et plus rien ne pouvait l’arrêter', 'et les dégâts étaient irréversibles'
];

// === State ===
const outputEl = byId('output');
const styleEl = byId('style');
const themeEl = byId('theme');
const btnGen = byId('btn-generate');
const btnCopy = byId('btn-copy');
const btnRefresh = byId('btn-refresh-lexique');
const toast = byId('toast');
const modeEl = byId('mode');
const badgeHard = byId('badge-hard');
const recent = []; const MAX_RECENT = 30;

function getIntensity() { return parseInt(byId('intensity').value, 10) || 0; }
function theme() { return themeEl ? themeEl.value : 'auto'; }
function sexualMode() { return (modeEl && modeEl.value) || 'off'; }

function showToast(msg) {
    toast.innerHTML = `<div class="fade-in">${msg}</div>`;
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => { toast.innerHTML = ''; toast.setAttribute('aria-hidden', 'true'); }, 1800);
}

function normalizeForDup(s) { return s.toLowerCase().replace(/\s+/g, ' ').trim(); }
function ensureNotDuplicate(makeFn) {
    let tries = 0, out;
    do { out = makeFn(); tries++; } while (byId('antidup').checked && recent.includes(normalizeForDup(out)) && tries < 25);
    recent.unshift(normalizeForDup(out)); if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    return out;
}

function themedLexicon() {
    const t = theme();
    const base = { suggestifs: [...SUGGESTIFS_GENERIC], events: [...EVENEMENTS], consequences: [...CONSEQUENCES] };
    if (t === 'auto') return base;
    const T = THEMES[t];
    if (!T) return base;
    return {
        suggestifs: [...SUGGESTIFS_GENERIC, ...T.suggestifs],
        events: [...EVENEMENTS, ...T.events],
        consequences: [...CONSEQUENCES, ...T.consequences]
    };
}

function pickRoleForMode(mode) { return (mode === 'off') ? pick(REL) : pick(REL_NONFAM); }

// === Composers ===
function composePersonnage(mode) {
    const rel = pickRoleForMode(mode);
    const poss = articlePossessif(rel);
    const intens = getIntensity();
    const qual = intens > 1 && coinFlip(0.7) ? ' ' + pick(QUALIFICATIFS) : '';
    let action = pick(ACTIONS);
    if (mode === 'soft' && coinFlip(0.65)) action = pick(themedLexicon().suggestifs);
    if (mode === 'hard') action = coinFlip(0.75) ? pick(HARD_SUGGESTIFS) : pick(themedLexicon().suggestifs);
    return maj(`${poss} ${rel.w}${qual} ${action}`);
}

function composeNarratif(mode) {
    const rel = pickRoleForMode(mode);
    const poss = articlePossessif(rel);
    const intens = getIntensity();
    if (mode !== 'off' && coinFlip(0.6)) {
        const act = (mode === 'hard' && coinFlip(0.6)) ? pick(HARD_SUGGESTIFS) : pick(themedLexicon().suggestifs);
        const finList = (mode === 'hard') ? [...FORMULES_GRIVOISES, ...HARD_CONSEQUENCES] : FORMULES_GRIVOISES;
        const fin = coinFlip(0.65) ? ' ' + pick(finList) : '';
        return `Le jour où ${poss} ${rel.w} ${act}${fin}`;
    }
    const verite = pick(VERITES);
    const adv = intens >= 2 && coinFlip(0.5) ? ' ' + pick(INTENSIFIEURS) : '';
    return `Le jour où ${poss} ${rel.w} a ${pick(VERBES)}${adv} ${verite}`;
}

function composeSituation(mode) {
    const { events, consequences } = themedLexicon();
    if (mode === 'hard' && coinFlip(0.55)) {
        const evt = coinFlip(0.5) ? pick(HARD_EVENTS) : pick(events);
        const cons = pick(HARD_CONSEQUENCES);
        return `${evt}, ${cons}`;
    }
    if (mode === 'soft' && coinFlip(0.55)) {
        const evt = pick(events);
        const cons = pick(FORMULES_GRIVOISES);
        return `${evt}, ${cons}`;
    }
    const evt = pick(events);
    const cons = pick(consequences);
    const add = getIntensity() >= 2 && coinFlip(0.5) ? ', et personne n’était prêt' : '';
    return `${evt}, ${cons}${add}`;
}

function composeChoc(mode) {
    const rel = pickRoleForMode(mode);
    const poss = articlePossessif(rel);
    const intens = getIntensity();
    if (mode === 'hard') {
        const a = aOuOnt(rel);
        const fin = pick([
            'brisé tous les codes de la bienséance', 'fait sauter la frontière du professionnel', 'dévoilé un jeu de séduction dangereux', 'lancé des avances impossibles à ignorer', 'embrasé la pièce d’un seul regard'
        ]);
        const adv = intens >= 2 && coinFlip(0.5) ? ' ' + pick(['ouvertement', 'insistement', 'sans détour']) : '';
        return maj(`${poss} ${rel.w} ${a}${adv} ${fin}`);
    }
    if (mode === 'soft') {
        const a = aOuOnt(rel);
        const fin = pick(['dévoilé un flirt assumé', 'fait vaciller toutes les limites', 'joué avec le feu jusqu’à l’aveu']);
        return maj(`${poss} ${rel.w} ${a} ${fin}`);
    }
    const qual = intens >= 1 && coinFlip(0.6) ? ' ' + pick(QUALIFICATIFS) : '';
    const adv = intens >= 2 && coinFlip(0.5) ? ' ' + pick(INTENSIFIEURS) : '';
    const a = aOuOnt(rel);
    return maj(`${poss} ${rel.w}${qual} ${a}${adv} brisé tous les tabous`);
}

function composeGrivois() {
    // Back‑compat: style "grivois" = soft
    return pick([() => composePersonnage('soft'), () => composeNarratif('soft'), () => composeSituation('soft'), () => composeChoc('soft')])();
}

function composeFromStyle(style) {
    const mode = (style === 'grivois') ? 'soft' : sexualMode();
    switch (style) {
        case 'narratif': return composeNarratif(mode);
        case 'personnage': return composePersonnage(mode);
        case 'situation': return composeSituation(mode);
        case 'choc': return composeChoc(mode);
        case 'grivois': return composeGrivois();
        default:
            return pick([
                () => composeNarratif(mode), () => composePersonnage(mode), () => composeSituation(mode), () => composeChoc(mode), () => (mode !== 'off' ? composeNarratif(mode) : composePersonnage(mode))
            ])();
    }
}

// === UI wiring ===
function setBodyModeClass() {
    const m = sexualMode();
    document.body.classList.remove('mode-off', 'mode-soft', 'mode-hard');
    document.body.classList.add(`mode-${m}`);
    badgeHard.hidden = (m !== 'hard');
}

function generate() {
    const title = ensureNotDuplicate(() => composeFromStyle(styleEl.value));
    outputEl.textContent = title;
    // Button animation feedback
    btnGen.classList.remove('btn-pulse', 'btn-shake');
    void btnGen.offsetWidth; // reflow
    btnGen.classList.add(sexualMode() === 'hard' ? 'btn-shake' : 'btn-pulse');
}

function shuffleInPlace(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } }

btnGen.addEventListener('click', generate);
document.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
btnCopy.addEventListener('click', async () => { const text = outputEl.textContent.trim(); if (!text) return; try { await navigator.clipboard.writeText(text); showToast('Titre copié ✔'); } catch { showToast('Impossible de copier'); } });
btnRefresh.addEventListener('click', () => {
    [ACTIONS, EVENEMENTS, CONSEQUENCES, INTENSIFIEURS, QUALIFICATIFS, VERITES, SUGGESTIFS_GENERIC, FORMULES_GRIVOISES, HARD_SUGGESTIFS, HARD_EVENTS, HARD_CONSEQUENCES].forEach(shuffleInPlace);
    Object.values(THEMES).forEach(t => { [t.suggestifs, t.events, t.consequences].forEach(shuffleInPlace); });
    showToast('Champ lexical rafraîchi ✨');
});
modeEl.addEventListener('change', () => { setBodyModeClass(); generate(); });

// First paint
setBodyModeClass();
generate();
