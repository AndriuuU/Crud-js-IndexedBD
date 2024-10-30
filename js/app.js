// app.js
import { conectarDB, obtenerClientes, agregarCliente } from "./API.js";

document.addEventListener("DOMContentLoaded", async () => {
    await conectarDB();
    cargarClientes();

    verificarYImportarClientes();
});

//Lo que hacemos aqui es los clientes obtenidos los insertamos en el html con formato y con las opciones oportunas
async function cargarClientes() {
    const clientes = await obtenerClientes();
    const listadoClientes = document.querySelector("#listado-clientes");

    clientes.forEach((cliente) => {
        const { nombre, telefono, empresa, id } = cliente;
        listadoClientes.innerHTML += `
            <tr>
                <td class="px-6 py-4 border-b border-gray-200">${nombre}</td>
                <td class="px-6 py-4 border-b border-gray-200">${telefono}</td>
                <td class="px-6 py-4 border-b border-gray-200">${empresa}</td>
                <td class="px-6 py-4 border-b border-gray-200">
                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-800">Editar</a>
                    <button onclick="eliminarCliente(${id})" class="text-red-600 hover:text-red-800 ml-2">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Aparte de coger los clientes locales del navegador, cogemos los que estan 
async function verificarYImportarClientes() {
    const clientes = await obtenerClientes();

    if (clientes.length === 0) {
        fetch("bd.json")
            .then((response) => response.json())
            .then((data) => {
                data.clientes.forEach((cliente) => agregarCliente(cliente));
                cargarClientes();
            })
            .catch((error) => console.error("Error al cargar bd.json:", error));
    }
}

function eliminarClienteHandler(e) {
    const idCliente = Number(e.target.dataset.cliente);

    const confirmar = confirm("¿Deseas eliminar este cliente?");
    if (confirmar) {
        eliminarCliente(idCliente);
        e.target.parentElement.parentElement.remove();  // Remover del DOM
    }
}
