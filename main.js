let kirjautunut = null;
        let kayttajat = [];
        let aanestykset = [];

        function kirjaudu() {
            let k = document.getElementById('kayttaja').value;
            let s = document.getElementById('salasana').value;
            let loyty = kayttajat.find(u => u.nimi === k && u.sala === s);
            if (loyty) {
                kirjautunut = loyty;
                paivitaNakyma();
            } else {
                alert('Väärä nimi tai salasana!');
            }
        }

        function rekisteroi() {
            let k = document.getElementById('uusikayttaja').value;
            let s = document.getElementById('uusisalasana').value;
            let onkoAdmin = document.getElementById('adminbox').checked;
            if (kayttajat.some(u => u.nimi === k)) {
                alert('Käyttäjä on jo olemassa!');
            } else {
                kayttajat.push({nimi: k, sala: s, admin: onkoAdmin, aanestetty: {}});
                alert('Rekisteröinti onnistui!');
            }
        }

        function kirjauduUlos() {
            kirjautunut = null;
            paivitaNakyma();
        }

        function teeuusiAanestys() {
            let nimi = document.getElementById('aanestysNimi').value;
            if (nimi) {
                aanestykset.push({nimi: nimi, joo: 0, ei: 0, aanestaneet: {}});
                paivitaNakyma();
            }
        }

        function aanesta(index, tyyppi) {
            if (kirjautunut.aanestetty[index]) {
                alert('Hei! Olet jo äänestänyt tässä!');
                return;
            }
            
            let a = aanestykset[index];
            if (tyyppi === 'joo') {
                a.joo++;
            } else {
                a.ei++;
            }
            
            a.aanestaneet[kirjautunut.nimi] = tyyppi;
            kirjautunut.aanestetty[index] = true;
            paivitaNakyma();
        }

        function poistaAanestys(index) {
            aanestykset.splice(index, 1);
            kayttajat.forEach(u => {
                delete u.aanestetty[index];
            });
            paivitaNakyma();
        }

        function paivitaNakyma() {
            document.getElementById('kirjautumisboxi').classList.toggle('piilo', kirjautunut !== null);
            document.getElementById('rekisteroitymisboxi').classList.toggle('piilo', kirjautunut !== null);
            document.getElementById('aanestysalue').classList.toggle('piilo', kirjautunut === null);
            
            if (kirjautunut) {
                document.getElementById('kayttajanimi').textContent = kirjautunut.nimi;
                document.getElementById('adminJutut').classList.toggle('piilo', !kirjautunut.admin);
                
                let lista = document.getElementById('aanestyslista');
                lista.innerHTML = '';
                aanestykset.forEach((a, i) => {
                    let div = document.createElement('div');
                    div.className = 'aanestys';
                    let onJoAanestetty = kirjautunut.aanestetty[i];
                    div.innerHTML = `
                        <h4>${a.nimi}</h4>
                        <p>Joo: ${a.joo}, Ei: ${a.ei}</p>
                        <button onclick="aanesta(${i}, 'joo')" class="vihrea-nappi" ${onJoAanestetty ? 'disabled' : ''}>Joo</button>
                        <button onclick="aanesta(${i}, 'ei')" class="punainen-nappi" ${onJoAanestetty ? 'disabled' : ''}>Ei</button>
                        ${kirjautunut.admin ? `<button onclick="poistaAanestys(${i})">Poista</button>` : ''}
                    `;
                    lista.appendChild(div);
                });
            }
        }

        paivitaNakyma();