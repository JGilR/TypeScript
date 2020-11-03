# TypeScript

## Practica 1 TS
Realizar en Typescript tres funciones:
* deepPrint
* deepClone
* deepEqual

La función *deepPrint* debe recibir un objeto cualquiera como parámetro y mostrarlo por pantalla.

La función *deepClone* debe hacer una copia por valor de todos los valores de un objeto (de cualquier profundidad e incluyendo arrays). Recibe como parámetro un objeto y devuelve otro.

La función *deepEqual* debe recibir dos objetos y debe comprobar si son idénticos todos sus valores (true) o no (false).

La práctica debe incluir varios ejemplos que demuestren el funcionamiento.

## Practica 2
Se pide realizar una API REST utilizando `Deno` y el servidor `oak`. La práctica debe trabajar con una base de datos Mongo alojada en Mongo Atlas.

## Endpoints

### GET /status
Indica que el servidor esta OK y listo para recibir peticiones.
`Status`: 200
`Body`: "OK"


## GET /characters
Devuelve un objeto con todos los personajes de la serie
`Status`: 200
`Body`: Array de personajes, cada personaje con el formato del siguiente ejemplo.
```json
{
    id: 1,
    name: "Nombre der personaje",
    staus: "Alive",
    species: "Human",
    type: "Generic Experiment",
    gender: "Female",
    origin: "Nombre del origen",
    location: "Nombre de la ubicacion",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    episode: [
        "nombre episodio 1",
        "nombre episodio 3",
        "nombre episodio 5",
    ]
}
``` 

## GET /character/:id
Devuelve un objeto con los datos del personaje con id
`Status`: 200
`Body`: objecto con el personaje con el formato del siguiente ejemplo.
```json
{
    id: 1,
    name: "Nombre der personaje",
    staus: "Alive",
    species: "Human",
    type: "Generic Experiment",
    gender: "Female",
    origin: "Nombre del origen",
    location: "Nombre de la ubicacion",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    episode: [
        "nombre episodio 1",
        "nombre episodio 3",
        "nombre episodio 5",
    ]
}
``` 

## PUT /switchstatus/:id
Cambia el status de un personaje: de vivo a muerto o de muerto a vivo.
Devuelve un objeto con los datos del personaje con id (con el status actualizado)

Si lo realiza correctamente (el personaje existe)

`Status`: 200
`Body`: objecto con el personaje con el formato del siguiente ejemplo.
```json
{
    id: 1,
    name: "Nombre der personaje",
    status: "Alive",
    species: "Human",
    type: "Generic Experiment",
    gender: "Female",
    origin: "Nombre del origen",
    location: "Nombre de la ubicacion",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    episode: [
        "nombre episodio 1",
        "nombre episodio 3",
        "nombre episodio 5",
    ]
}
``` 

Si el personaje no existe

```
Status: 404
Body: "Not Found"
```

## DELETE /character/:id
Borra un personaje con id

Si lo realiza correctamente (el personaje existe).
`Status`: 200
`Body`: "OK"

Si el personaje no existe
`Status`: 404
`Body`: "Not Found"


# Practica IIb

Se pide realizar una API REST utilizando `Deno` y el servidor `oak`. La práctica debe trabajar con una base de datos Mongo alojada en Mongo Atlas.

Se desea implementar una API para una famosa empresa de coches con conductor. La API debe permitir:
 * Configurar la flota de coches: decir cuántos coches hay y cuántas plazas tiene cada uno.
 * Solicitar un coche.
 * Liberar un coche.

Los coches pueden ser de tres tipos:
* 4 plazas
* 5 plazas
* 6 plazas.

Los clientes solicitarán un coche indicando cuántos son (pueden ser entre 1 y 6). Si hay algún coche libre en el que quepan se las asigna el coche y el coche se marca como ocupado.

## API

### GET /status

Indica que la API etá lista.

#### Responses:
* **200 OK** When the service is ready to receive requests.
* **500 Server Error** Si hay un error inesperado (no controlado) de cualquier tipo

### PUT /cars

Carga en la DDBB los coches que hay en la flota. Cuando se realiza esta acción la base de datos se resetea. Es decir, todos coches existentes se eliminan (ya estén libres u ocupados) y la flota se configura desde 0.

#### Request:
**Body** El listado de coches.
**Content Type** `application/json`

Ejemplo:

```json
[
  {
    "id": 1,
    "seats": 4
  },
  {
    "id": 2,
    "seats": 6
  }
]
```

#### Responses:

* **200 OK** Cuando todo es OK.
* **400 Bad Request** Cuando hay un error en la petición (por ejemplo, un coche con un número de plazas incorecto).
* **500 Server Error** Si hay un error inesperado (no controlado) de cualquier tipo

### POST /journey

Un cliente solicita un coche

#### Request
**Body** La información sobre el viaje solicitado.
**Content Type** `application/json`

Ejemplo:

```json
{
  "id": 1,
  "people": 4
}
```

### Responses:
* **200 OK** or **202 Accepted** El viaje se registra correctamente (el coche se marca como ocupado)
* **400 Bad Request** Cuando la solicitud es incorrecta.
* **404 Not Found** No hay coches disponibles que cumplan el criterio
* **500 Server Error** Si hay un error inesperado (no controlado) de cualquier tipo

### POST /dropoff/:ID

Un grupo de gente finaliza el viaje.

#### Responses:

* **200 OK** or **204 No Content** El viaje se finaliza correctamente
* **404 Not Found** El grupo no está marcado viajando.
* **500 Server Error** Si hay un error inesperado (no controlado) de cualquier tipo

### POST /locate/:ID

Devuelve los datos del coche en el que un grupo con ID está viajando.

#### Responses:

* **200 OK** Incluyendo en en el cuerpo de la respuesta el ID del coche.
* **404 Not Found** Dicho grupo no está registrado en un viaje.
* **500 Server Error** Si hay un error inesperado (no controlado) de cualquier tipo

