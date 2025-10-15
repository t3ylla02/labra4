console.log('Hei Tapahtumahubi!');

let tapahtumat = [
  { nimi: 'Syksyn ryyppyreissu', paikka: 'Oulu', pvm: '2025-09-09', kategoria: 'Viihde' },
  { nimi: 'Syysloman ryyppyreissu', paikka: 'Helsinki', pvm: '2025-10-10', kategoria: 'Viihde' },
  { nimi: 'Joulun ryyppyreissu', paikka: 'Tampere', pvm: '2025-11-12', kategoria: 'Viihde' },
  { nimi: 'Joulubileet', paikka: 'Turku', pvm: '2025-12-20', kategoria: 'Juhla' },
  { nimi: 'Uudenvuoden ryyppyjuhla', paikka: 'Rovaniemi', pvm: '2026-01-05', kategoria: 'Juhla' },
  { nimi: 'Kevään ryyppyreissu', paikka: 'Kuopio', pvm: '2026-02-14', kategoria: 'Viihde' }
];

const tapahtumanNimi = 'Syksyn ryyppyreissu';
const tapahtumanHinta = 49;
const tapahtumanPaiva = '9.9.2025';

function teeYhteenveto(nimi, hinta, paiva) {
    return `${nimi} - Hinta: ${hinta}€ - Päivämäärä: ${paiva}`;
}

console.log('Tapahtumamuuttujat:', { tapahtumanNimi, tapahtumanHinta, tapahtumanPaiva });
console.log(teeYhteenveto(tapahtumanNimi, tapahtumanHinta, tapahtumanPaiva));

const etusivuOtsikko = document.querySelector('h1.title');
if (etusivuOtsikko && window.location.pathname.includes('index.html')) {
    const paivamaara = new Date().toLocaleDateString('fi-FI');
    etusivuOtsikko.textContent = etusivuOtsikko.textContent + ' - ' + paivamaara;
}


function renderTapahtumat(data) {
  const grid = document.querySelector('.grid');
  if (!grid) {
    console.log('Grid-elementtiä ei löytynyt');
    return;
  }
  
  const kaikkiKortit = document.querySelectorAll('.card');
  if (kaikkiKortit.length === 0) {
    console.log('Kortteja ei löytynyt');
    return;
  }
  
  console.log(`renderTapahtumat(): ${data.length} tapahtumaa näytetään`);
  

  kaikkiKortit.forEach((kortti, index) => {
    if (index < data.length) {
      kortti.style.display = 'block';
    } else {
      kortti.style.display = 'none';
    }
  });
  

  const naytetytKortit = Array.from(kaikkiKortit).filter(kortti => kortti.style.display !== 'none');
  if (naytetytKortit.length === 0) {
    naytaEiTuloksiaViesti();
  } else {
    poistaEiTuloksiaViesti();
  }
}

function naytaEiTuloksiaViesti() {
  if (document.getElementById('eiTuloksiaViesti')) return;
  
  const grid = document.querySelector('.grid');
  const viesti = document.createElement('div');
  viesti.id = 'eiTuloksiaViesti';
  viesti.textContent = 'Ei tapahtumia annetuilla hakuehdoilla.';
  viesti.style.gridColumn = '1 / -1';
  viesti.style.textAlign = 'center';
  viesti.style.padding = '2rem';
  viesti.style.backgroundColor = '#f8fafc';
  viesti.style.border = '1px solid #e2e8f0';
  viesti.style.borderRadius = '0.5rem';
  viesti.style.color = '#64748b';
  viesti.style.fontStyle = 'italic';
  
  grid.appendChild(viesti);
}

function poistaEiTuloksiaViesti() {
  const viesti = document.getElementById('eiTuloksiaViesti');
  if (viesti) {
    viesti.remove();
  }
}

function suodataTapahtumat() {
  const hakukentta = document.getElementById('search');
  if (!hakukentta) {
    console.log('Hakukenttää ei löytynyt');
    return;
  }
  
  const hakusana = hakukentta.value.trim().toLowerCase();
  console.log('Haetaan sanalla:', hakusana);
  
  let suodatetut = [...tapahtumat];
  
  if (hakusana) {
    suodatetut = suodatetut.filter(t => {
      const nimiOsuma = t.nimi.toLowerCase().includes(hakusana);
      const paikkaOsuma = t.paikka.toLowerCase().includes(hakusana);
      const kategoriaOsuma = t.kategoria.toLowerCase().includes(hakusana);
      
      return nimiOsuma || paikkaOsuma || kategoriaOsuma;
    });
    console.log('Hakutuloksia:', suodatetut.length);
  }
  
  suodatetut = kaytaKategoriaSuodatin(suodatetut);
  suodatetut = kaytaPaivamaaraSuodatin(suodatetut);
  
  const sortValinta = document.getElementById('sort');
  if (sortValinta) {
    suodatetut = jarjestaTapahtumat(suodatetut, sortValinta.value);
  }
  
  renderTapahtumat(suodatetut);
}

