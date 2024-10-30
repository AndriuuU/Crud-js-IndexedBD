// nuevocliente.js
import { conectarDB, agregarCliente } from "./API.js";

document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    document.querySelector("#formulario").addEventListener("submit", validarCliente);
});

function validarCliente(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    const cliente = { nombre, email, telefono, empresa };
    agregarCliente(cliente);
    alert("Cliente agregado correctamente");
    window.location.href = "index.html";
}
