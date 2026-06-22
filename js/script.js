import { initStoreModule } from "./storeModule.js";

async function initApplication(){
    await initStoreModule()
}

document.addEventListener('DOMContentLoaded', initApplication)
