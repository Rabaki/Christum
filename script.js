document.addEventListener("DOMContentLoaded", () => {
    const tocTitle = document.querySelector(".toc-title");
    const tocCard = document.querySelector(".toc-card");
    const tocList = document.querySelector(".toc-list");

    if (!tocTitle || !tocCard || !tocList) return;

    tocList.innerHTML = "";
    const items = document.querySelectorAll(".verse-text, .entry-title");
    const allCards = document.querySelectorAll(".verse-card, .journal-entry");

    // 1. Alle Kärtchen standardmäßig deaktivieren
    allCards.forEach(card => card.classList.remove("is-active"));
    allCards.forEach(card => card.classList.add("is-active"));

    // 2. Inhaltsverzeichnis dynamisch aufbauen
    items.forEach((element, index) => {
        const id = `toc-item-${index + 1}`;
        const parentCard = element.closest(".verse-card, .journal-entry");
        if (parentCard) parentCard.id = id;

        let title = (element.innerText || element.textContent)
            .replace(/[«»]/g, "")
            .replace(/\s+/g, " ")
            .trim();

        if (title.length > 160) {
            title = title.substring(0, 160) + "...";
        }

        const li = document.createElement("li");
        li.innerHTML = `
            <a href="#${id}" data-target="${id}">
                <span class="toc-item-text">${title}</span>
                <span class="toc-badge">${index + 1}</span>
            </a>
        `;
        tocList.appendChild(li);
    });

    // 3. Klick auf Eintrag: Alle Karten deaktivieren, nur die gewählte aktivieren
    tocList.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const targetId = link.getAttribute("data-target");
        const targetCard = document.getElementById(targetId);

        if (targetCard) {
            allCards.forEach(card => card.classList.remove("is-active"));
            targetCard.classList.add("is-active");

            // Sanft zur aktivierten Karte scrollen
            targetCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        tocCard.classList.remove("is-open");
    });

    // 4. Klick auf "الفهرس": Öffnen / Schließen
    tocTitle.addEventListener("click", (e) => {
        e.stopPropagation();
        tocCard.classList.toggle("is-open");
    });

    // 5. Klick außerhalb schließt das Menü
    document.addEventListener("click", (e) => {
        if (!tocCard.contains(e.target) && !tocTitle.contains(e.target)) {
            tocCard.classList.remove("is-open");
        }
    });
});