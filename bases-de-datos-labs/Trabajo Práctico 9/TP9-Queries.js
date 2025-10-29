//Parte 1
/*Agregar las siguientes reglas de validación usando JSON Schema. Luego de cada especificación testear que efectivamente las reglas de validación funcionen, intentando insertar 5 documentos válidos y 5 inválidos (por distintos motivos). */

/*
Ejercicio 1
Especificar en la colección users las siguientes reglas de validación: El campo name (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" , password (requerido) debe ser un string con al menos 50 caracteres.
*/

db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 30,
          description: "Longitud máxima de nombre es de 30 caracteres.",
        },
        email: {
          bsonType: "string",
          pattern: "^(.*)@(.*)\\.(.{2,4})$",
          description: "Ingrese una dirección de correo válida.",
        },
        password: {
          bsonType: "string",
          minLength: 50,
          description: "Tu contraseña debe tener al menos 50 caracteres",
        },
      },
    },
  },
});

/*
Caso OK
*/
db.users.insertOne({
  name: "santi",
  email: "alvaro.mediina2003@gmail.com",
  password: "123456789101112131415161718192021222324252627282930",
});
/*{
  acknowledged: true,
  insertedId: ObjectId('68ff61dc74f3fcf0bbce5f47')
}
*/

/*
Caso NO TODO
*/
db.users.insertOne({
  name: "",
  email: "",
  password: "",
});
// MongoServerError: Document failed validation

//Caso NO Password
db.users.insertOne({
  name: "",
  email: "alvaro.mediina200333@gmail.com",
  password: "1234",
});

/*Caso NO NAME*/
db.users.insertOne({
  name: "pepitoxdxdxd1234567891011121314151617181920",
  email: "alvaro.mediina200333@gmail.com",
  password: "1234",
});
// MongoServerError: Document failed validation

/*
Ejercicio 2
Obtener metadata de la colección users que garantice que las reglas de validación fueron correctamente aplicadas
*/
db.getCollectionInfos({ name: "users" });

/*
[
  {
    name: 'users',
    type: 'collection',
    options: {
      validator: {
        '$jsonSchema': {
          bsonType: 'object',
          required: [ 'name', 'email', 'password' ],
          properties: {
            name: {
              bsonType: 'string',
              minLength: 1,
              maxLength: 30,
              description: 'Longitud máxima de nombre es de 30 caracteres.'
            },
            email: {
              bsonType: 'string',
              pattern: '^(.*)@(.*)\\.(.{2,4})$',
              description: 'Ingrese una dirección de correo válida.'
            },
            password: {
              bsonType: 'string',
              minLength: 50,
              description: 'Tu contraseña debe tener al menos 50 caracteres'
            }
          }
        }
      },
      validationLevel: 'strict',
      validationAction: 'error'
    },
    info: {
      readOnly: false,
      uuid: UUID('594c5c32-2663-43c0-9a80-5a84e0c0e946')
    },
    idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
  }
]
*/

