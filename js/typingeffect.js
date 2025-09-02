/*** Plugin ***/

(function ($) {
  // writes the string
  //
  // @param jQuery $target
  // @param String str
  // @param Numeric cursor
  // @param Numeric delay
  // @param Function cb
  // @return void
  function typeString($target, str, cursor, delay, cb) {
    $target.html(function (_, html) {
      return html + str[cursor];
    });

    if (cursor < str.length - 1) {
      setTimeout(function () {
        typeString($target, str, cursor + 1, delay, cb);
      }, delay);
    } else {
      cb();
    }
  }

  // clears the string
  //
  // @param jQuery $target
  // @param Numeric delay
  // @param Function cb
  // @return void
  function deleteString($target, delay, cb) {
    var length;

    $target.html(function (_, html) {
      length = html.length;
      return html.substr(0, length - 1);
    });

    if (length > 1) {
      setTimeout(function () {
        deleteString($target, delay, cb);
      }, delay);
    } else {
      cb();
    }
  }

  // jQuery hook
  $.fn.extend({
    teletype: function (opts) {
      var settings = $.extend({}, $.teletype.defaults, opts);

      return $(this).each(function () {
        (function loop($tar, idx) {
          // type
          typeString($tar, settings.text[idx], 0, settings.delay, function () {
            // delete
            setTimeout(function () {
              deleteString($tar, settings.delay, function () {
                loop($tar, (idx + 1) % settings.text.length);
              });
            }, settings.pause);
          });
        })($(this), 0);
      });
    },
  });

  // plugin defaults
  $.extend({
    teletype: {
      defaults: {
        delay: 80,
        pause: 5000,
        text: [],
      },
    },
  });
})(jQuery);

/*** init ***/

$("#target").teletype({
  text: [
    " Oi, eu sou o Luiz Henrique Soares, Desenvolvedor de Software em formação.",
    " Estagiário de Engenharia de Software na CAIXA.",
    " Estudante de Engenharia de Software na UnB.",
    " Especialista em desenvolvimento .NET Core e Angular.",
    " Apaixonado no universo Star Wars e Jedi nas horas vagas.",
    " Fã de carteirinha da banda The Lumineers.",
    " Construtor de casinhas medievais no Minecraft.",
    " Sempre em busca de novos desafios e aprendizado contínuo.",
    " Entusiasta de clean code e boas práticas de desenvolvimento.",
    " Por fim, amo café :)",
  ],
});

$("#cursor").teletype({
  text: ["_"],
  delay: 0,
  pause: 500,
});
