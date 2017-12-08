module.exports = {
    "extends": "airbnb",
    "parserOptions": {
    	"sourceType": "script"
    },
    "rules": {
      "strict": ["error", "global"],
      "radix": ["error", "as-needed"],
      "no-console": ["off"],
      "require-jsdoc": ["error", {
        "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": true,
          "ArrowFunctionExpression": false
        }
      }],
      "valid-jsdoc": ["error"],
      "arrow-body-style": ["off"],
      "no-continue": ["off"],
      "no-plusplus": ["off"],
      "no-restricted-syntax": ["off"],
      "import/no-extraneous-dependencies": [2, { devDependencies: true }],
      "no-unused-expressions": ["off"]
    },
    "env": {
      "node": true
    },
    "globals": {
      "system": true
    },
};
