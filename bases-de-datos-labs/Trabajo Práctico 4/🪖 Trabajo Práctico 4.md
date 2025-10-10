# 🫡 Parte 1 - Consultas

1. Listar el nombre de la ciudad y el nombre del país de todas las ciudades que pertenezcan a países con una población menor a 10000 habitantes.

```sql
SELECT
	c.NAME,
    (SELECT co.Name  
	 FROM country co 
	 WHERE co.Code = c.CountryCode) AS CountryName,
    
    (SELECT co.Population 
     FROM country co 
     WHERE co.Code = c.`CountryCode`) AS Pop
FROM city AS c
WHERE EXISTS(
			SELECT *
	        FROM country co
	        WHERE co.Code = c.`CountryCode` AND co.Population < 10000 )
ORDER BY Pop ASC;
```

2. Listar todas aquellas ciudades cuya población sea mayor que la población promedio entre todas las ciudades.

```sql
SELECT 
	C.NAME,
	C.Population AS POBLACION,
	(SELECT CEIL(AVG(city.Population)) FROM city) AS POBLACION_PROMEDIO
FROM city C
WHERE (SELECT AVG(city.Population) FROM city) < C.Population
ORDER BY C.Population ASC; 
```

3. Listar todas aquellas ciudades no asiáticas cuya población sea igual o mayor a la población total de algún país de Asia.

```sql
SELECT
    c.Name AS Ciudad,
    co.Continent AS Continente,
    c.Population AS Poblacion_Ciudad
FROM
    city AS c
INNER JOIN
    country AS co ON c.CountryCode = co.Code
WHERE
    co.Continent <> 'Asia'
    AND c.Population >= ANY (
        SELECT Population
        FROM country
        WHERE Continent = 'Asia'
    )
ORDER BY
    c.Population ASC;
```

4. Listar aquellos países junto a sus idiomas no oficiales, que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.

```sql
SELECT 
	C.Name AS PAÍS,
    CL.Language AS LENGUAJE
FROM
	country C
INNER JOIN
	countrylanguage AS CL ON C.`Code` = CL.`CountryCode`
WHERE
	CL.`IsOfficial` = 'F' AND
	CL.`Percentage` > ALL (
						SELECT `Percentage`
		                FROM countrylanguage AS CL_OFICIALES
		                WHERE IsOfficial = 'T'
		                AND CL_OFICIALES.`CountryCode` = CL.`CountryCode`)
;
```

5. Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2 y exista (en el país) al menos una ciudad con más de 100000 habitantes. (Hint: Esto puede resolverse con o sin una subquery, intenten encontrar ambas respuestas).

```sql
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
	ci.Population > 100000


```


6. Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada. (Hint: Hay dos maneras de llegar al mismo resultado. Usando consultas escalares o usando agrupaciones, encontrar ambas).

```sql
-- Ejercicio 6

-- Usando agrupaciones

SELECT

c.Name AS `Pais`,

ci.NAME AS `Ciudad`,

MAX(ci.Population) AS `Población`

FROM country c

INNER JOIN

city AS ci ON c.Code = ci.CountryCode

GROUP BY c.Name

ORDER BY c.Name;


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
ORDER BY c.NAME
```

7. Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje de hablantes sea mayor al promedio de hablantes de los lenguajes oficiales.

```sql
SELECT
	co.Name AS `País`,
	colan.Language AS `Lenguaje`
FROM 
	country co
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
```

8. Listar la cantidad de habitantes por continente ordenado en forma descendente.

```sql
SELECT
	c.Continent AS `Continente`,
	SUM(c.Population) AS `Población`
FROM country c
GROUP BY c.Continent
ORDER BY `Población` DESC;
```

9. Listar el promedio de esperanza de vida (LifeExpectancy) por continente con una esperanza de vida entre 40 y 70 años.
   
```sql
SELECT
	c.Continent AS `Continent`,
	AVG(c.LifeExpectancy) AS `Tiempo de Vida`
FROM country c
WHERE
	c.LifeExpectancy >= 40 AND
	c.LifeExpectancy <= 70
GROUP BY c.Continent
ORDER BY c.LifeExpectancy ASC
```

10. Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.
```sql
SELECT
	c.Continent AS `Continente`,
	MIN(c.Population) AS `MIN. HAB`,
	MAX(c.Population) AS `MAX. HAB`,
	SUM(c.Population) AS `SUM. HAB`,
	AVG(c.Population) AS `PROM. HAB`
FROM country c
GROUP BY c.Continent
```

# 🫡 Parte 2 - Preguntas

11. Si en la consulta 6 se quisiera devolver, además de las columnas ya solicitadas, el nombre de la ciudad más poblada. ¿Podría lograrse con agrupaciones? ¿y con una subquery escalar?

- Para el tipo por grupo necesito una CTE
```sql
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
```
- Para el tipo por subquery escalar ya lo tenía hecho :D
