# TypeScript

# Practica I
Realizar en Typescript tres funciones:
* deepPrint
* deepClone
* deepEqual

La función *deepPrint* debe recibir un objeto cualquiera como parámetro y mostrarlo por pantalla.

La función *deepClone* debe hacer una copia por valor de todos los valores de un objeto (de cualquier profundidad e incluyendo arrays). Recibe como parámetro un objeto y devuelve otro.

La función *deepEqual* debe recibir dos objetos y debe comprobar si son idénticos todos sus valores (true) o no (false).

La práctica debe incluir varios ejemplos que demuestren el funcionamiento.

# Practica II
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


# Practica 3
Se desea desarrollar una API para gestionar una agenda de tareas (calendario)

La agenda almacenará Tasks, con los siguientes datos:
* ID
* Nombre
* Descripción
* Fecha en la que debe concluirse
* State: TODO / DOING / DONE

Se pide desarrollar una API GraphQL en Deno que tenga las siguientes queries/mutations:
* addTask -> permite añadir una nueva tarea.
* removeTask -> elimina una tarea (por ID).
* updateTask -> actualiza una tarea (por ID).
* completeTask -> marca una tarea como realizada (por ID).
* startTask -> marca una tarea como DOING (por ID).
* getTask -> devuelve una tarea por ID.
* getTasks -> devuelve un array con todas las tareas.
* getTaskByState -> devuelve todas las tareas con un etado determinado.
* getTaskByDate -> devuelve todas las tareas que se deben concluir antes de la fecha pasada por parámetro.

Las tareas se deben almacenar en una base de datos Mongo.

# Practica 4
Partiendo de la Práctica III

Se desea desarrollar una API para gestionar una agenda de tareas (calendario)

La agenda almacenará Tasks, con los siguientes datos:

* ID
* Nombre
* Descripción
* Fecha en la que debe concluirse
* State: TODO / DOING / DONE
* reporter: quien crea la tarea
* assignee: la persona asignada

Los usuarios tendrán los siguientes datos:

* correo electrónico (que actúa como identificador único)
* contraseña

Se pide desarrollar una API GraphQL en Deno que tenga las siguientes queries/mutations:

Para gestionar los usuarios:

* signin: permite a un usuario registrarse, indicando su correo y contraseña, si el usuario ya existe devuelve un error.
* login: permite a un usuario iniciar sesión, si el usuario y la contraseña coinciden, generando un token asociado a dicho usuario con el cual podrá autenticarse.
* logout: permite a un usuario que ya ha iniciado sesión, finalizar la sesión
* deleteAccount: borra la cuenta de usuario (necesita estar loggeado para poder hacerlo)

Para gestionar las tareas (todas ellas requieren que el usuario esté loggado según el sitema de autenticación visto en clase. Si se accede sin autenticar devolverá un error 401):

* addTask -> permite añadir una nueva tarea, el reporter será el usuario loggeado, mientras que el assignee se debe especificar.
* removeTask -> elimina una tarea (por ID). Solo lo puede hacer el reporter (estando loggeado)
* updateTask -> actualiza una tarea (por ID). Solo lo pueden hacer el reporter o el assignee (estando loggeados)
* completeTask -> marca una tarea como realizada (por ID). Solo lo puede hacer el assignee (estando loggeado)
* startTask -> marca una tarea como DOING (por ID). Solo lo puede hacer el assignee (estando loggeado)
* getTask -> devuelve una tarea por ID. Lo puede hacer cualquier usuario loggeado.
* getTasks -> devuelve un array con todas las tareas. Lo puede hacer cualquier usuario loggeado.
* getTaskByState -> devuelve todas las tareas con un etado determinado. Lo puede hacer cualquier usuario loggeado.
* getMyTasks -> develve todas las tareas en las que el usuario loggeado es el reporter o el assignee.
* getMyOpenTasks -> develve todas las tareas que no están completadas en las que el usuario loggeado es el reporter o el assignee.
* getUsers -> devuelve todos los usuarios registrados en la plataforma (en los datos que devuelve graphql sobre del usuario se deben incluir dos arrays: uno con las tareas que tiene asignadas y otro con las tareas de las que es reporter)

Las tareas y los usuarios se deben almacenar en una base de datos Mongo.

## EXECUTE DENO
To execute the server with deno `deno run --allow-all --unstable app.ts`

Listen Port: `http://localhost:4000/graphql`


