document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hub-links");
    const themeToggle = document.getElementById("theme-toggle");
    const editToggle = document.getElementById("edit-toggle");
    
    let hubData = null;
    let editMode = false;

    // 1. Controle de Tema (Claro/Escuro)
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // 2. Controle do Modo Edição
    editToggle.addEventListener("click", () => {
        editMode = !editMode;
        document.body.classList.toggle("edit-mode", editMode);
        editToggle.classList.toggle("active", editMode);
        editToggle.textContent = editMode ? "💾 Sair da Edição" : "⚙️ Modo Edição";
    });

    // 3. Inicialização dos Dados (Carrega do LocalStorage ou do arquivo JSON)
    const localData = localStorage.getItem("hub_links_data");
    
    if (localData) {
        hubData = JSON.parse(localData);
        renderHub();
    } else {
        // Se for o primeiro acesso, puxa as categorias do arquivo original
        fetch("links.json")
            .then(response => response.json())
            .then(data => {
                hubData = data;
                localStorage.setItem("hub_links_data", JSON.stringify(data));
                renderHub();
            })
            .catch(error => {
                console.error("Erro ao carregar dados iniciais:", error);
            });
    }

    // 4. Função para desenhar a interface na tela
    function renderHub() {
        container.innerHTML = "";
        if (!hubData) return;

        for (const categoria in hubData) {
            const links = hubData[categoria];

            // Criar o Card do Bloco
            const card = document.createElement("section");
            card.classList.add("block-card");

            const title = document.createElement("h2");
            title.textContent = categoria;
            card.appendChild(title);

            const ul = document.createElement("ul");
            ul.classList.add("link-list");

            // Listar os links atuais da categoria
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

                // Criar o botão de excluir (❌)
                const btnDelete = document.createElement("button");
                btnDelete.classList.add("btn-delete");
                btnDelete.innerHTML = "🗑️";
                btnDelete.title = "Excluir este link";
                btnDelete.addEventListener("click", () => {
                    if (confirm(`Remover o link "${link.nome}"?`)) {
                        hubData[categoria].splice(index, 1); // Remove da lista
                        localStorage.setItem("hub_links_data", JSON.stringify(hubData)); // Salva
                        renderHub(); // Atualiza a tela
                    }
                });

                wrapper.appendChild(a);
                wrapper.appendChild(btnDelete);
                li.appendChild(wrapper);
                ul.appendChild(li);
            });

            card.appendChild(ul);

            // Criar o Formulário de Inclusão rápido
            const form = document.createElement("div");
            form.classList.add("edit-form");

            const inputNome = document.createElement("input");
            inputNome.type = "text";
            inputNome.placeholder = "Nome do item (ex: Planilha 2026)";

            const inputUrl = document.createElement("input");
            inputUrl.type = "url";
            inputUrl.placeholder = "Link (https://...)";

            const btnAdd = document.createElement("button");
            btnAdd.classList.add("btn-add");
            btnAdd.textContent = "＋ Incluir no Bloco";
            btnAdd.addEventListener("click", () => {
                const nomeValor = inputNome.value.trim();
                const urlValor = inputUrl.value.trim();

                if (!nomeValor || !urlValor) {
                    alert("Por favor, preencha o Nome e a URL do link!");
                    return;
                }

                // Adiciona o novo link no array correspondente
                hubData[categoria].push({
                    nome: nomeValor,
                    url: urlValor
                });

                // Salva na memória do navegador e atualiza
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