function lisaaTapahtumaCSV() {
  const csvInput = document.getElementById('csvInput');
  if (!csvInput) {
    console.log('CSV-inputtia ei löytynyt');
    return;
  }
  
  const syote = csvInput.value.trim();
  if (!syote) {
    naytaVirhe('Syöte ei voi olla tyhjä');
    return;
  }
  
  const osat = syote.split(';').map(osa => osa.trim());
  if (osat.length !== 4) {
    naytaVirhe('Syötteen tulee olla muodossa: nimi;paikka;pvm;kategoria');
    return;
  }
  
  const [nimi, paikka, pvm, kategoria] = osat;
  
  if (nimi.length < 2) {
    naytaVirhe('Nimen tulee olla vähintään 2 merkkiä pitkä');
    return;
  }
  
  if (paikka.length < 2) {
    naytaVirhe('Paikan tulee olla vähintään 2 merkkiä pitkä');
    return;
  }
  
  if (!kategoria) {
    naytaVirhe('Kategoria ei voi olla tyhjä');
    return;
  }
  
  const paivamaara = Date.parse(pvm);
  if (isNaN(paivamaara)) {
    naytaVirhe('Päivämäärän tulee olla muodossa YYYY-MM-DD');
    return;
  }
  
  const onJoOlemassa = tapahtumat.some(t => 
    t.nimi.toLowerCase() === nimi.toLowerCase() && 
    t.pvm === pvm && 
    t.paikka.toLowerCase() === paikka.toLowerCase()
  );
  
  if (onJoOlemassa) {
    naytaVirhe('Saman niminen tapahtuma samalla päivämäärällä ja paikalla on jo olemassa');
    return;
  }
  
  const uusiTapahtuma = { nimi, paikka, pvm, kategoria };
  tapahtumat.push(uusiTapahtuma);
  csvInput.value = '';
  naytaOnnistuminen('Tapahtuma lisätty onnistuneesti!');
  
  suodataTapahtumat();
}

function naytaVirhe(viesti) {
  let virheDiv = document.getElementById('csvVirhe');
  if (!virheDiv) {
    virheDiv = document.createElement('div');
    virheDiv.id = 'csvVirhe';
    virheDiv.style.margin = '0.5rem 0';
    virheDiv.style.padding = '0.5rem';
    virheDiv.style.borderRadius = '0.25rem';
    document.getElementById('csvInput').parentNode.appendChild(virheDiv);
  }
  
  virheDiv.textContent = `Virhe: ${viesti}`;
  virheDiv.style.backgroundColor = '#fee2e2';
  virheDiv.style.color = '#dc2626';
  virheDiv.style.border = '1px solid #fecaca';
  
  setTimeout(() => {
    virheDiv.textContent = '';
    virheDiv.style.backgroundColor = '';
    virheDiv.style.border = '';
  }, 5000);
}

function naytaOnnistuminen(viesti) {
  console.log(viesti);
  let onnistumisDiv = document.getElementById('csvOnnistuminen');
  if (!onnistumisDiv) {
    onnistumisDiv = document.createElement('div');
    onnistumisDiv.id = 'csvOnnistuminen';
    onnistumisDiv.style.margin = '0.5rem 0';
    onnistumisDiv.style.padding = '0.5rem';
    onnistumisDiv.style.borderRadius = '0.25rem';
    document.getElementById('csvInput').parentNode.appendChild(onnistumisDiv);
  }
  
  onnistumisDiv.textContent = viesti;
  onnistumisDiv.style.backgroundColor = '#d1fae5';
  onnistumisDiv.style.color = '#065f46';
  onnistumisDiv.style.border = '1px solid #a7f3d0';
  
  setTimeout(() => {
    onnistumisDiv.textContent = '';
    onnistumisDiv.style.backgroundColor = '';
    onnistumisDiv.style.border = '';
  }, 3000);
}

