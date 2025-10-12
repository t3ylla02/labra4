console.log('Hei Tapahtumahubi!');

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

document.querySelectorAll('.card').forEach((card, index) => {
    const otsikko = card.querySelector('.card__title');
    if (otsikko) {
        otsikko.textContent = `${index + 1}. ${otsikko.textContent}`;
    }
});

function lisaaYhteenvetoSivulle() {
    const yhteenveto = teeYhteenveto(tapahtumanNimi, tapahtumanHinta, tapahtumanPaiva);
    const mainElement = document.querySelector('main') || document.querySelector('.container') || document.body;
    
    if (mainElement) {
        const p = document.createElement('p');
        p.textContent = `Esimerkkitapahtuma: ${yhteenveto}`;
        p.className = 'box';
        p.style.marginTop = '1rem';
        p.style.padding = '1rem';
        p.style.backgroundColor = '#f0f9ff';
        p.style.border = '2px solid #0ea5e9';
        p.style.borderRadius = '0.5rem';
        
        mainElement.appendChild(p);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    lisaaYhteenvetoSivulle();
});


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




function alustaSovellus() {
    console.log('Sovellus alustettu:', window.location.pathname);
    





    alustaNaytaPiilotaNappi();
    alustaKorostusNappi();
    alustaLomakeValidointi();
    
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