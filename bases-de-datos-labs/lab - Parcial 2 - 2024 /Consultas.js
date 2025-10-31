/*
Ejercicio 1
--------- -
Buscar los documentos donde el alumno tiene:
(i) un puntaje mayor o igual a 80 en "exam" o bien un puntaje mayor o igual a 90 en
"quiz" y
(ii) un puntaje mayor o igual a 60 en todos los "homework" 
(en otras palabras no tiene un puntaje menor a 60 en algún "homework")
Las dos condiciones se tienen que cumplir juntas (es un AND)
Se debe mostrar todos los campos excepto el _id, ordenados por el id de la clase y
id del alumno en orden descendente y ascendente respectivamente.
*/

//(i)
db.grades.aggregate([
  {
    $match: {
      scores: {
        $all: [
          { $elemMatch: { type: "exam", score: { $gte: 80 } } },
          { $elemMatch: { type: "quiz", score: { $gte: 90 } } },
          { $elemMatch: { type: "homework", score: { $gte: 60 } } },
        ],
        $not: {
          $elemMatch: {
            type: "homework",
            score: { $lt: 60 },
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
    },
  },
  {
    $sort: { class_id: -1, student_id: 1 },
  },
]);