/*
Ejercicio 3
Especificar en la colección theaters las siguientes reglas de validación: El campo theaterId (requerido) debe ser un int y location (requerido) debe ser un object con:
a) Un campo address (requerido) que sea un object con campos street1, city, state y zipcode todos de tipo string y requeridos
b) un campo geo (no requerido) que sea un object con un campo type, con valores posibles “Point” o null y coordinates que debe ser una lista de 2 doubles.
Por último, estas reglas de validación no deben prohibir la inserción o actualización de documentos que no las cumplan sino que solamente deben advertir.
*/
db.runCommand({
  collMod: "theaters",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["theaterId", "location"],
      properties: {
        theaterId: {
          bsonType: "int",
          description: "El campo theaterId debe ser un entero.",
        },
        location: {
          bsonType: "object",
          required: ["address"],
          properties: {
            address: {
              required: ["street1", "city", "state", "zipcode"],
              properties: {
                street1: {
                  bsonType: "string",
                  description: "El campo street1 es obligatorio",
                },
                city: {
                  bsonType: "string",
                  description: "El campo city es obligatorio",
                },
                state: {
                  bsonType: "string",
                  description: "El campo state es obligatorio.",
                },
                zipcode: {
                  bsonType: "string",
                  description: "El campo zipcode es obligatorio.",
                },
              },
            },
            geo: {
              bsonType: "object",
              properties: {
                type: {
                  enum: ["Point", null],
                },
                coordinates: {
                  bsonType: "array",
                  items: [{ bsonType: "double" }, { bsonType: "double" }],
                  minItems: 2,
                  maxItems: 2,
                  description:
                    "Debe ser un array de dos coordenadas [longitud, latitud].",
                },
              },
            },
          },
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "warn",
});

//Todo ok
db.theaters.insertOne({
  theaterId: 2048,
  location: {
    address: {
      street1: "Av. Corrientes 1234",
      city: "Buenos Aires",
      state: "BA",
      zipcode: "C1043AB",
    },
    geo: {
      type: "Point",
      coordinates: [-58.3816, -34.6037],
    },
  },
});

//Falta theater_Id
db.theaters.insertOne({
  location: {
    address: {
      street1: "Av. Siempre Viva 742",
      city: "Springfield",
      state: "SP",
      zipcode: "12345",
    },
  },
});

// Address incompleto
db.theaters.insertOne({
  theaterId: 3,
  location: {
    address: {
      street1: "Calle Falsa 123",
      city: "Springfield",
    },
  },
});

// No está permitido "Line"
db.theaters.insertOne({
  theaterId: 4,
  location: {
    address: {
      street1: "Av. Corrientes 1234",
      city: "Buenos Aires",
      state: "BA",
      zipcode: "C1043AB",
    },
    geo: {
      type: "Line", // debe ser "Point" o null
      coordinates: [-58.3816, -34.6037],
    },
  },
});

// Falta la segunda coordenada:
db.theaters.insertOne({
  theaterId: 5,
  location: {
    address: {
      street1: "Av. Corrientes 1234",
      city: "Buenos Aires",
      state: "BA",
      zipcode: "C1043AB",
    },
    geo: {
      type: "Point",
      coordinates: [-58.3816], // falta la segunda coordenada
    },
  },
});

/*
Ejercicio 4
Especificar en la colección movies las siguientes reglas de validación: El campo title (requerido) es de tipo string, year (requerido) int con mínimo en 1900 y máximo en 3000, y que tanto cast, directors, countries, como genres sean arrays de strings sin duplicados.
Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora de insertar documentos. Recordar que mongo shell es un intérprete javascript y en javascript los literales numéricos son de tipo Number (double).
*/
db.runCommand({
  collMod: "movies",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "year"],
      properties: {
        title: { bsonType: "string" },
        year: {
          bsonType: "int",
          minimum: 1900,
          maximum: 3000,
        },
        cast: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
        },
        directors: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
        },
        countries: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
        },
        genres: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
        },
      },
    },
  },
});

// 1️⃣ Insertar documento válido (debería pasar)
db.movies.insertOne({
  title: "The Matrix",
  year: NumberInt(1999),
  cast: ["Keanu Reeves", "Laurence Fishburne"],
  directors: ["Lana Wachowski", "Lilly Wachowski"],
  countries: ["USA"],
  genres: ["Action", "Sci-Fi"],
});

// 2️⃣ Faltar campo obligatorio 'title' (debería fallar)
db.movies.insertOne({
  year: NumberInt(1999),
  cast: ["Keanu Reeves"],
  directors: ["Lana Wachowski"],
  countries: ["USA"],
  genres: ["Action"],
});

// 3️⃣ 'year' fuera de rango (debería fallar)
db.movies.insertOne({
  title: "Future Movie",
  year: NumberInt(3050), // fuera de rango
  cast: ["Actor 1"],
  directors: ["Director 1"],
  countries: ["USA"],
  genres: ["Sci-Fi"],
});

// 4️⃣ Array con duplicados en 'cast' (debería fallar)
db.movies.insertOne({
  title: "Duplicate Cast",
  year: NumberInt(2000),
  cast: ["Actor 1", "Actor 1"], // duplicado
  directors: ["Director 1"],
  countries: ["USA"],
  genres: ["Drama"],
});

// 5️⃣ Array vacío o no definido (debería pasar, no hay required para arrays)
db.movies.insertOne({
  title: "Empty Arrays",
  year: NumberInt(2010),
  cast: [],
  directors: [],
  countries: [],
  genres: [],
});

