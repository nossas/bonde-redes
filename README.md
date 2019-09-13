# bonde-microservices

## Commands

#### Install
```
pnpm m i
```
---

#### Delete `node_modules` recursively

```pnpm m run clean```

---

#### Run all projects

```pnpm m run dev```

---

#### Install dependency on specific package

```pnpm m i <dependency-name> [-D] -- <pkg-name>```

#### Filter when run command

```pnpm m --filter ./packages/cli-mautic-forms run dev```

#### Or run commands inside package directory

```cd ./packages/cli-mautic-forms && pnpm run dev```

