/*
Ejercicio 1
--------- -
Listar nombre del proyecto y cantidad de horas trabajadas en total en el mismo de
todos aquellos proyectos donde el total de horas trabajadas sea mayor o igual a
50hs ordenados por el total de horas trabajadas de forma descendente.
*/
SELECT 
    p.pname AS `NOMBRE`,
    SUM(wo.hours) AS `HORAS TRABAJADAS`
FROM project p
INNER JOIN
    works_on AS wo ON p.pnumber=wo.pno
GROUP BY p.pname
HAVING SUM(wo.hours)>=50;


/*
Ejercicio 2
--------- -
Listar SSN y nombre completo de aquellos empleados que solo trabajen en
proyectos controlados por el departamento de Research. Mostrar el resultado
ordenados por SSN de forma descendente.
*/
SELECT 
    e.ssn AS `SSN`,
    e.fname AS `NOMBRE`,
    e.lname AS `APELLIDO`
FROM employee e
INNER JOIN
    department as d ON e.dno = d.dnumber
WHERE d.dname = "Research"
ORDER BY e.ssn DESC;


/*
Ejercicio 3
--------- -
(Ejercicio para Libres)
Crear un procedimiento almacenado que dado un nombre de departamento (parámetro de entrada), debe listar el nombre de proyecto,
cantidad de empleados y total de horas trabajadas para cada proyecto controlado
por dicho departamento*/

DELIMITER $$
CREATE PROCEDURE proc1 ( IN dept_name CHAR(15) )
BEGIN
    SELECT
        p.pname AS `PROYECTO`,
        COUNT(wo.essn) AS `EMPLEADOS`,
        SUM(wo.hours) AS `HORAS TRABAJADAS`
    FROM department d
    INNER JOIN
        project AS p ON d.dnumber=p.dnum AND d.dname = dept_name
    INNER JOIN
            works_on AS wo ON wo.pno = p.pnumber
    GROUP BY p.pname;
END$$

DELIMITER ;

CALL proc1("Research");