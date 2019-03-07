# airforsteam-config
[![NPM version](https://badge.fury.io/js/airforsteam.svg)](http://badge.fury.io/js/airforsteam)
[![Dependency Status](https://img.shields.io/david/nysos3/airforsteam-config.svg)](https://david-dm.org/nysos3/airforsteam-config)
[![npm](https://img.shields.io/npm/dm/airforsteam.svg?maxAge=2592000)](https://www.npmjs.com/package/airforsteam)

> An unofficial Air-for-Steam CLI with interactive configuration and updating of the Air-for-Steam skin

> For GUI usage, please see [README.md](https://github.com/nysos3/airforsteam-config/blob/master/README.md).

<img width="800" alt="airforsteam-config" src="https://github.com/nysos3/airforsteam-config/blob/master/assets/showcase.gif?raw=true">

#### Why?
I got tired of applying my desired theme options after each update of the skin.

Also, copying files on mac is awful.

## Requirements
[Node](https://nodejs.org/en/)

#### Windows
Windows users may also need to run the following from an elevated command prompt.
It is entirely possible that you may not need this step. For more information, see [here](https://www.npmjs.com/package/windows-build-tools).
```bash
npm install -g --production windows-build-tools
```

#### macOS
Honestly, as far as I'm aware this tool should work out of the box. If you run into issues running or installing this tool on macOS, please [open an issue](https://github.com/nysos3/airforsteam-config/issues) and provide details so that I may update this readme.

#### Linux
On Linux, you also may need to install the libfontconfig-dev package, for example:
```bash
sudo apt-get install libfontconfig-dev
```

## Install
```bash
npm i -g airforsteam
```

## Run
```bash
npx airforsteam
```

Available options may be viewed by running the help command.
```bash
npx airforsteam --help
```

## Credits
 - Clearly, credits to the team behind [Air for Steam](https://github.com/airforsteam/Air-for-Steam)
 - [dylang](dylang)'s [npm-check](https://github.com/dylang/npm-check/) for inspiration into best practices for CLI development, as this is my first public/polished CLI.

## TODO
 - Test Windows more extensively

## License
Yeah, I don't pretend to understand legalese, so I've mimicked the same license, CC-BY-NC-4.0, used by [Air for Steam](https://github.com/airforsteam/Air-for-Steam/blob/813c437397f75f79672f29b98cce2741b3fa351e/LICENSE.txt)

Screenshots are [CC BY-SA-4.0](https://creativecommons.org/licenses/by-sa/4.0/)
