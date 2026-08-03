import { initStoreModule } from "./storeModule.js";
import { initCartPage } from "./carritoModule.js";

async function initApplication(){
    if (!document.getElementById('carrito-body')) {
        await initStoreModule();
    }
    await initCartPage();
}

document.addEventListener('DOMContentLoaded', initApplication)
