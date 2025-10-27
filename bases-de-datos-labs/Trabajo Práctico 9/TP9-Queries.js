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
