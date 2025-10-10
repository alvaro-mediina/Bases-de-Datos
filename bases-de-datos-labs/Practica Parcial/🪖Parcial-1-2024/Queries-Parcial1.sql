-- 1. Obtener los usuarios que han gastado más en reservas 
SELECT 
    p.user_id AS `ID_USUARIO`,
    s.name AS `NOMBRE`,
    SUM(p.amount) AS `GASTADO EN RESERVAS`
FROM payments p
INNER JOIN
    users s ON s.id = p.user_id
INNER JOIN
    bookings b ON b.id = p.booking_id
WHERE p.status = 'completed' AND b.status = 'confirmed' -- Importante!
GROUP BY p.user_id
ORDER BY SUM(p.amount) DESC
LIMIT 10;

-- 2. Obtener las 10 propiedades con el mayor ingreso total por reservas 

SELECT
    b.property_id      AS `ID PROP.`,
    SUM(b.total_price) AS `INGRESO TOTAL` -- Asumiendo que el pago es literal y que podría haber descuento
FROM payments p
INNER JOIN
    bookings b ON b.id = p.booking_id
WHERE b.status = 'confirmed' AND p.status = 'completed' -- Importante! 
GROUP BY b.property_id
ORDER BY `INGRESO TOTAL` DESC
LIMIT 10;



-- 3. Crear un trigger para registrar automáticamente reseñas negativas en la tabla de mensajes.
-- Es decir, el owner recibe un mensaje al obtener un review menor o igual a 2. 

DELIMITER //

CREATE TRIGGER bad_review_message
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE master_id INT;
    IF(NEW.rating <= 2) THEN

        SELECT p.owner_id
        INTO master_id
        FROM properties p
        WHERE p.id = NEW.property_id;

        INSERT INTO messages (sender_id, receiver_id, property_id, content, sent_at)
        VALUES (NEW.user_id, master_id, NEW.property_id, "Se recibió una mala review", NOW());
    END IF;

END //

DELIMITER ;

-- DROP TRIGGER bad_review_message;

-- Revisamos las reviews de la propiedad
SELECT
    r.user_id AS `USUARIO`,
    b.property_id AS `PROPIEDAD`,
    r.rating AS `RATING`
FROM bookings b
INNER JOIN
    reviews r ON r.booking_id = b.id
WHERE b.property_id = 1649
ORDER BY b.property_id;

-- Probamos el trigger
INSERT INTO reviews (booking_id, user_id, property_id, rating, comment, created_at)
VALUES (1302, 1737, 1649, 1, 'Estaba todo meado', NOW());

-- Revisamos las reviews de la propiedad
SELECT
    r.user_id AS `USUARIO`,
    b.property_id AS `PROPIEDAD`,
    r.rating AS `RATING`
FROM bookings b
INNER JOIN
    reviews r ON r.booking_id = b.id
WHERE b.property_id = 1649
ORDER BY b.property_id;

-- 4. Crear un procedimiento Crear un procedimiento llamado process_payment que:
-- Reciba los siguientes parámetros: 
-- - input_booking_id (INT): El ID de la reserva. 
-- - input_user_id (INT): El ID del usuario que realiza el pago. 
-- - input_amount (NUMERIC): El monto del pago. 
-- - input_payment_method (VARCHAR): El método de pago utilizado (por ejemplo, "credit_card", "paypal").

-- Requisitos: verificar si la reserva asociada existe y está en estado confirmed.
-- Insertar un nuevo registro en la tabla payments. Actualizar el estado de la reserva a paid.
-- No es necesario manejar errores ni transacciones en este procedimiento.

DELIMITER //

CREATE PROCEDURE process_payment (
                                    in booking_id INT,
                                    in user_id INT,
                                    in amount NUMERIC,
                                    in payment_method VARCHAR(50)
                                )
BEGIN
    -- Verifico si la reserva asociada existe y está en confirmed
    DECLARE reservation_exists BOOLEAN;
    SELECT EXISTS (
        SELECT 1
        FROM bookings b
        WHERE 
                b.id = booking_id AND
                b.status = 'pending'
    ) INTO reservation_exists;
    
    IF reservation_exists THEN
        INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_date, status)
        VALUES (booking_id, user_id, amount, payment_method, NOW(), 'complete');
        UPDATE bookings b
        SET status = 'paid'
        WHERE b.id = booking_id;
    END IF;
END//

DELIMITER ;

-- Verifico
SELECT *
FROM payments p
WHERE p.booking_id = 1302;
