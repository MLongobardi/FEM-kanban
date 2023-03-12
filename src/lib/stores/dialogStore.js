import { writable } from "svelte/store";
import initializeStore from "./utility/initializeStore.js";
import * as dialogStoreMethods from "./methods/dialogStore.js";

const startObject = {};

const dialogStore = initializeStore(writable(startObject), dialogStoreMethods);
export default dialogStore;