function jarjestaTapahtumat(data, jarjestys) {
  const kopio = [...data];
  
  switch (jarjestys) {
    case 'pvm':
      return kopio.sort((a, b) => Date.parse(b.pvm) - Date.parse(a.pvm));
    case 'nimi':
      return kopio.sort((a, b) => a.nimi.localeCompare(b.nimi, 'fi'));
    case 'paikka':
      return kopio.sort((a, b) => a.paikka.localeCompare(b.paikka, 'fi'));
    default:
      return kopio;
  }
}

function kaytaKategoriaSuodatin(data) {
  const kategoriaValinta = document.getElementById('catFilter');
  if (!kategoriaValinta || kategoriaValinta.value === 'kaikki') {
    return data;
  }
  
  return data.filter(t => t.kategoria === kategoriaValinta.value);
}

function kaytaPaivamaaraSuodatin(data) {
  const fromDate = document.getElementById('fromDate');
  const toDate = document.getElementById('toDate');
  
  if (!fromDate || !toDate || !fromDate.value || !toDate.value) {
    return data;
  }
  
  const alku = Date.parse(fromDate.value);
  const loppu = Date.parse(toDate.value);
  
  if (isNaN(alku) || isNaN(loppu)) {
    return data;
  }
  
  return data.filter(t => {
    const tapahtumaPvm = Date.parse(t.pvm);
    return tapahtumaPvm >= alku && tapahtumaPvm <= loppu;
  });
}

function luoRaportti() {
  const muunnaPaivamaara = (pvm) => {
    const [v, kk, p] = pvm.split('-');
    return `${p}.${kk}.${v}`;
  };
  
  const csvRivi = tapahtumat.map(t => 
    `${t.nimi};${t.paikka};${muunnaPaivamaara(t.pvm)};${t.kategoria}`
  ).join('\n');
  const csvRaportti = `Nimi;Paikka;Päivämäärä;Kategoria\n${csvRivi}`;
  
  console.log('CSV-raportti:');
  console.log(csvRaportti);
  
  const tapahtumiaYhteensa = tapahtumat.length;
  
  const tanaan = new Date();
  tanaan.setHours(0, 0, 0, 0);
  
  const tulevat = tapahtumat
    .filter(t => Date.parse(t.pvm) >= tanaan.getTime())
    .sort((a, b) => Date.parse(a.pvm) - Date.parse(b.pvm));
  
  const lähinTuleva = tulevat.length > 0 ? tulevat[0] : null;
  
  const kategoriaMaarat = tapahtumat.reduce((tilastot, t) => {
    tilastot[t.kategoria] = (tilastot[t.kategoria] || 0) + 1;
    return tilastot;
  }, {});
  
  console.log('TILASTOT:');
  console.log(`- Tapahtumia yhteensä: ${tapahtumiaYhteensa}`);
  console.log(`- Lähin tuleva tapahtuma:`, lähinTuleva);
  console.log(`- Kategoriakohtaiset määrät:`, kategoriaMaarat);
  
  const blob = new Blob([csvRaportti], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'tapahtumat.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function alustaLomakeValidointi() {
    const form = document.querySelector('form');
    
    if (form) {
        const msg = document.createElement('p');
        msg.style.margin = '1rem 0';
        msg.style.padding = '0.75rem';
        msg.style.borderRadius = '0.25rem';
        form.prepend(msg);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const virheet = [];
            
            const nimi = form.querySelector('input[name="nimi"]')?.value.trim();
            if (!nimi) {
                virheet.push('Nimi puuttuu');
            } else if (nimi.length < 2) {
                virheet.push('Nimen tulee olla vähintään 2 merkkiä pitkä');
            }

            const sahkoposti = form.querySelector('input[name="sahkoposti"]')?.value.trim();
            if (!sahkoposti) {
                virheet.push('Sähköposti puuttuu');
            } else if (!sahkoposti.includes('@')) {
                virheet.push('Sähköpostissa tulee olla @-merkki');
            }

            const tapahtuma = form.querySelector('select[name="tapahtuma"]')?.value;
            if (!tapahtuma) {
                virheet.push('Valitse tapahtuma');
            }
        
            const lisatiedot = form.querySelector('textarea[name="lisatiedot"]')?.value.trim();
            if (lisatiedot && lisatiedot.length > 500) {
                virheet.push('Lisätiedot eivät saa olla yli 500 merkkiä pitkät');
            }
            
            if (virheet.length) {
                msg.textContent = 'Korjaa seuraavat virheet: ' + virheet.join(', ');
                msg.style.backgroundColor = '#fee2e2';
                msg.style.color = '#dc2626';
                msg.style.border = '1px solid #fecaca';
            } else {
                msg.textContent = 'Kiitos ilmoittautumisestasi!';
                msg.style.backgroundColor = '#d1fae5';
                msg.style.color = '#065f46';
                msg.style.border = '1px solid #a7f3d0';
                
                setTimeout(() => {
                    form.reset();
                    setTimeout(() => {
                        msg.textContent = '';
                        msg.style.backgroundColor = '';
                        msg.style.border = '';
                    }, 5000);
                }, 2000);
            }
        });
    }
}

