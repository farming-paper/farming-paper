import { describe, expect, test } from "vitest";
import { convertMarkdownToDescendants } from "./slate";

/** @see https://jaspervdj.be/lorem-markdownum/ */

describe("convertMarkdownToDescendants", () => {
  test("snapshot 1", () => {
    const doc = `Lorem markdownum errare mundi, sollicitumque numinis refers adfectu; cecidit nudumque ultimus: lucis invenit sanguine tuque; sors. Cum agitata [nymphae](#partu-sol-super), quem, gravem esse cum, amens Aeacides, **data** alto si, Ampycus erraverit. Hanc promptum captato. Tibi potentia nepotum per nec: haerentem vertar fatalis flammae queritur ex. Sacra secum ille superest voluntas unius autumnos, tamen, digna litore nec quid digerit naides, portant.

1. Vitisque exul quidem tamen Ammon leni canities
2. Ex partim iamdudum
3. Pando exitio nec credite adiit

Freta cum plumis mole mater serta rumpit Astyanax obvertit viscera suis. Sum abiit aetherium tribus, et adeunt solebat; quos aqua inamabile sileam. Consequiturque non ludit ego notavi Antigonen mater quid [illa facit](#coniunx).

Atque preme habes Antiphataeque aquae solverat, fuerit [anxia](#palustres-nec) capillos quisque! Amasse evocat, si undis erubuit parvos Io Iove. Nec crura puer agrosque, fortuna terrore, Leucippusque cursu in lustratum Thyesteis adversos.

Tunc est arida Achilles equarum hanc populo vocavit inpune auribus auxiliare pervia meritasque **et** adhuc; fata verbenis litore mors. Illis caelestia est, regno. Inpleratque furori si temeraria futuri, in viscere fera omni, adhaesit. Aliquem super, qua Idan quid facit, in illo ecce!

Suspectus multis mea gracili venerantur thalamos Iovisque intellege fronde vidit. Ut numina funeribus pontus, cortice vidisset, viridi; tum.

- Cum servitii venistis
- Maturae perdideris superant
- Hos lacrimas Trinacriam eurus Phene

Ore templum manu relatus, in [proelia](#vidi-premens-edocuit) stabant portitor montes consolenturne nova Vertumnumque ante per exstinctum! Equorum **quantum** aderat fixit ubi, de illis extulit fontis. Inposito igne venire noctis, vocant credensque operire!

Perde serpentis Oliaros transit Lucifer aquilam conplexibus vocatur; Myconon modo. Illis domus vacuae quae aliae lecto, unus cervis simul caesa fugere patulosque, dumque, vis Numam laetatur auget. Amphitrite sacrilegos **invecta ante liventia** ignibus, [sub vacent valido](#coget) humum capillos si fateri est quo mella aura: sunt. Laqueosque superatus, non Aricinae meae servant. Levant iuvenes, [Apolline ferrum](#terea-venatrixque-in); intonsum tardantis fervebat portis, paupertatemque rogant te sensimus.    
`;

    expect(convertMarkdownToDescendants(doc)).toMatchSnapshot();
  });

  test("snapshot 2", () => {
    const doc = `Lorem markdownum *montes* in patriis: casusque ornat sumit superi euntem dextera. Peremptis saepe!

1. Eripuit inpulit sit domito mihi saxis trepidumque
2. Deteriora serior cupit cesserat
3. Sedes causa Alcinoi habebatur linguae vires anima
4. Perenni deos
5. Quem visceraque decutit placet quae vulnus Cypriae

Duram sibi orbem, ut mersa edideras. Coeptaeque iacet, ardua tale iussis, quidve quae quaeque ligamina foedera.

Ire iuvenum optima. Non omnes ducere: visa nec imis **tot artes** subigebat pompas, amor? Placet quadrupes ossa attulit serpens proxima dixerat mihi vultu veteris delabere *me ferre* omnia *ille dicet*, Inachides.

1. Vero orbam aperta virum matrona tenet videtur
2. Quanto iuvenilior cadunt abeunt credita
3. Ferinae in reverentia Orion et cum
4. Sit Calydonia exercet umbris Procris mihi viscera
5. Formas nam dolendi ante spernitque

Adire parvumque ipsos, genitor dedit **tenebras** mea; properandum luctuque vel Pyrois *nec* tardius iussit, verbaque o. **Moverat** inter reverentia cursuque lacer, ius in agitata tamen subito, resoluta pendebat et vices refers: primisque. Nec Theseus veri hic considere nostri ambo gratia ultro, hos spisso mandata velamina ut maris licet. Quaeque est inventos i subit veniunt, at Quae *carcere nominis*. Audierit flammam testarique sorores *recondidit tempora* paries.

1. Ne et neglectos duabus sterilem color permansit
2. Arripit cui oculos ignibus exit his quamvis
3. Devia non aliisque
4. Fidensque simulacra sociis
5. Ad cum auras coercuit

Attollit niveis, mea conparentis, in ne faciem deposuit Stygii similis palus: est omnis ensis mugire accessit coepere. Adicit nullumque, undas nare vacuus in ne fila ad tua plura.`;

    expect(convertMarkdownToDescendants(doc)).toMatchSnapshot();
  });

  test("snapshot 3", () => {
    const doc = `Lorem markdownum. Aurum ante esse fugit gramina. Et quo crinem seque moenibus coniugis tu crede ipse esse tremendos reddat. Captivarum **deusque vestigia**, ora cepit ut arma gaudet valuere viscera cernunt, sua ego fugit velocius senex.

1. Est nec nymphas inpono inposito iuppiter verecundo
2. Inpubesque me regi Tyrrhena subit et expulit
3. Nepotum si praemia ante iunctura
4. Mox ut misit violenta

Quanto quaque ardore. Erigitur eiectat ripam innocuum, *erat locus* mandataque flamma caput te ille nurus? Optima et, quod atria ut perfida tua nulla grator. Pertulit vidi ferro arboreis et pater non [heros](#novus) estque, conligit a *nescio tangentia*.

- Meministis luminis sed
- Tantique gemitusque contigero moveret manifesta hac
- Profeci esse quid quem turaque monte
- Monte est ducit tum cernit iuventus ad
- Procubuit poscat

Solo fures sumitque inquam natis flamine spectat facinus. Si apud eras saxo gemit [toris](#suis) fuerunt ore vestra tantum tonitrua tot sustinuit ferunt quodque amore. Foramine durum, sic et minatur resolvo; mea veris ad radice omnia, ora terra continet et. Fontis color, tunc pro flammas en arbiter altis subit, manu loca firmatque parentum. Iram leves, et Icare: movimus caput et [fuisset](#hunc).

1. Anubis siste susurro
2. Naufragus factum condi vel
3. Patriam in moenia adiere
4. Mora turba fuisset possis erat usque profatur
5. Venit nobis erat vulnus advertere custos rogando
6. Et ossa ab spissatus artes refugitque an

Partu ratione pater: erat inter fecundam superi legati extrema. Iacent in Atque in, Pelagonaque ambit quo aura poenaque.

1. Nobis audit indignatus remove
2. Drya fallaces
3. Mersit sive hunc qua Memnonides Amnis cecidit
4. Loquentem dum
5. Legum et fuge iam
6. Rebar ad facit discidii

Videat es *Corinthiaci trepidantis* ferendo carpit relinquit imagine tuae sua colla o **nullius egit saxa** velatus **Peleus**. Lasso **et abesse septemplicis** lege matrem sub mihi vulgares, frena nec adfuit. Dumque ceciderunt radice. [Flavum Pleionesque](#dare-partibus) vocem naides quo Hymenaeus Euippe in lingua pictas; *nec*? Solita unde magna antra quique vitale rogat usus Bacchus [fatidicamque nocte](#ergo-exuvias).`;

    expect(convertMarkdownToDescendants(doc)).toMatchSnapshot();
  });
});
