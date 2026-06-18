document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hub-links");
    const themeToggle = document.getElementById("theme-toggle");

    // 1. Carregar preferência de tema salva no navegador
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Alternar entre temas claro e escuro
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // 2. Buscar dados do arquivo links.json e renderizar na tela
    fetch("links.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo JSON");
            }
            return response.json();
        })
        .then(data => {
            // Varre cada bloco/categoria do JSON
            for (const categoria in data) {
                const links = data[categoria];

                // Cria o elemento do Bloco (Card)
                const card = document.createElement("section");
                card.classList.add("block-card");

                const title = document.createElement("h2");
                title.textContent = categoria;
                card.appendChild(title);

                const ul = document.createElement("ul");
                ul.classList.add("link-list");

                // Adiciona os links dentro do bloco
                links.forEach(link => {
                    const li = document.createElement("li");
                    li.classList.add("link-item");

                    const a = document.createElement("a");
                    a.href = link.url;
                    a.target = "_blank"; // Abre em uma nova aba
                    a.rel = "noopener noreferrer"; // Segurança extra
                    a.textContent = link.nome;

                    li.appendChild(a);
                    ul.appendChild(li);
                });

                card.appendChild(ul);
                container.appendChild(card);
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            container.innerHTML = `<p style="color: red; grid-column: 1/-1; text-align: center;">Não foi possível carregar os links. Verifique se o arquivo links.json está configurado corretamente.</p>`;
        });
});
