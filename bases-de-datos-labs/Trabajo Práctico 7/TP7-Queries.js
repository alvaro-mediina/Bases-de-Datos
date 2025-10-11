// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("mflix");

//Pruebita
db.comments.findOne();

/*
1)
Insertar 5 nuevos usuarios en la colección users. Para cada nuevo usuario creado, insertar al menos un
comentario realizado por el usuario en la colección comments.
*/
db.users.insertMany([
  { email: "hola@gmail.com", name: "Alvarito", password: "123456" },
  { email: "holahola@gmail.com", name: "Alvaritoto", password: "123456" },
  { email: "holaholahola@gmail.com", name: "Alvaritototo", password: "123456" },
  { email: "chau@gmail.com", name: "Lauta", password: "123456" },
  { email: "chauchau@gmail.com", name: "Lautata", password: "123456" },
]);

db.comments.insertMany([
  {
    date: new Date(),
    name: "Alvarito",
    email: "hola@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4217"),
    text: "La Cenicienta god",
  },
  {
    date: new Date(),
    name: "Alvaritoto",
    email: "holahola@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4217"),
    text: "La Cenicienta god god",
  },
  {
    date: new Date(),
    name: "Alvaritototo",
    email: "holaholahola@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4217"),
    text: "La Cenicienta god god god",
  },
  {
    date: new Date(),
    name: "Lauta",
    email: "chau@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4217"),
    text: "La Cenicienta mala",
  },
  {
    date: new Date(),
    name: "Lautata",
    email: "chauchau@gmail.com",
    movie_id: ObjectId("573a1390f29313caabcd4217"),
    text: "La Cenicienta mala mala",
  },
]);

// Verifico
db.comments.find({ movie_id: { $eq: ObjectId("573a1390f29313caabcd4217") } });

/*
2)
Listar el título, año, actores (cast), directores y rating de las 10 películas con mayor rating (“imdb.rating”) de la década del 90. ¿Cuál es el valor del rating de la película que tiene mayor rating? (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).
*/

db.movies
  .find(
    {
      "imdb.rating": { $type: 1 },
      year: { $gte: 1990, $lte: 1999 },
    },
    { title: 1, year: 1, cast: 1, "imdb.rating": 1, _id: 0 }
  )
  .sort({ "imdb.rating": -1 })
  .limit(10);

/*
3)
Listar el nombre, email, texto y fecha de los comentarios que la película con id (movie_id) ObjectId("573a1399f29313caabcee886") recibió entre los años 2014 y 2016 inclusive. Listar ordenados por fecha. Escribir una nueva consulta (modificando la anterior) para responder ¿Cuántos comentarios recibió?
*/
db.comments
  .find(
    {
      movie_id: { $eq: ObjectId("573a1399f29313caabcee886") },
      date: {
        $gte: ISODate("2014-01-01T00:00:00Z"),
        $lte: ISODate("2016-12-31T23:59:59Z"),
      },
    },
    { name: 1, email: 1, text: 1, date: 1, movie_id: 1, _id: 0 }
  )
  .sort({ date: 1 });

//¿Cuántos comentarios recibió?
let comments_count = db.comments
  .find(
    {
      movie_id: { $eq: ObjectId("573a1399f29313caabcee886") },
      date: {
        $gte: ISODate("2014-01-01T00:00:00Z"),
        $lte: ISODate("2016-12-31T23:59:59Z"),
      },
    },
    { name: 1, email: 1, text: 1, date: 1, movie_id: 1, _id: 0 }
  )
  .sort({ date: 1 })
  .count();

print("La película recibió", comments_count, "comentarios.");

/*
4)
Listar el nombre, id de la película, texto y fecha de los 3 comentarios más recientes realizados por el usuario con email patricia_good@fakegmail.com. 
*/
db.comments
  .find(
    {
      email: { $eq: "patricia_good@fakegmail.com" },
    },
    { name: 1, movie_id: 1, text: 1, date: 1 }
  )
  .sort({ date: -1 })
  .limit(3);

