// -------------------------------------------
//   Author: Luiz Soares
//   Copyright (c) 2022 Luiz Soares
// -------------------------------------------
const user = "luizh-gsoares";

function buscarRepositorios() {
    var requestURL = 'https://api.github.com/users/' + user + '/repos';
    var request = $.get(requestURL, function () {
    })
        .done(function () {
            request = request.responseJSON;
            if (!Array.isArray(request) || !request.length) {
                $("#repo-container").append("<div class='alert alert-danger'>Houve um erro ao listar os repositórios do GitHub, por favor, acesse manualmente em https://github.com/luizh-gsoares?tab=repositories.</div>");
            }
            else {
                for (i = 0; i < request.length; i++) {
                    // Variáveis para armazenar informações do repositório, caso queira alguma que não esteja aqui
                    // Acessar documentação do GitHub API em https://docs.github.com/en/rest?apiVersion=2022-11-28
                    var username = request[i].owner.login;
                    var repo_url = request[i].html_url;
                    var repo_name = request[i].name;
                    var repo_description = request[i].description;
                    var repo_language = request[i].language;
                    var repo_stars = request[i].stargazers_count;
                    var repo_forks = request[i].forks;

                    // Verifica se o repositório não contém descrição ou linguagem.
                    if (repo_description == null) {
                        repo_description = "<i>Sem descrição.</i>";
                    }
                    if (repo_language == null) {
                        repo_language = "-";
                    }

                    // Colocar o repositório na página como div
                    $("#repo-container").append(
                        "<div class='card' href='" + repo_url + "'>"
                        + "<div class='card-body'>"
                        + "<h5 class='card-title'><a href='" + repo_url + "' target='_blank'>" + repo_name + "</a></h5>"
                        + "<p class='card-text'>" + repo_description + "</p>"
                        + "<div class='row'>"
                        + "<div class='col-6'>"
                        + "<p class='card-text'><small class='text-muted'>Language: " + repo_language + "</small></p>"
                        + "</div>"
                        + "</div>"
                        + "</div>"
                        + "</div>");
                }
            }
        });
}
