import { initStoreModule } from "./storeModule.js";

function initApplication(){
    initStoreModule()
}

document.addEventListener('DOMContentLoaded', initApplication)
