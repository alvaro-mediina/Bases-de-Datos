# Parte II - Consultas

1. Devuelva una lista de los nombres y las regiones a las que pertenece cada país ordenada alfabéticamente.

```sql  
SELECT `Name`, `Region` 
FROM country 
ORDER BY `Name` 
```

2. Liste el nombre y la población de las 10 ciudades más pobladas del mundo.

```sql
SELECT `NAME`, `Population`
FROM city
ORDER BY `Population` DESC
LIMIT 10;
```

3. Liste el nombre, región, superficie y forma de gobierno de los 10 países con menor superficie.

```sql
SELECT `Name`, `Region`, `SurfaceArea`, `GovernmentForm` 
FROM country
ORDER by `SurfaceArea` ASC
LIMIT 10;
```

4. Liste todos los países que no tienen independencia (hint: ver que define la independencia de un país en la BD).

```sql
SELECT `Name` 
FROM country
WHERE `IndepYear` IS NULL;
```

5. Liste el nombre y el porcentaje de hablantes que tienen todos los idiomas declarados oficiales.
```sql
SELECT `Language`,`Percentage`
FROM countrylanguage
WHERE `IsOfficial`= 'T';
```

## Consultas adicionales - Vivido

6. Actualizar el valor de porcentaje del idioma inglés en el país con código 'AIA' a 100.0

```sql
UPDATE countrylanguage 
SET `Percentage`=100.0
WHERE `CountryCode`='AIA';
```

7. Listar las ciudades que pertenecen a Córdoba (District) dentro de Argentina.

```sql
SELECT `NAME`
FROM city
WHERE `CountryCode`='ARG' AND `District`='Córdoba';
```

8. Eliminar todas las ciudades que pertenezcan a Córdoba fuera de Argentina.

```sql
DELETE
FROM city 
WHERE `District`='Córdoba' AND `CountryCode`!= 'ARG';
```

9. Listar los países cuyo Jefe de Estado se llame John.

```sql
SELECT  `Name`
FROM country
WHERE `HeadOfState`LIKE 'John%';
```

10. Listar los países cuya población esté entre 35 M y 45 M ordenados por población de forma descendente.

```sql
SELECT *
FROM country
WHERE `Population`> 35000000 AND `Population`< 45000000
ORDER BY `Population` DESC;
```

11. Identificar las redundancias en el esquema final.
- **`country.Continent`** → ya existe una tabla **`continent`**, por lo que mantener el nombre del continente como atributo en `country` introduce redundancia.
- **`continent.percentTotalMass`** → es un dato _derivable_ (puede calcularse a partir de otras columnas), por lo que no conviene almacenarlo directamente.
- **`country.GNPOld`** → guarda un valor histórico que podría normalizarse en otra tabla dedicada a GNPHistórico, evitando mezclar datos actuales e históricos en la misma entidad.
- **`country.LocalName`** → se solapa con la información de **`countrylanguage`** (ya que el idioma y su forma local de denominar al país puede inferirse allí).
- **Ciudades en dos roles** → las ciudades aparecen tanto como `Capital` en **country** como `mostPopulousCity` en otra relación. Esto introduce redundancia y riesgo de inconsistencia si cambian en un lugar y no en el otro.

