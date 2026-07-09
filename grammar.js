module.exports = grammar({
  name: 'uon',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  conflicts: $ => [
    [$.identifier, $.boolean],
    [$.identifier, $.null],
  ],

  rules: {
    document: $ => repeat($.value),

    value: $ => choice(
      $.object,
      $.array,
      $.string,
      $.date,
      $.number,
      $.boolean,
      $.null,
      $.duration,
      $.identifier,
    ),

    object: $ => seq(
      '{',
      optional(seq(
        $.pair,
        repeat(seq(',', $.pair)),
        optional(','),
      )),
      '}',
    ),

    pair: $ => seq(
      field('key', choice($.string, $.identifier)),
      ':',
      field('value', $.value),
    ),

    array: $ => seq(
      '[',
      optional(seq(
        $.value,
        repeat(seq(',', $.value)),
        optional(','),
      )),
      ']',
    ),

    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        /\\./,
      )),
      '"',
    ),

    number: $ => token(choice(
      /-?\d+\.\d*([eE][+-]?\d+)?/,
      /-?\d+([eE][+-]?\d+)?/,
    )),

    boolean: $ => choice(
      'истина',
      'ложь',
    ),

    null: $ => 'пусто',

    date: $ => token(/\d{4}-\d{2}-\d{2}/),

    duration: $ => token(/\d+(?:[гдмсч]|мин)(?:\d+(?:[гдмсч]|мин))*/),

    identifier: $ => /[_\p{L}][_\p{L}\p{N}]*/,

    comment: $ => token(choice(
      /\/\/[^\n]*/,
      /\/\*[\s\S]*?\*\//,
    )),
  },
});
