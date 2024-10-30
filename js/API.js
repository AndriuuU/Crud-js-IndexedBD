// API.js

let db;

export function conectarDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("crm", 1);

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onerror = () => reject("Error al conectar con la base de datos");

        request.onupgradeneeded = (e) => {
            db = e.target.result;
            const objectStore = db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true });
            objectStore.createIndex("nombre", "nombre", { unique: false });
            objectStore.createIndex("email", "email", { unique: true });
            objectStore.createIndex("telefono", "telefono", { unique: false });
            objectStore.createIndex("empresa", "empresa", { unique: false });
        };
    });
}

export function agregarCliente(cliente) {
    const transaction = db.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");
    objectStore.add(cliente);
}

export function obtenerClientes() {
    return new Promise((resolve) => {
        const transaction = db.transaction("clientes", "readonly");
        const objectStore = transaction.objectStore("clientes");
        const clientes = [];

        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                clientes.push(cursor.value);
                cursor.continue();
            } else {
                resolve(clientes);
            }
        };
    });
}

export function actualizarCliente(cliente) {
    const transaction = db.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");
    objectStore.put(cliente);
}

export function eliminarCliente(id) {
    const transaction = db.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");
    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`Cliente con ID ${id} eliminado`);
    };

    transaction.onerror = () => {
        console.error(`Error al eliminar el cliente con ID ${id}`);
    };
}