// -------------------------------------------
//   Autor: Luiz Soares
//   Copyright (c) 2022 Luiz Soares
// -------------------------------------------
const usuario = "luizh-gsoares";

function buscarRepositorios() {
    var requestURL = 'https://api.github.com/users/' + usuario + '/repos';
    var request = $.get(requestURL, function () {
    })
        .done(function () {
            request = request.responseJSON;
            if (!Array.isArray(request) || !request.length) {
                $("#repo-container").append("<div class='alert alert-danger'> Houve um erro ao listar os repositórios do GitHub.</div>");
            }
            else {
                for (i = 0; i < request.length; i++) {
                    // Variáveis para armazenar informações do repositório, caso queira alguma que não esteja aqui
                    // Acessar documentação do GitHub API em https://docs.github.com/en/rest?apiVersion=2022-11-28
                    var repo_url = request[i].html_url;
                    var repo_name = request[i].name;
                    var repo_description = request[i].description;
                    var repo_created_at = new Date(request[i].created_at).toLocaleDateString();
                    var repo_language = request[i].language;
                    var repo_topics = request[i].topics;

                    // Verifica se o repositório contém um tópico 'esconder', se sim, não exibe o repositório.
                    if (repo_topics == 'esconder') {
                        continue;
                    }

                    // Verifica se o repositório não contém descrição ou linguagem.
                    if (repo_description == null) {
                        repo_description = "<p>Sem descrição.</p>";
                    }
                    
                    if (repo_language == null) {
                        repo_language = "-";
                    }


                    // Colocar o repositório na página como div
                    $("#repo-container").append(
                        "<div class='col'>"
                        + "<div class='card h-100'>"
                        + "<div class='card-body'>"
                        + "<h5 class='card-title'><i class='fa-solid fa-code-branch'></i> " + repo_name + "</h5>"
                        + "<h6 class='card-subtitle text-muted'>"+ repo_topics +"</h6>"
                        + "<p class='card-text'>" + repo_description + "</p>"
                        + "</div>"
                        + "<div class= 'card-footer'>"
                        + "<p class='text-white'><a href='"+ repo_url +"' class='stretched-link'></a></p>"
                        + "<p class='card-text'>Linguagem : " + repo_language + "</p>"
                        + "<small class='text-muted'> Criado em : " + repo_created_at + "</small>"
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>");
                }
            }
        });
}