function alustaTapahtumaUI() {
  const onTapahtumaSivu = window.location.pathname.includes('tapahtumat.html');
  
  if (!onTapahtumaSivu) {
    console.log('Ei tapahtumasivua, ei alusteta hakua');
    return;
  }
  
  const container = document.querySelector('.container') || document.querySelector('main') || document.body;
  
  if (document.getElementById('search')) {
    console.log('Haku-UI on jo luotu');
    return;
  }
  
  console.log('Luodaan hakutoiminto tapahtumasivulle...');
  
  const grid = document.querySelector('.grid');
  if (!grid) {
    console.log('Gridiä ei löytynyt');
    return;
  }
  
  const suodatinContainer = document.createElement('div');
  suodatinContainer.style.marginBottom = '2rem';
  suodatinContainer.style.padding = '1.5rem';
  suodatinContainer.style.backgroundColor = '#f8fafc';
  suodatinContainer.style.borderRadius = '0.75rem';
  suodatinContainer.style.border = '2px solid #e2e8f0';
  
  suodatinContainer.innerHTML += `
    <div style="margin-bottom: 1rem;">
      <label for="search" style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155;">Hae tapahtumia:</label>
      <input type="text" id="search" placeholder="Etsi nimellä, paikalla tai kategorialla..." 
             style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem;">
    </div>
  `;
  
  const suodatusValinnat = document.createElement('div');
  suodatusValinnat.style.display = 'grid';
  suodatusValinnat.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
  suodatusValinnat.style.gap = '1rem';
  suodatusValinnat.style.marginBottom = '1rem';
  
  suodatusValinnat.innerHTML += `
    <div>
      <label for="sort" style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155;">Järjestä:</label>
      <select id="sort" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
        <option value="pvm">Päivämäärä (uusin ensin)</option>
        <option value="nimi">Nimi (A-Ö)</option>
        <option value="paikka">Paikka (A-Ö)</option>
      </select>
    </div>
  `;
  
  const kategoriat = [...new Set(tapahtumat.map(t => t.kategoria))];
  let kategoriaOptions = '<option value="kaikki">Kaikki kategoriat</option>';
  kategoriat.forEach(kat => {
    kategoriaOptions += `<option value="${kat}">${kat}</option>`;
  });
  
  suodatusValinnat.innerHTML += `
    <div>
      <label for="catFilter" style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155;">Kategoria:</label>
      <select id="catFilter" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
        ${kategoriaOptions}
      </select>
    </div>
  `;
  
  suodatusValinnat.innerHTML += `
    <div>
      <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155;">Päivämääräväli:</label>
      <div style="display: flex; gap: 0.5rem;">
        <input type="date" id="fromDate" style="flex: 1; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
        <span style="align-self: center; color: #64748b;">-</span>
        <input type="date" id="toDate" style="flex: 1; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
      </div>
    </div>
  `;
  
  suodatinContainer.appendChild(suodatusValinnat);
  
  const painikeContainer = document.createElement('div');
  painikeContainer.style.display = 'flex';
  painikeContainer.style.gap = '1rem';
  painikeContainer.style.flexWrap = 'wrap';
  
  painikeContainer.innerHTML += `
    <div style="flex: 1; min-width: 300px;">
      <label for="csvInput" style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155;">Lisää tapahtuma:</label>
      <div style="display: flex; gap: 0.5rem;">
        <input type="text" id="csvInput" placeholder="Nimi;Paikka;YYYY-MM-DD;Kategoria" 
               style="flex: 1; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
        <button id="lisaaCSV" style="padding: 0.5rem 1rem; background-color: #0ea5e9; color: white; border: none; border-radius: 0.375rem; cursor: pointer; white-space: nowrap;">Lisää</button>
      </div>
      <small style="display: block; margin-top: 0.25rem; color: #64748b;">Erottele kentät puolipisteellä (;)</small>
    </div>
  `;
  
  painikeContainer.innerHTML += `
    <div style="flex: 0; min-width: 200px;">
      <label style="display: block; font-weight: bold; margin-bottom: 0.5rem; color: #334155;">Raportit:</label>
      <button id="raporttiNappi" style="width: 100%; padding: 0.75rem 1rem; background-color: #10b981; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: bold;">
        Tulosta raportti
      </button>
    </div>
  `;
  
  suodatinContainer.appendChild(painikeContainer);
  
  grid.parentNode.insertBefore(suodatinContainer, grid);
  
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sort');
  const catFilter = document.getElementById('catFilter');
  const fromDate = document.getElementById('fromDate');
  const toDate = document.getElementById('toDate');
  const lisaaCSVBtn = document.getElementById('lisaaCSV');
  const raporttiNappi = document.getElementById('raporttiNappi');
  
  if (searchInput) {
    searchInput.addEventListener('input', suodataTapahtumat);
    console.log('Hakukenttä alustettu');
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', suodataTapahtumat);
  }
  
  if (catFilter) {
    catFilter.addEventListener('change', suodataTapahtumat);
  }
  
  if (fromDate && toDate) {
    fromDate.addEventListener('change', suodataTapahtumat);
    toDate.addEventListener('change', suodataTapahtumat);
  }
  
  if (lisaaCSVBtn) {
    lisaaCSVBtn.addEventListener('click', lisaaTapahtumaCSV);
  }
  
  if (raporttiNappi) {
    raporttiNappi.addEventListener('click', luoRaportti);
  }
  
  console.log('Hakutoiminto alustettu tapahtumasivulle');
}

