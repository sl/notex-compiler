# Formal Specification

This is the formal specification for the NoTeX language.

## Let's Get Write To It

STRING = number | non-keyword word

ESCAPE_SYMBOL = \\STRING

RAW = ESCAPE_SYMBOL | STRING

TRANSLATABLE_EXPRESSION = <= | >= | ...
   | TRANSLATABLE_KEYWORD RAW
   | RAW

An EXPRESSION is one of
- RAW
- LPAREN EXPRESSION RPAREN
-
