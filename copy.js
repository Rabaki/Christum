document.addEventListener('DOMContentLoaded', () => {
    // 1. Bibelvers-Karten & Gebetskarten
    document.querySelectorAll('.verse-card').forEach(card => {
        const ref = card.querySelector('.verse-reference');
        
        // Button erzeugen
        const btn = document.createElement('button');
        btn.className = 'copy-btn-inline';
        btn.title = 'نسخ الآية';
        btn.setAttribute('aria-label', 'Copy verse');
        btn.innerHTML = '<i class="fa-regular fa-copy"></i>';

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();

            let textToCopy = '';

            const verseText = card.querySelector('.verse-text');
            const verseRef = card.querySelector('.verse-reference');
            const strophes = card.querySelectorAll('.strophe-row');

            // Fall A: Klassische Vers-Karten (nur Vers + Referenz)
            if (verseText && verseRef) {
                textToCopy = `${verseText.innerText.trim()}\n\n${verseRef.innerText.trim()}`;
            } 
            // Fall B: Gebetskarten mit Strophen (ohne Nebentexte)
            else if (strophes.length > 0) {
                const title = verseText ? verseText.innerText.trim() + '\n\n' : '';
                const stropheTexts = Array.from(strophes).map(row => {
                    const links = row.querySelector('.links')?.innerText.trim() || '';
                    const rechts = row.querySelector('.rechts')?.innerText.trim() || '';
                    return `${rechts}\n${links}`;
                }).join('\n\n');
                
                textToCopy = title + stropheTexts;
            } 
            // Fallback (falls keine Referenz vorhanden ist)
            else if (verseText) {
                textToCopy = verseText.innerText.trim();
            }

            try {
                await navigator.clipboard.writeText(textToCopy);

                // Feedback-Animation: Häkchen anzeigen
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                }, 1800);
            } catch (err) {
                console.error('Fehler beim Kopieren:', err);
            }
        });

        // Platzierung: Wenn eine Referenzleiste existiert, dort einfügen, sonst oben in die Karte
        if (ref) {
            ref.appendChild(btn);
        } else {
            btn.classList.add('copy-btn-floating');
            card.prepend(btn);
        }
    });
});



