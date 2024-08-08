const acorn = require('acorn');
const walk = require('acorn-walk');

class GolfMinifierPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  charCode = 65;

  apply(compiler) {
    compiler.hooks.compilation.tap('GolfMinifierPlugin', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: 'GolfMinifierPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets, callback) => {
          for (const assetName in assets) {
            if (assetName.endsWith('.js')) {
              let source = assets[assetName].source();
              source = this.golfMinify(source);
              compilation.updateAsset(
                assetName,
                new compiler.webpack.sources.RawSource(source)
              );
            }
          }
          callback();
        }
      );
    });
  }

  golfMinify(source) {
    const allKeys = [
      [
        'document.addEventListener',
        'document.referrer',
        'location.hash',
      ],

      [
        'document',
        'qeen',
        'Date.now',
        'location',
        'clearTimeout',
        'addEventListener',
        'Promise',
        'navigator',
        'Math',
        'console',
        'Error',
        'setTimeout',
        'Array.isArray',
        'String',
      ],
    ];

    let declarations = '';
    let hoistedStatements = '';

    allKeys.forEach(keys => {
      const mappings = this.generateMappings(keys);
    
      for (const [longName, shortName] of Object.entries(mappings)) {
        const longNameRegex = new RegExp(`(?<=\\=\\s*)${longName}(?=\\.)`, 'g');
        declarations = declarations.replace(longNameRegex, shortName);
      }
    
      for (const longName of Object.keys(mappings)) {
        const windowPropertyRegex = new RegExp(`window\\.${longName}\\b[^;]*;`, 'g');
        const matches = source.match(windowPropertyRegex);
        if (matches) {
          hoistedStatements += matches.join('\n') + '\n';
          source = source.replace(windowPropertyRegex, '');
        }
      }
    
      const ast = acorn.parse(source, { ecmaVersion: 2020 });
    
      walk.simple(ast, {
        Identifier(node) {
          if (mappings[node.name]) {
            node.name = mappings[node.name];
          }
        },
        MemberExpression(node) {
          if (node.object.name === 'window' && mappings[node.property.name]) {
            node.property.name = mappings[node.property.name];
          }
        }
      });
    
      source = this.generateCodeFromAST(ast);
    
      for (const [longName, shortName] of Object.entries(mappings)) {
        if (longName.includes('.')) {
          const longNameRegex = new RegExp(`\\b${longName}\\b`, 'g');
          source = source.replace(longNameRegex, shortName);
        }
        declarations = `${shortName}=${longName},${declarations}`;
      }
    });

    declarations = `var ${declarations.slice(0, -1)};`;

    const iifeRegex = /(\(function\s*\(\)\s*\{|\(\(\)\s*=>\s*\{)/;
    if (iifeRegex.test(source)) {
      source = source.replace(iifeRegex, (match) => {
        const useStrictRegex = /(['"])use strict\1;\s*/;
        if (useStrictRegex.test(source)) {
          return match + '\n"use strict";\n' + hoistedStatements + declarations;
        }
        return match + '\n' + hoistedStatements + declarations;
      });
    } else {
      source = hoistedStatements + declarations + source;
    }

    return source;
  }

  generateMappings(keys) {
    const mappings = {};

    keys.forEach(key => {
      mappings[key] = String.fromCharCode(this.charCode);
      this.charCode++;
    });
    return mappings;
  }

  generateCodeFromAST(ast) {
    const escodegen = require('escodegen');
    return escodegen.generate(ast);
  }
}

module.exports = GolfMinifierPlugin;