/*
5)
Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released) y número de votos (“imdb.votes”) de las películas de géneros Drama y Action (la película puede tener otros géneros adicionales), que solo están disponibles en un único idioma y por último tengan un rating (“imdb.rating”) mayor a 9 o bien tengan una duración (runtime) de al menos 180 minutos. Listar ordenados por fecha de lanzamiento y número de votos.
*/
db.movies
  .find(
    {
      languages: { $exists: true, $size: 1 },
      genres: { $all: ["Drama", "Action"] },
      $or: [{ "imdb.rating": { $gt: 9 } }, { runtime: { $gte: 180 } }],
    },
    { title: 1, languages: 1, genres: 1, released: 1, "imdb.votes": 1 }
  )
  .sort({ released: 1, "imdb.votes": 1 });

/*
6
Listar el id del teatro (theaterId), estado (“location.address.state”), ciudad (“location.address.city”), y coordenadas (“location.geo.coordinates”) de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX" y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado y ciudad.
*/
db.theaters
  .find(
    {
      "location.address.state": { $in: ["CA", "NY", "TX"] },
      "location.address.city": { $regex: "^f", $options: "i" },
    },
    {
      theaterId: 1,
      "location.address.state": 1,
      "location.address.city": 1,
      "location.geo.coordinates": 1,
    }
  )
  .sort({
    "location.address.state": 1,
    "location.address.city": 1,
  });

/*
7)
Actualizar los valores de los campos texto (text) y fecha (date) del comentario cuyo id es ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y fecha actual respectivamente.
*/
db.comments.updateOne(
  { _id: { $eq: ObjectId("5b72236520a3277c015b3b73") } },
  {
    $set: {
      text: "mi mejor comentario",
      date: new Date(),
    },
  }
);

//Buscamos la actualización
db.comments.find({ _id: ObjectId("5b72236520a3277c015b3b73") });

/*
8)
Actualizar el valor de la contraseña del usuario cuyo email es joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos veces. ¿Qué operación se realiza en cada caso?  (Hint: usar upserts). 
*/

db.users.updateOne(
  {
    email: { $eq: "joel.macdonel@fakegmail.com" },
  },
  { $set: { password: "some password" } },
  { upsert: true }
);

//Lo busco al pibe
db.users.find({ email: { $eq: "joel.macdonel@fakegmail.com" } });

// En la primer ejecución no existía el usuario, entonces se lo insertó.
// En la segunda ejecución existía, entonces se lo actualizaría.

/*
9)
Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com durante el año 1980.
*/

//Busco los comentarios
db.comments.find({
  email: "victor_patel@fakegmail.com",
  date: {
    $gte: ISODate("1980-01-01T00:00:00Z"),
    $lte: ISODate("1980-12-31T23:59:59Z"),
  },
});

//Borro todo
db.comments.deleteMany({
  email: "victor_patel@fakegmail.com",
  date: {
    $gte: ISODate("1980-01-01T00:00:00Z"),
    $lte: ISODate("1980-12-31T23:59:59Z"),
  },
});

/*
Parte 2
*/

// Ver el esquema
db.restaurants.findOne();

/*
10)
Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes donde al menos una de sus calificaciones haya sido realizada entre 2014 y 2015 inclusive, y que tenga una puntuación (score) mayor a 70 y menor o igual a 90.
*/

db.restaurants.find(
  {
    grades: {
      $elemMatch: {
        date: {
          $gte: ISODate("2014-01-01T00:00:00Z"),
          $lte: ISODate("2015-12-31T23:59:59Z"),
        },
        score: {
          $gt: 70,
          $lte: 90,
        },
      },
    },
  },
  { restaurant_id: 1, grades: 1, _id: 0 }
);

/*
11)
Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608". A continuación se especifican las calificaciones a agregar en una sola consulta.  

{
	"date" : ISODate("2019-10-10T00:00:00Z"),
	"grade" : "A",
	"score" : 18
}

{
	"date" : ISODate("2020-02-25T00:00:00Z"),
	"grade" : "A",
	"score" : 21
}

*/

// Busco para chequear si estaban:
db.restaurants.find({ restaurant_id: { $eq: "50018608" } });

db.restaurants.updateOne(
  {
    restaurant_id: {
      $eq: "50018608",
    },
  },
  {
    $set: {
      grade: [
        {
          date: ISODate("2019-10-10T00:00:00Z"),
          grade: "A",
          score: 18,
        },
        {
          date: ISODate("2020-02-25T00:00:00Z"),
          grade: "A",
          score: 21,
        },
      ],
    },
  }
);
