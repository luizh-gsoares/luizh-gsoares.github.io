// -------------------------------------------
//   Autor: Luiz Soares
//   Copyright (c) 2023 Luiz Soares
// -------------------------------------------

// Array de tópicos disponíveis
const topics = ["todos", "html", "css", "javascript", "dotnet", "api"];


// Função que é executada quando o documento HTML estiver completamente carregado
$(document).ready(() => {
    const filterTopics = $("#filter-topics");
    topics.forEach(name => {
        const button = createFilterButton(name);
        filterTopics.append(button);
    });

    $("#filter-topics").on("click", "button", filterRepositories);
});

// Função que cria um botão de filtro com base em um nome de tópico
function createFilterButton(name) {
    return `<button type='button' class='btn btn-secondary btn-md me-1' data-filter='${name}'>${name} </button>`;
}

// Função que filtra os repositórios com base no tópico selecionado
function filterRepositories() {
    const filter = $(this).data("filter");

    // Seleciona os elementos filhos do elemento com o ID "repo-container"
    const repos = $("#repo-container").children();

    if (filter === "todos") {
        repos.show();
    } else {
        repos.hide();
        // Para cada repositório, verifica se ele tem o tópico selecionado e, se sim, mostra-o
        repos.each(function () {
            const repo = $(this);
            const repoTopics = repo.find(".badge").map(function () {
                return $(this).text();
            }).get();

            if (repoTopics.includes(filter)) {
                repo.show();
            }
        });
    }
}