/*
Ejercicio 5
Crear una colección userProfiles con las siguientes reglas de validación: Tenga un campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con alguno de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo favorite_genres (no requerido) que sea un array de strings sin duplicados.
*/
db.createCollection("userProfiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "language"],
      properties: {
        user_id: { bsonType: "objectId" },
        language: { enum: ["English", "Spanish", "Portuguese"] },
        favorite_genres: {
          bsonType: "array",
          items: {
            bsonType: "string",
          },
          uniqueItems: true,
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// 1️⃣ Algunos perfiles de ejemplo adicionales (válidos)
db.userProfiles.insertMany([
  {
    user_id: ObjectId(),
    language: "English",
    favorite_genres: ["Action", "Drama"],
  },
  {
    user_id: ObjectId(),
    language: "Spanish",
    favorite_genres: ["Romance", "Comedy"],
  },
  {
    user_id: ObjectId(),
    language: "English",
    favorite_genres: ["Horror", "Thriller"],
  },
  {
    user_id: ObjectId(),
    language: "Portuguese",
    favorite_genres: ["Adventure", "Fantasy"],
  },
]);

// 2️⃣ Documento válido sin favorite_genres (opcional)
db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "Spanish",
});

// 3️⃣ Falta user_id (debe fallar)
db.userProfiles.insertOne({
  language: "English",
  favorite_genres: ["Comedy"],
});

// 4️⃣ Lenguaje no permitido (debe fallar)
db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "German",
  favorite_genres: ["Action"],
});

// 5️⃣ Duplicados en favorite_genres (debe fallar)
db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "Portuguese",
  favorite_genres: ["Action", "Action"],
});

//Parte 2: Modelado de datos

/*Ejercicio 6
Identificar los distintos tipos de relaciones (One-To-One, One-To-Many) en las colecciones movies y comments. Determinar si se usó documentos anidados o referencias en cada relación y justificar la razón.
*/

/* 
- Claramente la relación entre movies y comments es de One-To-Many dado que comments tiene
`movie_id` entonces para cada película hay muchos comentarios. Aquí se utiliza la técnica de referencia.
- Por otro lado en cuanto a movies:
  - Tenemos la característica imdb el cual utiliza una estrategia de Anidado para mencionar el rating, los votos y el id del imdb. RELACIÓN One-To-One.
  - También no tenemos una colección propia de géneros, utiliza la estrategia Anidado para denotar los distintos géneros que represente la película. Pasa lo mismo con las listas que denotan, directors, countries, etc. RELACIÓN One-To-Many
  - Al igual que antes pasa lo mismo con directors, countries.
- En cuento a comments no se puede decir mucho más dado que sólo hay información propia de un comentario.
- Lo que sí se puede agregar es que hay una relacion One-To-Many entre comments y users dado que comments almacena el email como clave para referenciar a un usuario, que puede tener muchos comentarios a diversas películas. Aquí la estrategia es Referencia.
*/

/*Ejercicio 7
Dado el diagrama de la base de datos shop junto con las queries más importantes. 

Queries
-------
* Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular 
* Cantidad de libros por categorías
* Listar el nombre y dirección entrega y el monto total (quantity * price) de sus pedidos para un order_id dado.
Debe crear el modelo de datos en mongodb aplicando las estrategias “Modelo de datos anidados” y Referencias. El modelo de datos debe permitir responder las queries de manera eficiente.
*/

/*
Primero que nada tenemos en el esquema las siguientes colecciones:
 * orders
 * order_detail
 * books
 * categories

Las relaciones son las siguientes:
  * books [M..1] -> categories 
  * books [1..M] -> order_details
  * order [1..M] -> order_id
*/

/*
books -> categories
Ahora lo que podemos hacer es como categories tiene sólo el nombre, es decir en una categoría
pueden haber muchos libros, podríamos meter a categoría dentro de libros utilizando la estrategia
Anidado para así evitar hacer lookup.
*/

/*
En cuanto a order_details
* Tenemos que sería una colección para representar muchos a muchos entre órdenes y libros.
*/

