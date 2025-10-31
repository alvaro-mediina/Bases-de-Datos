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

/*
Ejercicio 2
--------- -
Calcular el puntaje mínimo, promedio, y máximo que obtuvo el alumno en las clases
20, 220, 420. El resultado debe mostrar además el id de la clase y el id del alumno,
ordenados por alumno y clase en orden ascendentes.
*/

db.grades.aggregate([
  {
    $match: {
      class_id: 220,
      student_id: 314,
    },
  },
]);

db.grades.aggregate([
  {
    $match: {
      $or: [{ class_id: 20 }, { class_id: 220 }, { class_id: 420 }],
    },
  },
  {
    $unwind: "$scores",
  },
  {
    $group: {
      _id: {
        student_id: "$student_id",
        class_id: "$class_id",
      },
      min_score: {
        $min: "$scores.score",
      },
      max_score: {
        $max: "$scores.score",
      },
      avg_score: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $project: {
      _id: 0,
      student_id: "$_id.student_id",
      class_id: "$_id.class_id",
      min_score: 1,
      max_score: 1,
      avg_score: 1,
    },
  },
  {
    $sort: {
      student_id: 1,
      class_id: 1,
    },
  },
]);

/*
Ejercicio 3
--------- -
Para cada clase listar el puntaje máximo de las evaluaciones de tipo "exam" y el
puntaje máximo de las evaluaciones de tipo "quiz". Listar en orden ascendente por el
id de la clase. HINT: El operador $filter puede ser de utilidad.
*/
db.grades.aggregate([
  {
    $unwind: "$scores",
  },
  {
    $match: {
      "scores.type": {
        $in: ["quiz", "exam"],
      },
    },
  },
  {
    $group: {
      _id: "$class_id",
      max_quiz_score: {
        $max: {
          $cond: [{ $eq: ["$scores.type", "quiz"] }, "$scores.score", null],
        },
      },
      max_exam_score: {
        $max: {
          $cond: [{ $eq: ["$scores.type", "quiz"] }, "$scores.score", null],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      class_id: "$_id",
      max_quiz_score: { $round: ["$max_quiz_score", 2] },
      max_exam_score: { $round: ["$max_exam_score", 2] },
    },
  },
  {
    $sort: { class_id: 1 },
  },
]);

/*
Ejercicio 4
--------- -
Crear una vista "top10students" que liste los 10 estudiantes con los mejores
promedios.
*/

db.createView("top10students", "grades", [
  {
    $unwind: "$scores",
  },
  {
    $group: {
      _id: "$student_id",
      general_avg: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $project: {
      _id: 0,
      student_id: "$_id",
      general_avg: { $round: ["$general_avg", 2] },
    },
  },
  {
    $sort: { general_avg: -1 },
  },
  { $limit: 10 },
]);

/*
Ejercicio 5
--------- -
Actualizar los documentos de la clase 339, agregando dos nuevos campos: el
campo "score_avg" que almacena el puntaje promedio y el campo "letter" que tiene
el valor "NA" si el puntaje promedio está entre [0, 60), el valor "A" si el puntaje
promedio está entre [60, 80) y el valor "P" si el puntaje promedio está entre [80, 100].
HINTS: (i) para actualizar se puede usar pipeline de agregación. (ii) El operador
$cond o $switch pueden ser de utilidad.
*/

db.grades.updateMany({ class_id: 339 }, [
  {
    $addFields: {
      score_avg: {
        $avg: { $map: { input: "$scores", as: "s", in: "$$s.score" } },
      },
    },
  },
  {
    $addFields: {
      letter: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $gte: ["$score_avg", 0] },
                  { $lt: ["$score_avg", 60] },
                ],
              },
              then: "NA",
            },
            {
              case: {
                $and: [
                  { $gte: ["$score_avg", 60] },
                  { $lt: ["$score_avg", 80] },
                ],
              },
              then: "A",
            },
            {
              case: {
                $and: [
                  { $gte: ["$score_avg", 80] },
                  { $lte: ["$score_avg", 100] },
                ],
              },
              then: "P",
            },
          ],
          default: "NA",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      student_id: 1,
      score_avg: { $round: ["$score_avg", 2] },
      scores: 1,
      letter: 1,
      class_id: 1,
    },
  },
]);

/*
Ejercicio 6
--------- -
(a) Especificar reglas de validación en la colección grades para todos sus campos y
subdocumentos anidados. Inferir los tipos y otras restricciones que considere
adecuados para especificar las reglas a partir de los documentos de la colección.
(b) Testear la regla de validación generando dos casos de fallas en la regla de
validación y un caso de éxito en la regla de validación. Aclarar en la entrega cuales
son los casos y por qué fallan y cuales cumplen la regla de validación. Los casos no
deben ser triviales, es decir los ejemplos deben contener todos los campos..
*/
