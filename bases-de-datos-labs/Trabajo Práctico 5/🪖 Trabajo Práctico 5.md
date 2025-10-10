>[!Info]
>Es mejor programar funciones/procedimientos en SQL por la eficiencia que te brinda en vez de programar funciones en otro lenguaje y sólo hacer consultas sobre este.

# Operaciones 
# 🐯Triggers
# 😲 Vistas

# 🧐 Consultas
  
*1) Cree una tabla de `directors` con las columnas: Nombre, Apellido, Número de Películas.*

```sql
CREATE TABLE directors (
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	num_movies int
);
``` 

*2) El top 5 de actrices y actores de la tabla `actors` que tienen la mayor experiencia (i.e. el mayor número de películas filmadas) son también directores de las películas en las que participaron. Basados en esta información, inserten, utilizando una subquery los valores correspondientes en la tabla `directors`.*

```sql
-- OBJETIVO: Filtrar los el TOP 5 actores con mayor experiencia
-- FILTRAR: NOMBRE, APELLIDO y el NÚMERO DE PELICULAS FILMADAS del TOP 5 actores.
-- Tabla actores
-- Top 5 entre actrices y actores
-- Mayor número de películas filmadas
CREATE OR REPLACE VIEW top5actors AS
SELECT
	actor.first_name,
	actor.last_name,
	count(film.film_id)
FROM actor
INNER JOIN
	film_actor ON actor.actor_id = film_actor.actor_id
INNER JOIN
	film ON film.film_id = film_actor.film_id
GROUP BY actor.actor_id
ORDER BY count(film.film_id) DESC
LIMIT 5; 
-- Inserto valores generados por la vista `top5actors` en la tabla `directors`

INSERT INTO directors (first_name, last_name, num_movies)
SELECT *
FROM top5actors;

-- Revisar el contenido de directores

SELECT *
FROM directors;
```

*3) Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo a si el cliente es "premium" o no. Por defecto ningún cliente será premium.*

  ```sql
  -- Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de
-- acuerdo a si el cliente es "premium" o no. Por defecto ningún cliente será premium.

-- Agrego la columna, inicialmente con valores nulos
ALTER TABLE customer
ADD `premium_customer` CHAR(1);

-- Actualizo customer seteando la columna premium_customer con 'F'
UPDATE customer
SET premium_customer = 'F';

-- Reviso que haya sido así.
SELECT *
FROM customer;  
```

*4) Modifique la tabla customer. Marque con 'T' en la columna `premium_customer` de los 10 clientes con mayor dinero gastado en la plataforma.*

```sql
CREATE OR REPLACE VIEW top5customers AS
SELECT payment.customer_id
FROM payment
ORDER BY amount DESC
LIMIT 10;
```

*5) Listar, ordenados por cantidad de películas (de mayor a menor), los distintos ratings de las películas existentes (Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).*

  ```sql
```

*6) ¿Cuáles fueron la primera y última fecha donde hubo pagos?*

  ```sql
```

*7) Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer el nombre del mes de una fecha).*

  ```sql
```

*8) Listar los 10 distritos que tuvieron mayor cantidad de alquileres (con la cantidad total de alquileres).*

  ```sql
```

*9) Modifique la table `inventory_id` agregando una columna `stock` que sea un número entero y representa la cantidad de copias de una misma película que tiene determinada tienda. El número por defecto debería ser 5 copias.*

  ```sql
```

*10) Cree un trigger `update_stock` que, cada vez que se agregue un nuevo registro a la tabla rental, haga un update en la tabla `inventory` restando una copia al stock de la película rentada (Hint: revisar que el rental no tiene información directa sobre la tienda, sino sobre el cliente, que está asociado a una tienda en particular).*

  ```sql
```

*11) Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`. El primero es una clave foránea a la tabla rental y el segundo es un valor numérico con dos decimales.*

```sql
```  

*12) Cree un procedimiento `check_date_and_fine` que revise la tabla `rental` y cree un registro en la tabla `fines` por cada `rental` cuya devolución (return_date) haya tardado más de 3 días (comparación con rental_date). El valor de la multa será el número de días de retraso multiplicado por 1.5.*

  ```sql
```

*13) Crear un rol `employee` que tenga acceso de inserción, eliminación y actualización a la tabla `rental`.*

  ```sql
```

*14) Revocar el acceso de eliminación a `employee` y crear un rol `administrator` que tenga todos los privilegios sobre la BD `sakila`.*

  ```sql
```

*15) Crear dos roles de empleado. A uno asignarle los permisos de `employee` y al otro de `administrator`.*

```sql
```