/*
Respondo primero a las queries:
* Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular 
-> Si cada libro tiene su propio precio y su categoría listo.

* Cantidad de libros por categorías.
-> Si tengo a categoría anidado a libro, hago un unwind y soy yo.

* Listar el nombre y dirección entrega y el monto total (quantity * price) de sus pedidos para un order_id dado.
-> Acá necesariamente tengo que tener una órden existente para la compra.
-> Puedo en una órden referenciar:
  * al libro que quiero comprar
  * a la cantidad
  * y luego quedarme con los atributos de órden que sería lo que pide la query.
  * En vez de hacer 2 lookups haría 1.  
*/

db.createCollection("books");
db.createCollection("orders");

// NO HACERLO DE ESTA FORMA
db.books.aggregate([
  {
    $addFields: {
      book_id,
      title,
      author,
      price,
      category_name,
      price,
    },
  },
]);

db.books.insertMany([
  {
    book_id: 1,
    title: "Learning MySQL",
    author: "Jesper Wisborg Krogh",
    price: 34.31,
    category_name: "Web Development",
  },
  {
    book_id: 2,
    title: "JavaScript Next",
    author: "Raju Gandhi",
    price: 36.7,
    category_name: "Web Development",
  },
  {
    book_id: 3,
    title: "The Complete Robot",
    author: "Isaac Asimov",
    price: 12.13,
    category_name: "Science Fiction",
  },
  {
    book_id: 4,
    title: "Foundation and Earth",
    author: "Isaac Asimov",
    price: 11.07,
    category_name: "Science Fiction",
  },
  {
    book_id: 5,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    price: 7.99,
    category_name: "Historical Mysteries",
  },
  {
    book_id: 6,
    title: "A Column of Fire",
    author: "Ken Follett",
    price: 6.99,
    category_name: "Historical Mysteries",
  },
]);

db.orders.insertMany([
  {
    order_id: 1,
    delivery_name: "Alice Johnson",
    delivery_address: "123 Maple St, New York, USA",
    cc_name: "Alice Johnson",
    cc_number: "4111111111111111",
    cc_expiry: "2026-07",
    quantity: 2,
    book_id: 1, // Learning MySQL
  },
  {
    order_id: 2,
    delivery_name: "Brian Lee",
    delivery_address: "456 Oak Ave, Los Angeles, USA",
    cc_name: "Brian Lee",
    cc_number: "5500000000000004",
    cc_expiry: "2027-03",
    quantity: 1,
    book_id: 2, // JavaScript Next
  },
  {
    order_id: 3,
    delivery_name: "Clara Martínez",
    delivery_address: "789 Pine Rd, Madrid, Spain",
    cc_name: "Clara Martínez",
    cc_number: "340000000000009",
    cc_expiry: "2025-12",
    quantity: 3,
    book_id: 3, // The Complete Robot
  },
  {
    order_id: 4,
    delivery_name: "Daniel Kim",
    delivery_address: "321 Birch Blvd, Seoul, South Korea",
    cc_name: "Daniel Kim",
    cc_number: "30000000000004",
    cc_expiry: "2026-09",
    quantity: 1,
    book_id: 5, // The Da Vinci Code
  },
  {
    order_id: 5,
    delivery_name: "Emma Rossi",
    delivery_address: "654 Cherry Ln, Rome, Italy",
    cc_name: "Emma Rossi",
    cc_number: "6011000000000004",
    cc_expiry: "2028-01",
    quantity: 2,
    book_id: 6, // A Column of Fire
  },
]);

/*
 * Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular
 * Cantidad de libros por categorías
 * Listar el nombre y dirección entrega y el monto total (quantity * price) de sus pedidos para un order_id dado.
 */

db.books.find(
  { author: "Isaac Asimov" },
  { book_id: 1, price: 1, title: 1, category_name: 1, author: 1 }
);

db.books.aggregate({
  $group: {
    _id: "$category_name",
    books_amount: { $sum: 1 },
  },
});

db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "b",
    },
  },
  {
    $match: { order_id: { $eq: 1 } }, //Filtro por order_id_1
  },
  {
    $project: {
      _id: 0,
      order_id: 1,
      name: "$cc_name",
      delivery_address: 1,
      quantity: 1,
      total_amount: {
        $multiply: ["$quantity", { $arrayElemAt: ["$b.price", 0] }],
      },
    },
  },
]);

/*Ejercicio 8
Dado el siguiente diagrama que representa los datos de un blog de artículos.

*/
