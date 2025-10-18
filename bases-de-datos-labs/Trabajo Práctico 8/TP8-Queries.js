/*
Ejercicio 1
--------- -
Cantidad de cines (theaters) por estado.
*/
db.theaters.aggregate([
  {
    $group: {
      _id: "$location.address.state",
      count: { $sum: 1 },
    },
  },
  {
    $sort: { _id: 1 },
  },
]);

/*
Ejercicio 2
--------- -
Cantidad de estados con al menos dos cines (theaters) registrados.
*/
db.theaters.aggregate([
  {
    $group: {
      _id: "$location.address.state",
      count: { $sum: 1 },
    },
  },
  {
    $match: {
      count: { $gte: 2 },
    },
  },
  {
    $sort: { _id: 1 },
  },
]);

/*
Ejercicio 3
--------- -
Cantidad de películas dirigidas por "Louis Lumière".
Se puede responder sin pipeline de agregación, realizar ambas queries.
*/

//Sin pipeline de agregación
db.movies.find({ directors: { $eq: "Louis Lumière" } }).count();

//Con pipeline de agregación
db.movies.aggregate([
  {
    $match: { directors: { $in: ["Louis Lumière"] } },
  },
  {
    $count: "Cantidad de películas dirigidas:",
  },
]);

/*
Ejercicio 4
--------- -
Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959).
 Se puede responder sin pipeline de agregación, realizar ambas queries.
*/

//Sin agregación
let movies_count = db.movies
  .find({
    released: {
      $gte: ISODate("1950-01-01T00:00:00Z"),
      $lte: ISODate("1959-12-31T23:59:59Z"),
    },
  })
  .count();
print("En los años 50 se estrenaron: " + movies_count + " películas");

//Con agregación
db.movies.aggregate([
  {
    $match: {
      released: {
        $gte: ISODate("1950-01-01T00:00:00Z"),
        $lte: ISODate("1959-12-31T23:59:59Z"),
      },
    },
  },
  {
    $count: "Películas estrenadas en los 50: ",
  },
]);

/*
Ejercicio 5
--------- -
Listar los 10 géneros con mayor cantidad de películas (tener en cuenta que las películas pueden tener más de un género).
Devolver el género y la cantidad de películas.
Hint: unwind puede ser de utilidad
*/
db.movies.aggregate([
  {
    $unwind: "$genres",
  },
  {
    $group: {
      _id: "$genres",
      movies_count: { $sum: 1 },
    },
  },
  {
    $sort: { movies_count: -1 },
  },
  {
    $limit: 10,
  },
]);

/*
Ejercicio 6
--------- -
Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y Cantidad de Comentarios.
*/
db.users.aggregate([
  {
    $lookup: {
      from: "comments",
      localField: "email",
      foreignField: "email",
      as: "cmts",
    },
  },
  {
    $project: {
      _id: 0,
      name: "$name",
      email: "$email",
      comments_count: { $size: "$cmts" },
    },
  },
  {
    $sort: { comments_count: -1 },
  },
  {
    $limit: 10,
  },
]);

/*
Ejercicio 7
--------- -
Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en los años 80 (desde 1980 hasta 1989).
Ordenados de mayor a menor por promedio del año.
*/
db.movies.aggregate([
  {
    $match: {
      released: {
        $gte: ISODate("1980-01-01T00:00:00Z"),
        $lte: ISODate("1989-12-31T23:59:59Z"),
      },
    },
  },
  {
    $group: {
      _id: { $year: "$released" },
      imdb_avg: { $avg: "$imdb.rating" },
      imdb_min: { $min: "$imdb.rating" },
      imdb_max: { $max: "$imdb.rating" },
    },
  },
  {
    $project: {
      _id: 0,
      year: "$_id",
      imdb_avg: "$imdb_avg",
      imdb_min: "$imdb_min",
      imdb_max: "$imdb_max",
    },
  },
  {
    $sort: { imdb_avg: -1 },
  },
]);

/*
Ejercicio 8
--------- -
Título, año y cantidad de comentarios de las 10 películas con más comentarios.
*/
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "id",
      as: "movies",
    },
  },
  {
    $group: {
      _id: "$movie_id",
      comments_count: { $sum: 1 },
    },
  },
  {
    $project: {
      title: "$movies.0.title",
      year: "$movies.0.released",
      comments_count: 1,
    },
  },
  {
    $sort: { comments_count: -1 },
  },
  {
    $limit: 10,
  },
]);

/*
Ejercicio 9
--------- -
Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con la cantidad de comentarios.
*/

db.createView("top5_genres_by_comments", "comments", [
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "id",
      as: "movie",
    },
  },
  {
    $unwind: "$movie",
  },
  {
    $unwind: "$movie.genres",
  },
  {
    $group: {
      _id: "$movie.genres",
      comments_count: { $sum: 1 },
    },
  },
  { $sort: { comments_count: -1 } },
  { $limit: 5 },
]);

/*
Ejercicio 10
--------- --
Listar los actores (cast) que trabajaron en 2 o más películas dirigidas por "Jules Bass".
Devolver el nombre de estos actores junto con la lista de películas (solo título y año) dirigidas por “Jules Bass” en las que trabajaron.
Hint1: addToSet
Hint2: {'name.2': {$exists: true}} permite filtrar arrays con al menos 2 elementos, entender por qué.
Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta.
*/

/*
Ejercicio 11
--------- --
Listar los usuarios que realizaron comentarios durante el mismo mes de lanzamiento de la película comentada,
mostrando Nombre, Email, fecha del comentario, título de la película, fecha de lanzamiento.
HINT: usar $lookup con múltiples condiciones.
*/

/*
Ejercicio 12
--------- --
Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y la suma total.
Se puede asumir que el restaurant_id es único.
    a) Resolver con $group y accumulators.
    b) Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
    c) Resolver como en el punto b) pero usar $reduce para calcular la puntuación total.
    d) Resolver con find.
*/

/*
Ejercicio 13
--------- --
Actualizar los datos de los restaurantes añadiendo dos campos nuevos:
"average_score": con la puntuación promedio
"grade": con "A" si "average_score" está entre 0 y 13,
          con "B" si "average_score" está entre 14 y 27,
          con "C" si "average_score" es mayor o igual a 28.
Se debe actualizar con una sola query.
HINT1: Se puede usar pipeline de agregación con la operación update.
HINT2: El operador $switch o $cond pueden ser de ayuda.
*/
