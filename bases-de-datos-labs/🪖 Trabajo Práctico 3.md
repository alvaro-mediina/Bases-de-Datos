
# **Parte I - Consultas**
1. Lista el nombre de la ciudad, nombre del país, región y forma de gobierno de las 10 ciudades más pobladas del mundo.

```sql
SELECT city.`NAME`, country.`Name`, country.`Region`, country.`GovernmentForm`, city.`Population`
FROM city
INNER JOIN country ON city.`CountryCode`= country.`Code`
ORDER BY city.`Population` DESC
LIMIT 10;
```

2. Listar los 10 países con menor población del mundo, junto a sus ciudades capitales (Hint: puede que uno de estos países no tenga ciudad capital asignada, en este caso deberá mostrar "NULL").

```sql
SELECT country.`Name`, city.`NAME`, country.`Population`
FROM country
LEFT JOIN city ON city.`ID` = country.`Capital`
ORDER BY `Population` ASC
LIMIT 10;
```

3. Listar el nombre, continente y todos los lenguajes oficiales de cada país. (Hint: habrá más de una fila por país si tiene varios idiomas oficiales).

```sql
SELECT country.`Name`, country.`Continent`, countrylanguage.`Language`
FROM country
INNER JOIN countrylanguage ON countrylanguage.`CountryCode`= country.`Code`
WHERE countrylanguage.`IsOfficial`='T';
```

4. Listar el nombre del país y nombre de capital, de los 20 países con mayor superficie del mundo.

```sql
SELECT country.`Name`, city.`NAME`
FROM country
INNER JOIN city ON city.`ID` = country.`Capital`
ORDER BY `SurfaceArea` DESC
LIMIT 20;
```

5. Listar las ciudades junto a sus idiomas oficiales (ordenado por la población de la ciudad) y el porcentaje de hablantes del idioma.

```sql
SELECT city.`NAME`, countrylanguage.`Language`, countrylanguage.`Percentage`
FROM city
INNER JOIN countrylanguage ON city.`CountryCode`= countrylanguage.`CountryCode`
WHERE countrylanguage.`IsOfficial`='T'
ORDER BY city.`Population` ASC;
```

6. Listar los 10 países con mayor población y los 10 países con menor población (que tengan al menos 100 habitantes) en la misma consulta.

```sql
(
	SELECT country.`Name`, country.`Population`
	FROM country
	WHERE country.`Population` >= 100
    ORDER BY country.`Population` DESC
    LIMIT 10
)
	UNION
(
	SELECT country.`NAME`, country.`Population`
	FROM country
	WHERE country.`Population` >= 100
	ORDER BY country.`Population` ASC
	LIMIT 10
);
```

7. Listar aquellos países cuyos lenguajes oficiales son el Inglés y el Francés (hint: no debería haber filas duplicadas).

```sql
SELECT country.`Name`, countrylanguage.`Language`
FROM country
JOIN countrylanguage ON country.`Code`= countrylanguage.`CountryCode`
WHERE countrylanguage.`Language` IN ('English', 'French') AND countrylanguage.`IsOfficial`='T'
GROUP BY country.`Name`
HAVING COUNT(DISTINCT countrylanguage.`Language`) = 2;
```

8. Listar aquellos países que tengan hablantes del Inglés pero no del Español en su población.

```sql
SELECT *
FROM
(
(
	SELECT country.`Name`
	FROM country
	INNER JOIN countrylanguage ON country.`Code`= countrylanguage.`CountryCode`
	WHERE countrylanguage.`Language`='English'
)
	EXCEPT 
(
	SELECT country.`Name`
	FROM country
	INNER JOIN countrylanguage ON country.`Code`= countrylanguage.`CountryCode`
	WHERE countrylanguage.`Language`='Spanish'
)
)
AS T
ORDER BY T.`Name` ASC;
```

# **Parte II - Preguntas**

**¿Devuelven los mismos valores las siguientes consultas? ¿Por qué?**

```sql
SELECT city.Name, country.Name
FROM city
INNER JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';
```

```sql  

SELECT city.Name, country.Name
FROM city
INNER JOIN country ON city.CountryCode = country.Code
WHERE country.Name = 'Argentina';
```

Sí devuelven los mismos valores las consultas porque al hacer INNER JOIN estamos intersecando en las tablas a las filas que tienen el mismo *código* y depende de la consulta:
- En la primer consulta además de pedir el mismo código de país pedimos que el nombre sea *'Argentina'* y lo filtramos
- Mientras que en la segunda consulta filtramos pero desde un *where*

**¿Y si en vez de INNER JOIN fuera un LEFT JOIN?**
Si fuera un *LEFT JOIN* NO tendría el mismo resultado, dado que 
- En la primer consulta *LEFT JOIN* nos traerá a toda la tabla de ciudad repleto de valores nulos dado que no se satisfacería para el nombre 'Argentina'.
- Mientras que en la segunda consulta SI se mantendría la salida ya que se filtran los nombres en el *WHERE*
