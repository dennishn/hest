# ECCO Global Commerce Front-end Monorepo

This monorepo houses all front-end / JavaScript code.

## What's inside?

This monorepo uses [NPM](https://www.npmjs.com/) as a package manager.
The monorepo is managed using [Turborepo](https://turborepo.org/).

It includes the following packages/apps:

### Apps and Packages
- `web`: The [Next.js](https://nextjs.org) Ecommerce Site
- `bff`: The [Nest.js](https://nestjs.com/) [Backend for Frontend(BFF)](https://docs.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends)
- `ui`: The ECCO Design System / Component Library
- `sdk`: The BFF client SDK
- `ecco-config`: `eslint` and other tooling configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo workspaces

Each package/app is written in [TypeScript](https://www.typescriptlang.org/).

#### What goes into `apps` and what goes into `packages`

##### Apps

Apps are containers that can use, bundle and compile packages, and be deployed and executed: a Node Server, a set of Next.js Edge Functions (`next build`), a static site (`next export`).

##### Packages

Packages are isolated features, functionality and configs that can be consumed by Apps, other packages and/or published to NPM.

## Setup

### nvm

The project uses [Node Version Manager](https://github.com/nvm-sh/nvm) - switch to the project Node / NPM versions by running `nvm use` from the root.

### Install

To install all project dependencies, run `npm install` from the root.

### Running NPM Scripts

As workspace dependencies are hoisted to the root `node_modules` folder, you should not run npm scripts from individual workspace folders.

You can run a script for a specific workspaces by adding the `--workspace=` flag: `npm run lint --workspace=sdk`.

You can run a script for multiple workspaces by using multiple `--workspace` flags: `npm run build --workspace=ui --workspace=sdk`.

You can run a script for all workspaces (*not recommended*) by using the plural `--workspaces` flag: `npm run format --workspaces`.

#### Installing dependencies

To install dependencies for a specific workspace use `npm install (-D) [packages] --workspace=ui`.

If you omit the `--workspace` flag, the dependencies will be installed in ***all workspaces***. 

### Environment Variables

TBD

### Task Execution Order

turborepo will ensure to execute the scripts in correct order based on the different workspaces own dependencies.

Read more about pipelines and scoped tasks:
- https://turborepo.org/docs/features/pipelines
- https://turborepo.org/docs/features/scopes

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
npm run dev
```

## Workspaces

In this monorepo we operate with two types of workspaces, `apps` and `packages`:

An `app` is a deployable bundle of code and can be anything from react-native, node, to a gatsby static site.

An app will usually have a number of dependencies that can be developed in isolation and be consumed by multiple apps - we call these `packages`.

To simplify configurations like tsconfig and eslint across `apps` and `packages`, we also use `packages` to simplify managing the different environments we support.

### Anatomy of a Workspace

Both `apps` and `packages` (except ecco-* config folders) follow a similar structure:

```
|-- src
|   -- ...
|-- .eslintrc
|-- package.json
|-- tsconfig.json
```

*note: you cannot nest workspaces in sub folders - a workspace must live directly under `apps` or `packages`*

#### Workspace `package.json`

When creating a new workspace, give it a `name` - this name will be resolvable by the module system in all workspaces.

Pin the version to 0.0.0 and keep it on that version, unless if you plan on versioning your workspace, i.e. to publish it on NPM.

##### NPM scripts

Key features of `turborepo` is scoped tasks and caching:
- https://turborepo.org/docs/features/scopes
- https://turborepo.org/docs/features/caching

As common npm scripts are executing using `turborepo` runner, a workspace should define the following NPM scripts:
- `build`
- `dev`
- `format` (required)
- `lint` (required)
- `clean`
*Refer to the example, or existing workspaces to see how to define these scripts*

**build artifacts**
configure your build task to output files in `dist` - this folder is ignored globally in the monorepo. 

##### dependencies

Workspace dependencies, i.e. an `app` depending on a `package`, are resolved by the node module system and can be listed together with external dependencies in a workspace `package.json`.

If the workspace dependency is unversioned (`0.0.0`) you can use `*` as version.

**dev dependencies**

As we require all workspaces to have `format` and `lint` scripts, a workspace must always list `ecco-configs` and `ecco-tsconfigs` as `devDependencies`:
```
"devDependencies": {
  "ecco-configs": "*",
  "ecco-tsconfigs": "*"
}
```

**typescript dev dependency**

As Typescript is the primary language in this project, please ensure that you add `typescript` as a `devDependency` with the same version as the other workspaces.

**Keep dependencies versions aligned**

For now a manual process, all dependencies across `apps` and `packages` should be kept in sync.
Before you add a dependency, make sure to check the other workspaces and align your dependency with any existing versions.
This helps speed up both installation, dev servers, and compilation both on your machine and in CI environments.

If you see `node_modules` in a **workspace** folder (`apps/*`, `packages/*`) then it is a sign of a version misalignment.

##### metadata

Bundling for external consumers, and making workspaces distributable to NPM will be documented at a later point.

You can refer to the `sdk` and `ui` `packages` for examples on workspace configuration.

##### example
```
{
  "name": "sdk",
  "version": "0.0.0",
  "main": "index.tsx",
  "types": "index.tsx",
  "scripts": {
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx}\"",
    "lint": "tsc --pretty --noEmit && eslint \"**/*.{ts,tsx,js,jsx}\" --fix"
  },
  "devDependencies": {
    "ecco-configs": "*",
	"ecco-tsconfigs": "*",
    "typescript": "^4.5.3"
  }
}
```

#### workspace `tsconfig.json`

We have a selection of typescript configurations that can be uses depending on target environment.

All configurations extend a set of industry and monorepo best practices. We use typescript in strict mode.

A workspace own `tsconfig` *must* extend at minimum `base.json` but you should prefer one of the predefined configurations.

If a third party library or framework requires customizing any `tsconfig` `compilerOptions`, you can overwrite those options in the workspace `tsconfig`.

Some settings cannot be shared between workspaces, this commonly includes:
- `include` and `exclude` properties
- path resolutions

Refer to existing workspace `tsconfigs` for workspace specific configurations.

Ps.: Do your fellow developers a solid, and add path resolutions to root folders in `src` to support absolute import paths.

##### example
```
{
  "extends": "ecco-tsconfigs/nextjs.json",
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ],
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": [
        "components/*"
      ],
      "@config/*": [
        "config/*"
      ],
      "@graphql/*": [
        "graphql/*"
      ],
      "@hooks/*": [
        "hooks/*"
      ],
      "@lib/*": [
        "lib/*"
      ]
    }
  }
}
```
#### workspace `.eslintrc`

All workspace `.eslintrc` must use the shared monorepo eslint rules:

`.eslintrc`
```
module.exports = require("ecco-configs/eslint-preset");
```

#### tooling

Depending on the type of `app` or `package` you are building, we have a set of recommended tools and configurations:

**typescript**
- https://tsup.egoist.sh/

##### publishable / consumable libraries

TBD

## Design System / UI Libary

TBD

## SDK

TBD

## React Code Styleguide

TBD

## Typescipt Code Styleguide
 
TBD

- no .d.ts files - dont pollute global scope
- prefer named exports in files with both code and TS declarations
- trust the inferred types (dont over-type)
