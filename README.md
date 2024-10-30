# Guía Rápida de IndexedDB

Este repositorio contiene una guía de referencia rápida para aprender a utilizar **IndexedDB**, una API que permite almacenar grandes volúmenes de datos de forma eficiente en el navegador. La idea es documentar y simplificar los conceptos fundamentales de IndexedDB, creando una cheatsheet que puedas usar en proyectos futuros.

## Contenidos

1. [¿Qué es IndexedDB?](#qué-es-indexeddb)
2. [Objetivos del Proyecto](#objetivos-del-proyecto)
3. [Requisitos Previos](#requisitos-previos)
4. [Estructura de la Cheatsheet](#estructura-de-la-cheatsheet)
5. [Conceptos Básicos y Ejemplos](#conceptos-básicos-y-ejemplos)
---

## ¿Qué es IndexedDB?

IndexedDB es una base de datos NoSQL integrada en el navegador, pensada para almacenar grandes cantidades de datos de manera persistente y estructurada. A diferencia de `localStorage`, IndexedDB permite realizar consultas avanzadas y es perfecta para aplicaciones que requieren datos estructurados y consultas más complejas.

### Características Clave

- **Persistencia de datos**: La información se conserva incluso al cerrar el navegador.
- **Asincronía**: Las operaciones son asincrónicas, evitando que el navegador se bloquee.
- **Soporte para transacciones**: Asegura que las operaciones de datos sean consistentes y seguras.

## Objetivos del Proyecto

1. **Investigar** la API IndexedDB para comprender cómo funciona.
2. **Crear una Cheatsheet** para documentar y organizar los conocimientos obtenidos.
3. **Desarrollar una estructura de referencia** que facilite su uso en futuros desarrollos.

## Requisitos Previos

Es recomendable tener conocimientos básicos de:

- **JavaScript**: Manejo de promesas y callbacks.
- **APIs de almacenamiento**: Familiaridad con `localStorage` o `sessionStorage` ayuda a entender IndexedDB rápidamente.

## Estructura de la Cheatsheet

La cheatsheet está organizada en secciones que abarcan desde la configuración inicial hasta la realización de consultas avanzadas. Las secciones incluyen:

1. **Inicialización de la Base de Datos**: Creación y configuración de bases de datos y objetos de almacenamiento.
2. **Operaciones CRUD**: Cómo añadir, leer, actualizar y eliminar datos.
3. **Transacciones**: Uso de transacciones para realizar varias operaciones de manera segura.
4. **Consultas con Índices**: Filtrado avanzado mediante índices para búsquedas específicas.

## Conceptos Básicos y Ejemplos

### Inicialización de la Base de Datos

La configuración de IndexedDB implica abrir o crear una base de datos y definir los objetos de almacenamiento en el evento `onupgradeneeded`.

**Ejemplo de Inicialización:**
```javascript
const dbRequest = indexedDB.open('miDB', 1);

dbRequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('productos', { keyPath: 'id', autoIncrement: true });
};
dbRequest.onsuccess = () => {
  console.log('Base de datos lista para usarse');
};
