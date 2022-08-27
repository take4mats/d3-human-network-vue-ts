# d3-human-network (wrapped with Vue,TS)

Human network visualization web app based with D3.js, Vue.js and TypeScript.

Check out [the real app running here.](https://take4mats.github.io/d3-human-network-vue-ts/) (a quick image below)

![demo.png](https://github.com/take4mats/d3-human-network-vue-ts/blob/main/demo.png?raw=true)

## Feature

- Auto-layout by force simulation
- Draggable nodes
- Highlighting a node you clicked, the connected nodes and the links inbetween
- Zoom in/out and dragging the network canvas (which is not an HTML canvas, though)

## How to Use

1. Generating input data
    - You need 2 CSV files to describe nodes and links.  Refer to `util/nodes-example.csv` and `util/links-example.csv` and create your own.
    - Convert the 2 CSV files into 1 JSON file, by using the script `util/csv2json.py`.  For example:
    ```sh
    $ cd contrib/
    $ python csv2json.py nodes-example.csv links-example.csv data.json
    ```

2. Run locally
    - Run some http server locally like below commands (doesn't have to be python but any):
        ```sh
        $ npm i
        $ npm run serve
        ```
    - And then navigate your browser to the URL (e.g. http://localhost:8080)
    - Yes!  Now you will see the web page like above.

## Key technology employed (i.e. depending on)

- D3.js for data visualization
- Vue.js 2.x to build as a single page application
- Vuetify to apply material design-based styles
- TypeScript
