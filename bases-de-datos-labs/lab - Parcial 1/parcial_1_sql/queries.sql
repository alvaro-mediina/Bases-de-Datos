/*
Ejercicio 1
--------- -
1. Listar los 5 clientes que más ingresos han generado a lo largo del tiempo.
*/

/*
* Los CLIENTES(Customers) tienen Órdenes
* Las Órdenes NO TIENEN relación de precios.
* OrderDetail tiene el precio.
*/
        
SELECT
    c.CustomerID,
    ROUND(SUM(od.UnitPrice * od.Quantity * (1-od.Discount)), 2)  AS `Ingresos`
FROM Customers AS c
INNER JOIN 
    Orders AS o ON o.CustomerID=c.CustomerID
INNER JOIN
    `Order Details` AS od ON od.OrderID=o.OrderID
GROUP BY c.CustomerID
ORDER BY `Ingresos` DESC
LIMIT 5;

/*
Ejercicio 2
--------- -
Listar cada producto con sus ventas totales, agrupados por categoría.
*/

/*
Listar PRODUCTOS | VENTAS TOTALES | CATEGORÍA
*/
/*
* Products -> Category
* Products -> OrderDetail
* Asumo que si hay una órden entonces cuenta como venta
*/
SELECT *
FROM `Order Details` AS od
INNER JOIN
    Products as p ON p.ProductID=od.ProductID;


-- Si hablamos de ventas totales en cuanto a UNIDADES
SELECT
    p.ProductName    AS `Producto`,
    SUM(od.Quantity) AS `Ventas Totales`,
    c.CategoryName   AS `Categoría`
FROM Products as p
INNER JOIN
    Categories AS c ON p.CategoryID=c.CategoryID
INNER JOIN
    `Order Details` AS od ON p.ProductId = od.ProductID
GROUP BY c.CategoryName, p.ProductName
ORDER BY c.CategoryName ASC;

-- Si hablamos de ventas totales en cuanto a PRECIO
SELECT
    p.ProductName    AS `Producto`,
    ROUND(SUM(od.Quantity * od.UnitPrice * (1-od.Discount)),2) AS `Ventas Totales`,
    c.CategoryName   AS `Categoría`
FROM Products as p
INNER JOIN
    Categories AS c ON p.CategoryID=c.CategoryID
INNER JOIN
    `Order Details` AS od ON p.ProductId = od.ProductID
GROUP BY c.CategoryName, p.ProductName
ORDER BY c.CategoryName ASC;


/*
Ejercicio 3
--------- -
Calcular el total de ventas para cada categoría.
*/

SELECT 
    c.CategoryName   AS `Categoria`,
    SUM(od.Quantity) AS `Ventas Totales`
FROM Categories AS c
INNER JOIN
    Products AS p ON p.CategoryID = c.CategoryID
INNER JOIN
    `Order Details` AS od ON od.ProductID = p.ProductID
GROUP BY c.CategoryName
ORDER BY c.CategoryName ASC;


/*
Ejercicio 4
--------- -
Crear una vista que liste los empleados con más ventas por cada año, mostrando empleado, año y total de ventas.
Ordenar el resultado por año ascendente.
*/


/*
MOSTRAR:
    * Empleado
    * Año
    * Total de ventas (Contar unidades)
*/

/*
    * Primero capturo las ventas totales por empleado en cada año.
    * A su vez los datos del empleado.
*/
CREATE VIEW employees_with_the_highest_annual_sales AS
WITH sales_per_year AS (
    SELECT 
        e.EmployeeID        AS `id`,
        e.FirstName         AS `fname`,
        e.LastName          AS `lname`,
        YEAR(o.OrderDate)   AS `year`,
        SUM(od.Quantity)    AS `sales_total`
    FROM Employees AS e
    INNER JOIN
        Orders AS o ON e.EmployeeID = o.EmployeeID
    INNER JOIN
        `Order Details` AS od ON o.OrderID = od.OrderID
    GROUP BY 
        YEAR(o.OrderDate),
        e.EmployeeID,
        e.FirstName,
        e.LastName
),
/*
    * Utilizo otra tabla para calcular la mejor venta por año.
*/
top_sales_per_year AS (
    SELECT
        spy.`year` AS `year`,
        MAX(spy.`sales_total`) AS `max_sales_total`
    FROM sales_per_year AS spy
    GROUP BY 
        spy.`year`
)
/*
    * Finalmente encuentro la mejor venta por año y la matcheo con el empleado.
*/
SELECT
    spy.`id`            AS `EMPLEADO ID`,
    spy.`fname`            AS `NOMBRE`,
    spy.`lname`            AS `APELLIDO`,
    spy.`year`          AS `AÑO`,
    spy.`sales_total`   AS `VENTAS`
FROM 
    sales_per_year AS spy,
    top_sales_per_year AS tspy
WHERE
    spy.`sales_total` = tspy.`max_sales_total` AND
    spy.`year` = tspy.`year`
ORDER BY spy.`sales_total`;


/*
Ejercicio 5
--------- -
5. Crear un trigger que se ejecute después de insertar un nuevo registro en la tabla Order Details. Este trigger debe actualizar la tabla Products para disminuir la cantidad en stock (UnitsInStock) del producto correspondiente, restando la cantidad (Quantity) que se acaba de insertar en el detalle del pedido.
*/
DELIMITER $$
CREATE TRIGGER update_stock_after_order_detail_insert AFTER INSERT
ON `Order Details`
FOR EACH ROW
BEGIN
    UPDATE Products AS p
    SET  p.UnitsInStock = p.UnitsInStock-NEW.Quantity
    WHERE NEW.ProductId = p.ProductId;
END$$
DELIMITER ;

--Probamos el trigger
/*
 * Como el trigger actúa luego de insertar sobre order details primero necesito una ÓRDEN
*/

INSERT INTO `Order Details` (OrderID, ProductID, UnitPrice, Quantity, Discount)
VALUES (10285, 2, 18.0000, 17, 0.2);

SELECT
    o.OrderID,
    p.ProductID,
    p.UnitPrice,
    p.UnitsInStock,
    od.Discount
FROM Orders as o
INNER JOIN
    `Order Details` AS od ON od.OrderID = o.OrderID
INNER JOIN
    Products AS p ON od.ProductID = p.ProductID
WHERE
    o.OrderID = 10285 AND
    p.ProductID = 2;


/*
Ejercicio 6
--------- -
Crear un rol llamado admin y otorgarle los siguientes permisos: 
    ● crear registros en la tabla Customers.
    ● actualizar solamente la columna Phone de Customers.
*/
CREATE ROLE admin;

GRANT INSERT
ON Customers
to admin;

GRANT UPDATE
(Phone) ON Customers
TO admin;

REVOKE UPDATE
(Phone) ON Customers
from admin;

-- Ver privilegios para el rol admin
SHOW GRANTS FOR 'admin';
