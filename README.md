# Movie Toolchain

A complete movie toolchain 🎬

> ⚠️ This project is open source but made for self usage if you like this project feel free to star and fork this repository.
>
> ⚠️ Any problem with this project or security issues is your responsibility to handle them.
>
> ⚠️ No issues or pull requests will be accepted.

## Table of Contents

- [Overview](#overview)
- [Tech](#tech)
- [Prerequisites](#prerequisites)
- [Create Config File](#create-config-file)
- [Commands](#commands)

## Overview

An electron app that aim to prepare movie into my plex movies collection.

## Tech

- Electron
- TypeScript
- React
- NodeJS

## Prerequisites

- [Node.js](https://nodejs.org) (>= 18 required)
- npm package manager (>= 8 required)

## Create Config File

Create the config file from txt file.

```sh
cp src/server/utils/config.txt src/server/utils/config.ts
```

And update the constants value.

## Commands

Run locally.

```shell
npm start
```

Build app distributions (currently added for only Mac).

```shell
npm run make
```

# License

[MIT](LICENSE)