function alustaNaytaPiilotaNappi() {
    const galleriaKuvat = document.querySelectorAll('.gallery img, .container img');
    
    if (galleriaKuvat.length > 0) {
        const ensimmainenKuva = galleriaKuvat[0];
        const nappi = document.createElement('button');
        nappi.textContent = 'Näytä/Piilota ensimmäinen kuva';
        nappi.style.margin = '1rem';
        nappi.style.padding = '0.5rem 1rem';
        nappi.style.backgroundColor = '#0ea5e9';
        nappi.style.color = 'white';
        nappi.style.border = 'none';
        nappi.style.borderRadius = '0.25rem';
        nappi.style.cursor = 'pointer';
        
        nappi.addEventListener('click', () => {
            if (ensimmainenKuva) {
                ensimmainenKuva.hidden = !ensimmainenKuva.hidden;
            }
        });
        
        nappi.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (ensimmainenKuva) {
                    ensimmainenKuva.hidden = !ensimmainenKuva.hidden;
                }
            }
        });
        
        ensimmainenKuva.parentNode.insertBefore(nappi, ensimmainenKuva);
    }
}

function alustaKorostusNappi() {
    const otsikot = document.querySelectorAll('h1, h2');
    
    if (otsikot.length > 0) {
        const nappi = document.createElement('button');
        nappi.textContent = 'Korosta otsikot';
        nappi.id = 'korosta';
        nappi.style.margin = '1rem';
        nappi.style.padding = '0.5rem 1rem';
        nappi.style.backgroundColor = '#0ea5e9';
        nappi.style.color = 'white';
        nappi.style.border = 'none';
        nappi.style.borderRadius = '0.25rem';
        nappi.style.cursor = 'pointer';
        
        const tyyli = document.createElement('style');
        tyyli.textContent = `
            .highlight {
                background-color: #fef3c7 !important;
                padding: 0.5rem !important;
                border-radius: 0.25rem !important;
                border: 2px solid #f59e0b !important;
                transition: all 0.3s ease !important;
            }
        `;
        document.head.appendChild(tyyli);
        
        nappi.addEventListener('click', () => {
            otsikot.forEach(otsikko => {
                otsikko.classList.toggle('highlight');
            });
        });
        nappi.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                otsikot.forEach(otsikko => {
                    otsikko.classList.toggle('highlight');
                });
            }
        });
        const nav = document.querySelector('nav');
        if (nav) {
            nav.parentNode.insertBefore(nappi, nav.nextSibling);
        } else {
            document.body.insertBefore(nappi, document.body.firstChild);
        }
    }
}

function alustaSovellus() {
    console.log('Sovellus alustettu:', window.location.pathname);
    
    alustaNaytaPiilotaNappi();
    alustaKorostusNappi();
    alustaLomakeValidointi();
    alustaTapahtumaUI();
    
    document.querySelectorAll('.card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            card.style.transform = card.style.transform ? '' : 'scale(1.02)';
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', alustaSovellus);
} else {
    alustaSovellus();
}

console.log('Tapahtumadata alustettu:', tapahtumat);