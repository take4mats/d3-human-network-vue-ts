<template>
  <v-container id="human-network">
    <v-expansion-panels focusable popout multiple v-model="panel">
      <!-- Input -->
      <v-expansion-panel>
        <v-expansion-panel-header> Input </v-expansion-panel-header>
        <v-expansion-panel-content id="input">
          <!-- Tabs -->
          <v-tabs v-model="tab" grow>
            <v-tab>By Form</v-tab>
            <v-tab>By JSON</v-tab>
          </v-tabs>

          <!-- Tabs Items -->
          <v-tabs-items v-model="tab">
            <!-- Form input -->
            <v-tab-item>
              <v-card class="mx-auto my-1">
                <!-- input form -->
                <v-form
                  class="form"
                  ref="form1"
                  v-model="validForm1"
                  lazy-validation
                >
                  <!-- nodes -->
                  <v-container>
                    <h2>Nodes</h2>
                    <v-row
                      v-for="(node, index) in formInput.nodes"
                      :key="index"
                    >
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="node.id"
                          :rules="[textFieldRule(node.id)]"
                          label="Id"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="node.group"
                          :rules="[textFieldRule(node.group)]"
                          label="Group"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          class="mx-2"
                          depressed
                          fab
                          dark
                          x-small
                          color="error"
                          @click="removeNode(index)"
                        >
                          <v-icon dark> mdi-minus </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <div class="text-center">
                      <v-btn
                        class="mx-2"
                        depressed
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="addNode"
                      >
                        <v-icon dark> mdi-plus </v-icon>
                      </v-btn>
                    </div>
                  </v-container>

                  <!-- edges -->
                  <v-container>
                    <h2>Edges</h2>
                    <v-row
                      v-for="(edge, index) in formInput.edges"
                      :key="index"
                    >
                      <v-col cols="12" md="3">
                        <v-autocomplete
                          v-model="edge.source"
                          :items="members"
                          dense
                          filled
                          label="Source person"
                          :rules="[memberFieldRule(edge.source)]"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-autocomplete
                          v-model="edge.target"
                          :items="members"
                          dense
                          filled
                          label="Target person"
                          :rules="[memberFieldRule(edge.target)]"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="edge.value"
                          :rules="[textFieldRule(edge.value)]"
                          label="Value"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          class="mx-2"
                          depressed
                          fab
                          dark
                          x-small
                          color="error"
                          @click="removeEdge(index)"
                        >
                          <v-icon dark> mdi-minus </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <div class="text-center">
                      <v-btn
                        class="mx-2"
                        depressed
                        fab
                        dark
                        x-small
                        color="primary"
                        @click="addEdge"
                      >
                        <v-icon dark> mdi-plus </v-icon>
                      </v-btn>
                    </div>
                  </v-container>
                </v-form>

                <!-- submission buttons -->
                <v-card-actions>
                  <v-spacer />
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        color="warning"
                        rounded
                        @click="buttonInitialize"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Initialize
                      </v-btn>
                    </template>
                    <span>LocalStorage cache will be erased.</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        color="default"
                        rounded
                        @click="buttonRestore"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Restore
                      </v-btn>
                    </template>
                    <span>Form data restored from the LocalStorage cache.</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        color="primary"
                        rounded
                        :disabled="!validForm1"
                        @click="buttonSaveData1"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Save
                      </v-btn>
                    </template>
                    <span>Save data and update the graph.</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-tab-item>

            <!-- JSON input -->
            <v-tab-item>
              <v-card class="mx-auto my-1">
                <v-card-text>
                  <v-form
                    class="form"
                    ref="form2"
                    v-model="validForm2"
                    lazy-validation
                  >
                    <v-textarea
                      outlined
                      name="json-input"
                      v-model="jsonInput"
                      :rules="[jsonFieldRule(jsonInput)]"
                      label="JSON style input"
                      height="400"
                    />
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        color="warning"
                        rounded
                        @click="buttonInitialize"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Initialize
                      </v-btn>
                    </template>
                    <span>LocalStorage cache will be erased.</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        color="default"
                        rounded
                        @click="buttonRestore"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Restore
                      </v-btn>
                    </template>
                    <span>Form data restored from the LocalStorage cache.</span>
                  </v-tooltip>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mx-2"
                        color="primary"
                        rounded
                        :disabled="!validForm2"
                        @click="buttonSaveData2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Save
                      </v-btn>
                    </template>
                    <span> Save data and update the graph. </span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- preview -->
      <v-expansion-panel>
        <v-expansion-panel-header> Debug View </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div id="preview">
            <v-card class="mx-auto my-1">
              <v-card-text>
                <pre style="text-align: left">{{
                  JSON.stringify(graph, null, 4)
                }}</pre>
              </v-card-text>
            </v-card>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- graph -->
      <v-expansion-panel>
        <v-expansion-panel-header> Graph </v-expansion-panel-header>
        <v-expansion-panel-content id="graph-surrounding" class="grey darken-1">
          <v-container>
            <v-row class="ma-auto" id="graph" justify="center"></v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
