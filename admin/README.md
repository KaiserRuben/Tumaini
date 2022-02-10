<!-- PROJECT SHIELDS -->

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#recommendations">Recommendations</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#copyright">Copyright</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Project

This repository is the admin codebase of [Tumaini](https://admin.tumaini.be/).

### Built With

* [Vue](https://cli.vuejs.org/)
* [NodeJS](https://nodejs.org/en/)

<!-- GETTING STARTED -->

## Getting Started

To run the cms just follow these steps.

### Prerequisites

There is a small number of steps you need to follow in order to get the cms up and running.

* NodeJS (to install node we are using the node version manager short [nvm](https://github.com/nvm-sh/nvm))
  ```sh
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
  nvm install node # "node" is an alias for the latest version
  ```
* Vue CLI
  ```sh
    npm install -g @vue/cli
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/KaiserRuben/Tumaini.git
   ```
2. Navigate to the admin folder
   ```sh
   cd admin
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

### Recommendations

- Webstorm
- Plugins:

    - Git Toolbox (For knowing who wrote the code your looking at)
    - Rainbow Brackets (For the sake of clarity)

<!-- USAGE EXAMPLES -->

## Usage

For running the cms in development mode simply run

   ```sh
   npm run serve
   ```

The page will be available under http://localhost:8080.

To compile and minify the cms for production run

   ```sh
   npm run build
   ```

The compiled cms can be found in the directory named "dist".

To run the local cms in combination with the local backend you need to change dbOnline to false in src/config.js.


<!-- Copyright -->

## Copyright

Copyright (c) Ruben Kaiser 2022

All code in the admin folder belongs to Ruben Kaiser.


<!-- CONTACT -->

## Contact

[Ruben Kaiser](mailto:ruben@kaiser.fyi)
