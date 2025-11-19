/*
Ejercicio 1
Crear la tabla `stocks` que almacena la información de inventario, es decir, la cantidad de un producto en particular en una store específica, deberá constar con los siguientes campos: a. `quantity`: representa la cantidad de un producto. Tener en cuenta a la hora de elegir los tipos de datos que sean lo más eficientes posibles. Además, deberán coordinar con los valores que se definen en el archivo `data_stocks.sql`, que deberán cargar mediante el siguiente comando: mysql -h <host> -u <user> -p<password> < data_stocks.sql
*/
CREATE TABLE stocks (
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    PRIMARY KEY (store_id, product_id)
);

-- Después para cargar:
-- SOURCE ...


/*
Ejercicio 2
Listar los precios de lista máximos y mínimos en cada categoría retornando solamente aquellas categorías que tiene el precio de lista máximo superior a 5000 o el precio de lista mínimo inferior a 400.
*/
SELECT
    c.category_name AS `CATEGORÍA`,
    MAX(p.list_price) AS `MÁX. LISTA PRECIO`,
    MIN(p.list_price) AS `MÍN. LISTA PRECIO`
FROM products AS p
INNER JOIN
    categories AS c ON c.category_id = p.category_id
GROUP BY 
    c.category_name
HAVING
    MAX(p.list_price) > 5000 OR
    MIN(p.list_price) < 400;


/*
Ejercicio 3
Crear un procedimiento `add_product_stock_to_store` que tomará un nombre de store, un nombre de producto y una cantidad entera donde actualizará la cantidad del producto en la store especificada (i.e., solo sumará el valor de entrada al valor corriente en la tabla `stocks`). 
*/
DELIMITER $$

CREATE PROCEDURE add_product_stock_to_store (
    store_name VARCHAR (255),
    product_name VARCHAR (255),
    quantity INT
)
BEGIN
    UPDATE stocks AS s
    INNER JOIN products AS p ON p.product_id = s.product_id
    INNER JOIN stores AS st ON st.store_id = s.store_id 
    SET s.quantity = s.quantity + quantity
    WHERE p.product_name = product_name AND st.store_name = store_name;
END $$

DELIMITER ;

-- Probar ejemplo
-- Chequeamos tienda, producto y cantida
SELECT *
FROM stocks AS s
INNER JOIN products AS p ON p.product_id = s.product_id
INNER JOIN stores AS st ON st.store_id = s.store_id
WHERE p.product_id = 1 AND s.store_id = 2;

CALL add_product_stock_to_store(
    "Baldwin Bikes",
    "Trek 820 - 2016",
    3
    );

/*
Ejercicio 4
Crear un trigger llamado `decrease_product_stock_on_store` que decrementará el valor del campo `quantity` de la tabla `stocks` con el valor del campo `quantity` de la tabla `order_items`. El trigger se ejecutará luego de un `INSERT` en la tabla `order_items` y deberá actualizar el valor en la tabla `stocks` de acuerdo al valor correspondiente. 
*/

DELIMITER $$

CREATE TRIGGER decrease_product_stock_on_store AFTER INSERT
ON order_items FOR EACH ROW
BEGIN
    UPDATE stocks AS s
    INNER JOIN orders AS o ON s.store_id = o.store_id
    SET s.quantity = s.quantity - NEW.quantity
    WHERE NEW.order_id = o.order_id AND NEW.product_id = s.product_id;
END $$

DELIMITER ;

-- Probar con un ejemplo
-- Vemos qué es lo que tiene de cantidad para algún producto
SELECT 
    s.store_id,
    s.quantity,
    s.product_id,
    o.order_id,
    oi.item_id,
    oi.list_price
FROM stocks AS s
INNER JOIN order_items AS oi ON oi.product_id = s.product_id
INNER JOIN orders AS o ON s.store_id = o.store_id
WHERE s.product_id = 2 AND o.order_id = 1 AND oi.item_id = 2500; 

INSERT INTO order_items (order_id, item_id, product_id, quantity, list_price, discount)
VALUES (1, 2500, 2, 3, 749.99, 0);

/*
Ejercicio 5
Devuelva el precio de lista promedio por brand para todos los productos con modelo de año (`model_year`) entre 2016 y 2018. 
*/
SELECT
    b.brand_id AS `BRAND`,
    p.model_year AS `AÑO MODELO`,
    ROUND(AVG(p.list_price), 2) AS `PRECIO LISTA PROM.`
FROM products AS p
INNER JOIN
    brands AS b ON b.brand_id = p.brand_id
WHERE p.model_year BETWEEN 2016 AND 2018
GROUP BY b.brand_id, p.model_year
ORDER BY b.brand_id;


/*
Ejercicio 6
Liste el número de productos y ventas para cada categoría de producto. Tener en cuenta que una venta (`orders` table) es completada cuando la columna `order_status` = 4.
*/
WITH order_items_with_orders_with_sale AS (
    SELECT
        o.order_id,
        oi.product_id
    FROM orders as o
    INNER JOIN
        order_items AS oi ON oi.order_id = o.order_id
    WHERE o.order_status = 4
),
product_by_category AS (
    SELECT
        p.product_id,
        c.category_name
    FROM products AS p
    INNER JOIN
        categories AS c ON c.category_id = p.category_id
)
SELECT
    pbc.category_name,
    COUNT(oios.order_id) AS `VENTAS`,
    COUNT(DISTINCT pbc.product_id) AS `CANT. DE PRODUCTOS`
FROM order_items_with_orders_with_sale AS oios
INNER JOIN
    product_by_category AS pbc ON oios.product_id = pbc.product_id
GROUP BY pbc.category_name;

/*
Ejercicio 7
Crear el rol `human_care_dept` y asignarle permisos de creación sobre la tabla `staffs` y permiso de actualización sobre la columna `active` de la tabla `staffs
*/

CREATE ROLE human_care_dept;

GRANT INSERT, UPDATE
(active) ON staffs
TO human_care_dept;

SHOW GRANTS FOR 'human_care_dept';