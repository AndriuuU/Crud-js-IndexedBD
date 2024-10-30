// editarcliente.js
import { conectarDB, actualizarCliente, obtenerClientes } from "./API.js";

document.addEventListener("DOMContentLoaded", async () => {
    await conectarDB();

    const parametrosURL = new URLSearchParams(window.location.search);
    const idCliente = parametrosURL.get("id");

    cargarCliente(idCliente);

    document.querySelector("#formulario").addEventListener("submit", validarCliente);
});

async function cargarCliente(id) {
    const clientes = await obtenerClientes();
    const cliente = clientes.find((cliente) => cliente.id === Number(id));

    if (cliente) {
        const { nombre, email, telefono, empresa } = cliente;
        document.querySelector("#nombre").value = nombre;
        document.querySelector("#email").value = email;
        document.querySelector("#telefono").value = telefono;
        document.querySelector("#empresa").value = empresa;
        document.querySelector("#id").value = id;
    }
}

function validarCliente(e) {
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

    const clienteActualizado = { nombre, email, telefono, empresa, id };
    actualizarCliente(clienteActualizado);

    alert("Cliente actualizado correctamente");
    window.location.href = "index.html";
}
