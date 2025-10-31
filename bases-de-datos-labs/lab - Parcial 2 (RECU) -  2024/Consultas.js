/*
Ejercicio 1
--------- -
Escribir una consulta para calcular el promedio de puntuaciones de cada clase
(class_id) y compararlo con el promedio general de todas las clases. La consulta
debe devolver un documento para cada clase que incluya el class_id, el promedio de
puntuaciones de esa clase y un campo adicional que indique si el promedio de la
clase está por encima o por debajo del promedio general de todas las clases. Los
resultados deben ordenarse de manera ascendente por class_id y de manera
descendente por average_score.

Estructura del output:
{
"class_id": <class_id>,
"average_score": <average_score>, // puntuación promedio de esta clase
"comparison_to_overall_average": "above" | "below" | "equal" // comparación con el
promedio general de todas las clases
}

*/
db.grades.aggregate([
  {
    $unwind: "$scores",
  },
  {
    $group: {
      _id: "$class_id",
      average_score: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $lookup: {
      from: "grades",
      pipeline: [
        {
          $unwind: "$scores",
        },
        {
          $group: {
            _id: null,
            overall_average: { $avg: "$scores.score" },
          },
        },
        {
          $project: {
            _id: 0,
            overall_average: { $round: ["$overall_average", 2] },
          },
        },
      ],
      as: "overall_average",
    },
  },
  {
    $project: {
      class_id: 1,
      average_score: { $round: ["$average_score", 2] },
      overall_average: {
        $arrayElemAt: ["$overall_average.overall_average", 0],
      },
    },
  },
  {
    $project: {
      _id: 0,
      class_id: "$_id",
      average_score: 1,
      comparison_to_overall_average: {
        $cond: {
          if: { $eq: ["$overall_average", "$average_score"] },
          then: "equal",
          else: {
            $cond: {
              if: { $lt: ["$average_score", "$overall_average"] },
              then: "below",
              else: "above",
            },
          },
        },
      },
    },
  },
]);

/*
Ejercicio 2

Actualizar los documentos en la colección grades, ajustando todas las puntuaciones
para que estén normalizadas entre 0 y 7
La fórmula para la normalización es:

Valor normalizado: (ValorOriginal/100) * 7

Por ejemplo:
Si un estudiante sacó un 32 y otro sacó un 62, deberían ser actualizadas a:
● 2,24, porque (32/100)*7 = 2,24
● 4,34, porque (62/100)*7 = 4,34

HINT: usar updateMany junto con map
*/
db.grades.updateMany({}, [
  {
    $set: {
      scores: {
        $map: {
          input: "$scores",
          as: "s",
          in: {
            type: "$$s.type", // mantengo el tipo
            score: { $multiply: ["$$s.score", 7 / 100] }, // normalizamos
          },
        },
      },
    },
  },
]);

/*
Ejercicio 3
--------- -
Crear una vista "top10students_homework" que liste los 10 estudiantes con los
mejores promedios para homework. Ordenar por average_homework_score
descendiente.
*/

db.createView("top10students_homework", "grades", [
  {
    $unwind: "$scores.type",
  },
  {
    $match: { $eq: ["$scores.type", "homework"] },
  },
]);

db.createView("top10students_homework", "grades", [
  {
    $unwind: "$scores",
  },
  {
    $match: { "scores.type": "homework" },
  },
  {
    $group: {
      _id: "$student_id",
      avg_student: {
        $avg: "$scores.score",
      },
    },
  },
  {
    $sort: { avg_student: -1 },
  },
  {
    $limit: 10,
  },
  {
    $project: {
      _id: 0,
      student_id: "$_id",
      avg_student: 1,
    },
  },
]);

/*
Ejercicio 4
--------- -
Especificar reglas de validación en la colección grades. El único requerimiento es
que se valide que los type de los scores sólo puedan ser de estos tres tipos:
[“exam”, “quiz”, “homework”]
*/

db.runCommand({
  collMod: "grades",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        scores: {
          bsonType: "array",
          items: [
            {
              bsonType: "object",
              required: ["type"],
              properties: {
                type: {
                  enum: ["exam", "quiz", "homework"],
                  description:
                    "Los únicos valores permitidos son 'exam'/'quiz'/'homework'",
                },
              },
            },
          ],
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});

// ❌ Falla porque NO tiene campo scores type
db.grades.insertOne({
  student_id: 120301,
  class_id: 1,
  scores: [{ score: 20 }],
});

//MongoServerError: Document failed validation

// ❌ Falla por que tiene cualquier cosa en el campo type
db.grades.insertOne({
  student_id: 120301,
  class_id: 1,
  scores: [{ type: "Maraschio y Cagliero son god", score: 20 }],
});

// ✅ Pasa limpito
db.grades.insertOne({
  stundent_id: 120301,
  class_id: 1,
  scores: [{ type: "homework", score: 20 }],
});
