-- Ejercicio 1
-- 1) Cree una tabla de `directors` con las columnas: Nombre, Apellido, Número de Películas.
CREATE TABLE directors (
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    num_movies int
);


-- Ejercicio 2

-- OBJETIVO: Filtrar los el TOP 5 actores con mayor experiencia
-- FILTRAR:  NOMBRE, APELLIDO y el NÚMERO DE PELICULAS FILMADAS del TOP 5 actores.
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
    -- Este JOIN no es necesario
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


-- Ejercicio 3
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

-- Ejercicio 4
--  Modifique la tabla customer. Marque con 'T' en la columna `premium_customer`
--  de los 10 clientes con mayor dinero gastado en la plataforma.

-- Con esta vista obtengo una tabla de los 10 clientes con mayor dinero gastado en la plataforma.
CREATE OR REPLACE VIEW top5customers AS
    SELECT payment.customer_id 
    FROM payment
    ORDER BY amount DESC
    LIMIT 10;

-- Actualizo la tabla 
UPDATE customer
SET premium_customer = 'T'
WHERE customer.customer_id IN (
    SELECT *
    FROM top5customers
);

-- Verifico el resultado
    SELECT *
    FROM customer
    WHERE premium_customer = 'T';


-- Ejercicio 5
--  Listar, ordenados por cantidad de películas (de mayor a menor),
--  los distintos ratings de las películas existentes 
--  (Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).

SELECT 
    COUNT(film.rating) Cantidad,
    rating Rating
FROM film
GROUP BY rating
ORDER BY COUNT(film.rating) DESC;


-- Ejercicio 6
-- ¿Cuáles fueron la primera y última fecha donde hubo pagos?
SELECT
    MIN(payment_date) 'Primera Fecha',
    MAX(payment_date) 'Última Fecha'
FROM payment;


-- Ejercicio 7
-- Calcule, por cada mes, el promedio de pagos 
-- (Hint: vea la manera de extraer el nombre del mes de una fecha).

-- SUBSTRING(varchar, comienzo, largo)
-- DATE_FORMAT(payment_date, '%m') || DATE_FORMAT(payment_date, '%M') para palabras

-- PAGOS

-- Usando DATE_FORMAT() para obtener siempre dos dígitos
-- MONTH()
-- YEAR()
-- DAY()
SELECT 
    DATE_FORMAT(payment_date, '%M') `Mes`,
    AVG(payment.amount) AS `Promedio de Pagos`
FROM payment
GROUP BY MONTH(payment_date);

-- Ejercicio 8
-- Listar los 10 distritos que tuvieron mayor cantidad de alquileres 
-- (con la cantidad total de alquileres).

-- district -> address

WITH rental_in_each_district AS (
    SELECT
        rental.rental_id,
        customer.address_id
    FROM rental
    INNER JOIN
        customer ON rental.customer_id = customer.customer_id
)
SELECT
    COUNT(red.rental_id) `Cantidad Total`,
    address.district `Distrito`
FROM rental_in_each_district red
INNER JOIN
    address ON address.address_id = red.address_id
GROUP BY address.district
ORDER BY COUNT(red.rental_id) DESC
LIMIT 10;


-- Ejercicio 9
-- Modifique la table `inventory_id` agregando una columna `stock` 
-- que sea un número entero y representa la cantidad de copias de 
-- una misma película que tiene determinada tienda. El número por defecto debería ser 5 copias.

-- Creo una nueva columna stock
ALTER TABLE inventory
ADD `stock` INT;

-- Seteo valor por defecto
UPDATE inventory
SET stock = '5';

-- Primero veo : película -> inventario -> tienda 
-- Esta tabla contiene toda la data de:
-- * Copia de película en el inventario de una tienda

UPDATE inventory i
INNER JOIN
    (SELECT 
        inventory.store_id AS store_id,
        film.film_id         AS film_id, 
        count(film.title)  AS num_copy
    FROM inventory
    INNER JOIN
        film ON inventory.film_id = film.film_id
    GROUP BY store_id, film.title
    )
    AS sf ON i.store_id = sf.store_id AND i.film_id = sf.film_id
SET i.stock = sf.num_copy;

-- Atestiguar el resultado
SELECT *
FROM inventory;

-- Ejercicio 10
-- Cree un trigger `update_stock` que, cada vez que se agregue un 
-- nuevo registro a la tabla rental, haga un update en la tabla `inventory`
-- restando una copia al stock de la película rentada.
-- (Hint: revisar que el rental no tiene información directa sobre la tienda,
-- sino sobre el cliente, que está asociado a una tienda en particular).


-- Cada vez que se agregue un nuevo registro a la tabla rental vas a tener un NEW
-- A ese NEW (película rentada) hay que retarle 1 del stock

