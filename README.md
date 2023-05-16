## Purpose
The purpose of this repo is to show how you can create web components using [storybook](https://storybook.js.org) with [lit.dev](https://lit.dev) built using [Vite](https://vitejs.dev/) with the use of [style-dictionary](https://amzn.github.io/style-dictionary/) to convert [Design Tokens](https://amzn.github.io/style-dictionary/#/tokens) into [CSS Vars](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties). I created a data table with the guidence of [pencilandpaper.io](https://pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables/).

### Why CSS Vars? 
CSS vars are the only way for global styles to pierce the encapsulation of web components while still encapsulating the JS and other CSS in the component. 

## Install
`npm install`

## Build theme
`npm run build:theme`

## Start Storybook
`npm run storybook`