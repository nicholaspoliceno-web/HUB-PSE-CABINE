document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hub-links");
    const themeToggle = document.getElementById("theme-toggle");
    
    let hubData = null;

    // 1. Controle de Tema (Claro/Escuro)
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // 2. Inicialização dos Dados (LocalStorage ou arquivos locais)
    const localData = localStorage.getItem("hub_links_data");
    
    if (localData) {
        hubData = JSON.parse(localData);
        renderHub();
    } else {
        fetch("links.json")
            .then(response => response.json())
            .then(data => {
                hubData = data;
                localStorage.setItem("hub_links_data", JSON.stringify(data));
                renderHub();
            })
            .catch(error => console.error("Erro ao carregar dados:", error));
    }

    // 3. Renderização da Tela
    function renderHub() {
        container.innerHTML = "";
        if (!hubData) return;

        for (const categoria in hubData) {
            const links = hubData[categoria];

            // Criar o Card do Bloco
            const card = document.createElement("section");
            card.classList.add("block-card");

            // Criar o cabeçalho interno do bloco (Título + Botão de Engrenagem)
            const cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");

            const title = document.createElement("h2");
            title.textContent = categoria;
            cardHeader.appendChild(title);

            const btnBlockEdit = document.createElement("button");
            btnBlockEdit.classList.add("btn-block-edit");
            btnBlockEdit.textContent = "⚙️";
            btnBlockEdit.title = "Editar este bloco";
            btnBlockEdit.addEventListener("click", () => {
                // Alterna o modo edição apenas para ESTE bloco card
                card.classList.toggle("editing");
                btnBlockEdit.textContent = card.classList.contains("editing") ? "✅" : "⚙️";
            });
            
            cardHeader.appendChild(btnBlockEdit);
            card.appendChild(cardHeader);

            // Lista de links
            const ul = document.createElement("ul");
            ul.classList.add("link-list");

            links.forEach((link, index) => {
                const li = document.createElement("li");
                li.classList.add("link-item");

                const wrapper = document.createElement("div");
                wrapper.classList.add("link-item-wrapper");

                const a = document.createElement("a");
                a.href = link.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent = link.nome;

                const btnDelete = document.createElement("button");
                btnDelete.classList.add("btn-delete");
                btnDelete.innerHTML = "🗑️";
                btnDelete.title = "Excluir link";
                btnDelete.addEventListener("click", () => {
                    if (confirm(`Remover o link "${link.nome}"?`)) {
                        hubData[categoria].splice(index, 1);
                        localStorage.setItem("hub_links_data", JSON.stringify(hubData));
                        renderHub();
                    }
                });

                wrapper.appendChild(a);
                wrapper.appendChild(btnDelete);
                li.appendChild(wrapper);
                ul.appendChild(li);
            });
            card.appendChild(ul);

            // Formulário de inserção rápida (aparecerá abaixo dos links ao clicar na engrenagem)
            const form = document.createElement("div");
            form.classList.add("edit-form");

            const inputNome = document.createElement("input");
            inputNome.type = "text";
            inputNome.placeholder = "Nome do item (Ex: Relatório Mensal)";

            const inputUrl = document.createElement("input");
            inputUrl.type = "url";
            inputUrl.placeholder = "Link (https://...)";

            const btnAdd = document.createElement("button");
            btnAdd.classList.add("btn-add");
            btnAdd.textContent = "＋ Incluir Link";
            btnAdd.addEventListener("click", () => {
                const nomeValor = inputNome.value.trim();
                const urlValor = inputUrl.value.trim();

                if (!nomeValor || !urlValor) {
                    alert("Preencha o Nome e a URL!");
                    return;
                }

                hubData[categoria].push({ nome: nomeValor, url: urlValor });
                localStorage.setItem("hub_links_data", JSON.stringify(hubData));
                renderHub();
            });

            form.appendChild(inputNome);
            form.appendChild(inputUrl);
            form.appendChild(btnAdd);
            card.appendChild(form);

            container.appendChild(card);
        }
    }
});
