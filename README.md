# bonde-microservices

Instalar tipos do typescript somente na raiz do projeto, com o comando `pnpm i --shamefully-flatten -D @types/<pkg-name>`

## Commands

#### Install
```
pnpm m i --shamefully-flatten
```
---
#### Delete `node_modules` recursively
```
pnpm m run clean
```
---
#### Run all projects
```
pnpm m run dev
```
---
#### Install dependency on specific package
```
pnpm m i <pkg-name> [-D] -- <pkg-name>
```
