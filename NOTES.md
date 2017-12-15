# Notes

This document stores notes about future implementation details for the NoTeX
 compiler.

## Flexibility

One requirement is that the NoTeX compiler be "flexible." This means that it
will attempt to make some valid LaTeX output for any given input. If the input
is not valid NoTeX, it will take its best guess at a the intent of the user.

Here is a list of proposals that might help to achieve this goal:

### 1.) Raw Value Scrunching.

If there is an error in parsing an expression, the compiler may attempt to
concatenane the next two tokens together into a single raw value token. If this
new token stream is a valid expression, then use that.
