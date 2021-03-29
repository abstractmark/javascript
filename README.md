# Javascript implementation of AbstractMark.
For more information about Abstractmark, please visit this [repository](https://github.com/abstractmark/abstractmark).

## AbstractMark CLI
- Requirement:

    - npm installed with its path registered on your system path. (You may ignore this if you installed npm in the proper way)

- Installation
    Type `npm install @abstractmark/abstractmark -g`. To make sure it's installed properly, please type `abstractmark --help`, it should shows abstractmark CLI usage, if it doesn't, please open an issue.
    
- Usage:
    - For Converting Abstractmark file: run `abstractmark [abstractmark file] [abstractmark options] [args]`
    - For Converting Abstractmark files inside a folder: run `abstractmark [folder] [abstractmark options args]`
    - For Abstractmark's Information : run `abstractmark [option]`
    - For more information about AbstractMark CLI, please type `abstractmark --help` on your terminal.

## Import AbstractMark
- Installation

    Type `npm install @abstractmark/abstractmark` on your command line.

- Usage:

    - `import {AbstractMark} from "@abstractmark/abstractmark"` to import AbstractMark
    - Pass your text to convert into AbstractMark function with your options, example: `AbstractMark("# Hello World {#Hi} {color:red}", {styled: true})`

- Available options:
    - `styled`, convert your text into html tags with default styled
    - `fullHTMLTags`, convert your text into full structured html tags.

## Setup (development)
- Clone this repository by typing `git clone https://github.com/abstractmark/javascript.git abstractmark` and get into it by typing `cd abstractmark`
- To start setting up abstractmark CLI, type `npm i -g` to install it globally. To make sure abstractmark CLI is installed, type `abstractmark --help`. For more information about  CLI is also written there.

## Code of Conduct
For the Code of Conduct, please visit [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Contributing Guidelines
Thanks for your interest in contributing to AbstractMark! Please take a moment to review this [document](CONTRIBUTING.md)

## License
AbstractMark is distributed under [MIT License](LICENSE)