
let db;

// Conectar a la base de datos
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

// Agregar un cliente
export function agregarCliente(cliente) {
    const transaction = db.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");
    objectStore.add(cliente);
}

// Obtener todos los clientes
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

// Actualizar un cliente
export function actualizarCliente(cliente) {
    const transaction = db.transaction(["clientes"], "readwrite");
    const objectStore = transaction.objectStore("clientes");
    objectStore.put(cliente);
}

// Eliminar un cliente
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

// Cargar clientes en el DOM
async function cargarClientes() {
    const clientes = await obtenerClientes();
    const listadoClientes = document.querySelector("#listado-clientes");
    listadoClientes.innerHTML = "";

    clientes.forEach((cliente) => {
        const { nombre, telefono, empresa, id } = cliente;
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="px-6 py-4 border-b border-gray-200">${nombre}</td>
            <td class="px-6 py-4 border-b border-gray-200">${telefono}</td>
            <td class="px-6 py-4 border-b border-gray-200">${empresa}</td>
            <td class="px-6 py-4 border-b border-gray-200">
                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-800">Editar</a>
                <button data-cliente="${id}" class="text-red-600 hover:text-red-800 ml-2 eliminar-btn">Eliminar</button>
            </td>
        `;
        listadoClientes.appendChild(fila);
    });

    document.querySelectorAll(".eliminar-btn").forEach((button) => {
        button.addEventListener("click", eliminarClienteHandler);
    });
}

// Manejador para eliminar cliente
async function eliminarClienteHandler(e) {
    const idCliente = Number(e.target.dataset.cliente);
    const confirmar = confirm("¿Deseas eliminar este cliente?");
    if (confirmar) {
        eliminarCliente(idCliente);
        e.target.parentElement.parentElement.remove();
    }
}

// Cargar cliente para edición
async function cargarCliente(id) {
    const clientes = await obtenerClientes();
    const cliente = clientes.find((cliente) => cliente.id === Number(id));

    if (cliente) {
        document.querySelector("#nombre").value = cliente.nombre;
        document.querySelector("#email").value = cliente.email;
        document.querySelector("#telefono").value = cliente.telefono;
        document.querySelector("#empresa").value = cliente.empresa;
        document.querySelector("#id").value = id;
    }
}

// Validación y redirección al guardar un nuevo cliente
async function validarClienteNuevo(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    await agregarCliente({ nombre, email, telefono, empresa });
    alert("Cliente agregado correctamente");
    window.location.href = "index.html";
}

// Validación y redirección al guardar un cliente editado
async function validarClienteEdicion(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;
    const id = Number(document.querySelector("#id").value);

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    await actualizarCliente({ nombre, email, telefono, empresa, id });
    alert("Cliente actualizado correctamente");
    window.location.href = "index.html";
}

// Inicialización de la aplicación al cargar el DOM
document.addEventListener("DOMContentLoaded", async () => {
    await conectarDB();

    const listadoClientes = document.querySelector("#listado-clientes");
    const formulario = document.querySelector("#formulario");

    if (listadoClientes) {
        cargarClientes();
    }

    if (formulario) {
        if (formulario.dataset.tipo === "nuevo") {
            formulario.addEventListener("submit", validarClienteNuevo);
        } else if (formulario.dataset.tipo === "editar") {
            const parametrosURL = new URLSearchParams(window.location.search);
            const idCliente = parametrosURL.get("id");
            cargarCliente(idCliente);
            formulario.addEventListener("submit", validarClienteEdicion);
        }
    }
});
