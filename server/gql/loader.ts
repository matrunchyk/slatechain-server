import merge from 'lodash.merge';
import normalizedPath from 'path';
import fs from 'fs';
import pascalCase from 'pascal-case';

export const resolvers = {
  Query: {},
  Mutation: {},
};

export const typeDefs: string[] = [
  `
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
  `,
];

export const schemaDirectives = {};

// TypeDefs
fs.readdirSync(normalizedPath.join(__dirname, 'schema'))
  .forEach((file: string) => {

  if (/.*\.js$/.test(file) && file !== 'index.js') {
    const mdl = require(`./schema/${file}`);

    if (mdl.resolvers) {
      merge(resolvers, mdl.resolvers);
    }

    if (mdl.typeDef) {
      typeDefs.push(mdl.typeDef);
    }
  }
});


// Directives
const directivesDir = normalizedPath.join(__dirname, 'directives');

if (fs.existsSync(directivesDir)) {
  fs.readdirSync(directivesDir)
    .forEach((file: string) => {

      if (/.*\.js$/.test(file) && file !== 'index.js') {
        const mdl = require(`./directives/${file}`);

        const normalizedFile = file.replace(/\.js$/, '');
        const className = `${pascalCase(normalizedFile)}Directive`;

        if (mdl[className]) {
          merge(schemaDirectives, {
            [normalizedFile]: mdl[className],
          });
        }

        if (mdl.typeDef) {
          typeDefs.push(mdl.typeDef);
        }
      }
    });
}