-- -> Por lo tanto de la TUPLA de `rental` buscar el `inventory_id`
-- -> Luego de la TUPLA de `rental` buscar la película

-- DELIMITER //

-- CREATE TRIGGER update_stock
-- AFTER INSERT ON rental
-- FOR EACH ROW
-- BEGIN

--     DECLARE c_store_id INT;
--     DECLARE c_last_update DATETIME;
--     DECLARE s_last_update DATETIME;
--     DECLARE i_last_update DATETIME;

--     -- Busco la tienda e inventario asociado al cliente y al alquiler respectivamente.
--     SELECT c.store_id, c.last_update
--     INTO c_store_id, c_last_update
--     FROM customer c
--     WHERE c.customer_id = NEW.customer_id;

--     -- Busco última actualización de la tienda
--     SELECT s.last_update
--     INTO s_last_update
--     FROM store s
--     WHERE s.store_id = c_store_id;

--     -- Busco última actualización del inventario
--     SELECT last_update
--     INTO i_last_update
--     FROM inventory i
--     WHERE i.inventory_id = NEW.inventory_id;

--     -- Chequeo la última actualización de renta con cliente
--     IF (NEW.last_update = c_last_update) THEN
--         -- Chequeo la última actualización de renta con tienda
--         IF (NEW.last_update = s_last_update) THEN
--             -- Chequeo la última actualización de renta con inventario
--             IF (NEW.last_update = i_last_update) THEN
--                 -- Si todo OK puedo restar tranquilamente
--                 UPDATE inventory i
--                 SET i.stock = i.stock - 1
--                 WHERE i.inventory_id = NEW.inventory_id;
--             END IF;
--         END IF;
--     END IF;

-- END//

-- DELIMITER ;

DELIMITER //

CREATE TRIGGER update_stock
AFTER INSERT ON rental
FOR EACH ROW
BEGIN

    UPDATE inventory i
    SET i.stock = i.stock - 1
    WHERE i.inventory_id = NEW.inventory_id;

END//

DELIMITER ;


-- Veamos el stock
SELECT inventory_id, stock 
FROM inventory
WHERE inventory_id = 1;


-- Probamos el TRIGGER
INSERT INTO rental (rental_date, inventory_id, customer_id ,return_date, staff_id, last_update)
VALUES ('2005-05-26 23:00:00', 1, 1, NULL, 1, NOW());

-- Chequeo los nuevos rental
SELECT *
FROM rental
WHERE 
    inventory_id = 1 AND
    customer_id = 1;

-- Chequeamos el STOCK
SELECT inventory_id, stock 
FROM inventory
WHERE inventory_id = 1;


-- Ejercicio 11
-- Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`.
-- El primero es una clave foránea a la tabla rental y el segundo es un
-- valor numérico con dos decimales.*

CREATE TABLE fines (
    fines_id SMALLINT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT(11),
    amount  DECIMAL(10,2),
    FOREIGN KEY (rental_id) REFERENCES rental(rental_id)
);


-- Ejercicio 12
-- Cree un procedimiento `check_date_and_fine` que revise la tabla `rental`
-- y cree un registro en la tabla `fines` por cada `rental` cuya devolución
-- (return_date) haya tardado más de 3 días (comparación con rental_date).
-- El valor de la multa será el número de días de retraso multiplicado por 1.5.

DELIMITER //

CREATE PROCEDURE check_date_and_fine() BEGIN
    
    INSERT INTO fines (rental_id, amount)
    SELECT 
        r.rental_id,
        DATEDIFF(r.return_date, r.rental_date) * 1.5
    FROM rental r
    WHERE DATEDIFF(r.return_date, r.rental_date) > 3;

END//

DELIMITER ;

-- Probamos el procedimiento
CALL check_date_and_fine();

-- Chequeamos la tabla
SELECT *
FROM fines;


-- Ejercicio 13
-- Crear un rol `employee` que tenga acceso de inserción,
-- eliminación y actualización a la tabla `rental`.

--Creo el rol
CREATE ROLE employee;

-- Le doy privilegios
GRANT INSERT, DELETE, UPDATE 
ON rental
TO employee;

-- Ejercicio 14
-- Revocar el acceso de eliminación a `employee` y crear un rol `administrator`
-- que tenga todos los privilegios sobre la BD `sakila`.

-- Revoko
REVOKE DELETE
ON rental 
FROM employee;

-- Creo el rol administrator
CREATE ROLE administrator;

-- Le doy privilegios
GRANT ALL PRIVILEGES
ON sakila.*
FROM administrator;

-- Ejercicio 15
-- Crear dos roles de empleado. A uno asignarle los permisos de `employee`
-- y al otro de `administrator`.

CREATE ROLE junior_employee;
CREATE ROLE senior_employee;

GRANT employee
TO junior_employee;

GRANT administrator
TO senior_employee;