// eslint-disable-next-line
// @ts-nocheck
import { defineComponent } from "@vue/composition-api";
import { d3HumanNetwork } from "@/plugins/d3-human-network";
import Ajv from "ajv";
import GraphSchema from "@/schemas/graph";
import DefaultGraph from "@/plugins/default-graph";
import { Node, Edge, Graph, Member } from "@/types/graph";

export default defineComponent({
  name: "HumanNetwork",
  data: () => ({
    panel: [2],
    tab: null,
    validForm1: true as boolean,
    validForm2: true as boolean,

    graph: {
      nodes: [],
      edges: [],
    } as Graph,

    formInput: {
      nodes: [],
      edges: [],
    } as Graph,

    jsonInput: "" as string,
  }),

  computed: {
    members: function (): Member[] {
      return this.formInput.nodes.map((node: Node) => {
        return node.id;
      });
    },
  },

  watch: {
    graph(newGraph) {
      localStorage.humanNetworkGraph = JSON.stringify(newGraph, null, 4);
      d3HumanNetwork(JSON.parse(localStorage.humanNetworkGraph));
    },
  },

  mounted: function () {
    this.restoreInput();
  },

  methods: {
    addNode(): void {
      let emptyNode: Node = {
        id: "",
        group: "",
      };
      this.formInput.nodes.push(emptyNode);
    },

    removeNode(index: number): void {
      if (this.formInput.nodes.length > 1) {
        this.formInput.nodes.splice(index, 1);
      }
    },

    addEdge(): void {
      let emptyEdge: Edge = {
        source: "",
        target: "",
        value: "",
      };
      this.formInput.edges.push(emptyEdge);
    },

    removeEdge(index: number): void {
      if (this.formInput.edges.length > 1) {
        this.formInput.edges.splice(index, 1);
      }
    },

    // Restore input data from saved localStorage data.
    restoreInput(): void {
      if (!localStorage.humanNetworkGraph) {
        localStorage.humanNetworkGraph = JSON.stringify(DefaultGraph);
      }
      this.graph = JSON.parse(localStorage.humanNetworkGraph);
      this.formInput = this.graph;
      this.jsonInput = JSON.stringify(this.graph, null, 4);
    },

    buttonInitialize() {
      delete localStorage.humanNetworkGraph;
      this.restoreInput();
    },

    buttonRestore() {
      this.restoreInput();
    },

    buttonSaveData1(): void {
      if (this.$refs.form1.validate() === true) {
        this.graph = JSON.parse(JSON.stringify(this.formInput, null, 4));
        this.jsonInput = JSON.stringify(this.formInput, null, 4);
      }
    },

    buttonSaveData2(): void {
      if (this.$refs.form2.validate() === true) {
        this.graph = JSON.parse(this.jsonInput);
        this.formInput = JSON.parse(this.jsonInput);
      }
    },

    // eslint-disable-next-line
    textFieldRule(item: any): true | string {
      if (!item) return "This field is required";
      if (item === "") return "This field cannot be empty";
      return true;
    },

    // eslint-disable-next-line
    memberFieldRule(item: any): true | string {
      if (!item) return "This field is required";
      if (item === "") return "This field cannot be empty";
      if (!this.members.includes(item)) return "Choose from existing members";
      return true;
    },

    jsonFieldRule(jsonStr: string): true | string {
      if (!jsonStr) return "This field is required";

      try {
        const obj = JSON.parse(jsonStr);
        const ajv = new Ajv();
        const validate = ajv.compile(GraphSchema);
        if (validate(obj) === false) {
          console.log(validate.errors);
          return JSON.stringify(validate.errors, null, 4);
        }
        // eslint-disable-next-line
      } catch (error: any) {
        return error.message;
      }

      return true;
    },
  },
});
</script>

<style>
svg {
  background-color: white;
  border: solid 10px black;
}

/* highlight when you click a node */
circle {
  filter: blur(3px);
}
.node-suppressed {
  fill: #ccc;
}
.node-label {
  text-anchor: middle;
  fill: black;
  font-size: 12px;
}
.node-label-suppressed {
  font-size: 5px;
}

line {
  stroke: grey;
  stroke-width: 5px;
  stroke-opacity: 0.6;
}
.link-label {
  text-anchor: middle;
  fill: black;
  font-size: 12px;
}
.link-suppressed {
  stroke: grey;
  stroke-width: 1px;
}
.link-label-suppressed {
  fill: #ccc;
  font-size: 5px;
}
</style>
