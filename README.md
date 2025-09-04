# eslint-plugin-vlad_vs-path-checker-plugin

plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-vlad_vs-path-checker-plugin`:

```sh
npm install eslint-plugin-vlad_vs-path-checker-plugin --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-vlad_vs-path-checker-plugin` and add `vs` to the `plugins` key:

```js
import { defineConfig } from "eslint/config";
import vs from "eslint-plugin-vlad_vs-path-checker-plugin";

export default defineConfig([
    {
        plugins: {
            'vlad_vs-path-checker-plugin'
        }
    }
]);
```


Then configure the rules you want to use under the `rules` key.

```js
import { defineConfig } from "eslint/config";
import vs from "eslint-plugin-vlad_vs-path-checker-plugin";

export default defineConfig([
    {
        plugins: {
            'vlad_vs-path-checker-plugin'
        },
        rules: {
            'vlad_vs-path-checker-plugin/path-checker': 'error'
        }
    }
]);
```



## Configurations

<!-- begin auto-generated configs list -->
TODO: Run eslint-doc-generator to generate the configs list (or delete this section if no configs are offered).
<!-- end auto-generated configs list -->



## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


