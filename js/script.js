// -------------------------------------------
//   Autor: Luiz Soares
//   Copyright (c) 2024 Luiz Soares
// -------------------------------------------


// Caso não seja informado um usuário, o padrão será "luizh-gsoares".
var usuario = "luizh-gsoares";

// Faz uma solicitação GET à API do GitHub para obter os repositórios de um determinado usuário.
function requestRepositorios(usuario) {
    return $.get(`https://api.github.com/users/${usuario}/repos?per_page=100`);
}

// Cria uma div com todas as informações do repositório recebido. Caso tenha mais informações do repositorio, basta adicionar no HTML.
// Acesse o link para ver todas as informações disponíveis: https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user
function criarRepositorioCard(repo) {
    var repo_topics = repo.topics || [];

    if (repo_topics.includes("esconder")) {
        return null;
    }

    var repo_description = repo.description || "<p>Sem descrição.</p>";
    var repo_language = repo.language || "--";
    var repo_stars = repo.stargazers_count || 0;
    var repo_forks = repo.forks_count || 0;
    var repo_created_at = new Date(repo.created_at).toLocaleDateString();

    var topicsHTML = repo_topics.map(topic => `<span class='badge rounded-pill bg-dark'>${topic}</span>`).join(' ');

    var repoCardHTML = `
    <div class='col' id='${repo.id}'>
        <div class='card h-100'>
            <div class='card-body'>
                <h5 class='card-title text-center'><i class='fa-solid fa-book fa-lg'></i> ${repo.name}</h5>
                <div class='text-center' style='height : 48px;'>
                    ${topicsHTML}
                </div>
                <p class='py-2 card-text'>${repo_description}</p>   
            </div>

            <div class='text-center py-2'>
                <button class='btn btn-link' data-bs-toggle='modal' data-bs-target='#repoModal' onclick='exibirDetalhesRepositorio(${JSON.stringify(repo)})'>Ver detalhes</a>
            </div>

            <div class='card-footer'>
                <small class='text-muted'> Criado em : ${repo_created_at}</small>
                <small class='text-muted'><i class='fa-regular fa-star'></i> ${repo_stars}</small>
                <small class='text-muted'><i class='fa-solid fa-code-fork'></i> ${repo_forks}</small>
                <p class='text-muted'>Linguagem : ${repo_language}</p>
            </div>
        </div>
    </div>
    `;

    return repoCardHTML;
}

// Exibe os detalhes do repositório recebido no modal.
function exibirDetalhesRepositorio(repo) {
    var repoModalBody = document.getElementById('repoModalBody');
    var repo_description = repo.description || "<p>Sem descrição.</p>";
    var repo_language = repo.language || "--";
    var repo_stars = repo.stargazers_count || 0;
    var repo_forks = repo.forks_count || 0;
    var repo_created_at = new Date(repo.created_at).toLocaleDateString();
    var topicsHTML = repo.topics.map(topic => `<span class='badge rounded-pill bg-dark'>${topic}</span>`).join(' ') || "<small>Sem tópicos</small>";
    var repo_homepage = repo.homepage ? "🌎: " + repo.homepage : "";

    var repoDetailsHTML = 
    `
        <h4 class='card-title text-center'><a href='${repo.html_url}' class='text-decoration-none'><i class='fa-solid fa-book fa-lg'></i> ${repo.name}</a></h4>
        <hr>
        <div class='text-center' style='height : 24px;'>
            ${topicsHTML}
        </div>
        <p class='py-2'> <a href='${repo.html_url}' class='text-decoration-none'><strong> Descrição :</strong> ${repo_description}</a></p>
        <p><a href='${repo.homepage}'>${repo_homepage}</a></p>
        <p><strong> Criado em:</strong> ${repo_created_at} </p>
        <p><strong> Linguagem:</strong> ${repo_language} <i class='fa-regular fa-star'></i> ${repo_stars} <i class='fa-solid fa-code-fork'></i> ${repo_forks}</p> 
        <div id="readmeContent"></div>
    `;

    // Exibe as informações do repositório no modal
    repoModalBody.innerHTML = repoDetailsHTML;

    // Faz uma solicitação para obter o conteúdo do README.md do repositório
    $.get(`https://api.github.com/repos/${repo.full_name}/readme`)
        .done(function (readme) {
            // Decodifica o conteúdo do README.md
            var readmeContent = b64DecodeUnicode(readme.content);

            // Converte o conteúdo do README.md de Markdown para HTML
            var converter = new showdown.Converter();
            var html = converter.makeHtml(readmeContent);

            // Exibe o conteúdo do README.md no modal
            var readmeContentDiv = document.getElementById('readmeContent');
            readmeContentDiv.innerHTML = "<h5 class='text-center'>README.md</h5><hr>" + html;
        })
        .fail(function () {
            // Caso ocorra algum erro, exibe uma mensagem de erro
            var readmeContentDiv = document.getElementById('readmeContent');
            readmeContentDiv.innerHTML = "<div class='alert alert-danger'> README não encontrado.</div>";
        });
}

// Exibe os repositórios recebidos na tela.
function exibirRepositorios(repositorios) {
    var repoContainer = $("#repo-container");
    if (!Array.isArray(repositorios) || !repositorios.length) {
        repoContainer.append("<div class='alert alert-danger'> Houve um erro ao listar os repositórios do GitHub.</div>");
    } else {
        for (var repo of repositorios) {
            var repoCardHTML = criarRepositorioCard(repo);
            if (repoCardHTML) {
                repoContainer.append(repoCardHTML);
            }
        }
    }
}

// Busca os repositórios do usuário informado e os exibe na tela.
function buscarRepositorios() {
    requestRepositorios(usuario)
        .done(function (data) {
            var repositorios = data;
            exibirRepositorios(repositorios);
        })
        .fail(function () {
            $("#error-message").append("<div class='alert alert-danger'> Houve um erro ao listar os repositórios do GitHub.</div>");
        });
}

// A função para decodificar a string codificada em base64 com caracteres Unicode
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// Chame a função buscarRepositorios() para iniciar o processo.
