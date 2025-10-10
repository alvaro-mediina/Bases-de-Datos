-- Ejercicio 5
-- Con Subquery
SELECT DISTINCT c.`Region` AS Region
FROM country c
WHERE c.`SurfaceArea` < 1000
    AND EXISTS (
        SELECT *
        FROM country CO
            INNER JOIN city ON city.CountryCode = CO.Code
        WHERE c.`Code` = CO.Code
            AND city.Population > 100000
    );

-- Sin Subquery
SELECT DISTINCT c.Region AS Region
FROM country c
INNER JOIN
    city AS ci ON ci.CountryCode = c.Code
WHERE
    c.SurfaceArea < 1000 AND
    ci.Population > 100000;

-- Ejercicio 6
-- Usando agrupaciones
SELECT
    c.Name AS `Pais`,
    MAX(ci.Population) AS `Población`
FROM country c
INNER JOIN
    city AS ci ON c.Code = ci.CountryCode
GROUP BY c.Name
ORDER BY c.Name;

-- Usando consultas escalares
SELECT
    c.Name AS `País`,
    ci.Population AS `Población`
FROM
    country c
INNER JOIN
    city as ci ON ci.CountryCode = c.Code
WHERE
    ci.Population = (SELECT MAX(ci.Population) FROM city ci WHERE ci.CountryCode = c.Code)
ORDER BY c.NAME;

-- Ejercicico 7
SELECT
    co.Name AS `País`,
    colan.Language AS `Lenguaje`
FROM country co
INNER JOIN
    countrylanguage colan ON colan.CountryCode = co.Code
WHERE
    colan.isOfficial = 'F' AND
    colan.Percentage > (SELECT AVG(cl.Percentage)
                        FROM countrylanguage cl
                        WHERE 
                            cl.CountryCode = co.Code AND
                            cl.isOfficial = 'T')
ORDER BY co.NAME;

-- Ejercicio 8
SELECT
    c.Continent AS `Continente`,
    SUM(c.Population) AS `Población`
FROM country c
GROUP BY c.Continent
ORDER BY `Población` DESC;

-- Ejercicio 9
SELECT
    c.Continent AS `Continent`,
    AVG(c.LifeExpectancy) AS `Tiempo de Vida`
FROM country c
WHERE 
    c.LifeExpectancy >= 40 AND
    c.LifeExpectancy <= 70
GROUP BY c.Continent
ORDER BY c.LifeExpectancy ASC;

-- Ejercicio 10
SELECT
    c.Continent AS `Continente`,
    MIN(c.Population) AS `MIN. HAB`,
    MAX(c.Population) AS `MAX. HAB`,
    SUM(c.Population) AS `SUM. HAB`,
    AVG(c.Population) AS `PROM. HAB`
FROM country c
GROUP BY c.Continent;

-- Ejercicio 11
-- Usando agrupaciones
WITH country_max_pop AS (
    SELECT
        CountryCode,
        MAX(Population) AS max_pop
    FROM city
    GROUP BY CountryCode
)
SELECT 
    c.Name AS `País`,
    ci.Name AS `Ciudad Más Poblada`,
    ci.Population AS `Población`
FROM country c
INNER JOIN 
    city ci ON c.Code = ci.CountryCode
INNER JOIN 
    country_max_pop cmp ON c.Code = cmp.CountryCode AND ci.Population = cmp.max_pop
ORDER BY c.Name ASC;

-- Usando consultas escalares
SELECT
    c.Name AS `País`,
    ci.NAME AS `Ciudad`,
    ci.Population AS `Población`
FROM
    country c
INNER JOIN
    city as ci ON ci.CountryCode = c.Code
WHERE
    ci.Population = (SELECT MAX(ci.Population) FROM city ci WHERE ci.CountryCode = c.Code)
ORDER BY c.NAME;

