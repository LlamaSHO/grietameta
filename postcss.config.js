import prefixer from "postcss-prefix-selector";

// Cada archivo de src/assets/styles/views/<nombre>.css se encierra en
// `.view-<nombre>`, la clase del elemento raíz de su vista. Así los estilos de
// una página (que vienen de los antiguos HTML y tocan :root, body, .nav…) no
// se mezclan con los de otra al navegar dentro de la SPA.
const VIEW_CSS = /[\\/]assets[\\/]styles[\\/]views[\\/]([\w-]+)\.css$/;

export default {
  plugins: [
    prefixer({
      // El plugin no hace nada sin prefijo; el real lo decide transform() por archivo.
      prefix: ".view",
      transform(_prefix, selector, _prefixed, filePath) {
        const match = filePath && filePath.match(VIEW_CSS);
        if (!match) return selector;
        const scope = `.view-${match[1]}`;
        // :root, html y body pasan a ser la propia raíz de la vista.
        const rest = selector.replace(/^(\s*(:root|html|body)\b)+/, "").trim();
        if (rest !== selector.trim()) {
          return rest ? (/^[.:#[]/.test(rest) ? scope + rest : `${scope} ${rest}`) : scope;
        }
        return `${scope} ${selector}`;
      },
    }),
  ],
};
