_Diseño de Entidad Relación y pasaje a tablas_

# 🎯 Objetivos principales del capítulo
- **[[#🧍‍♂️ Conjuntos de entidades]]**: modelado de entidades y relaciones con toma de buenas decisiones de diseño. 
- [[#🗣️ Traducción de modelos de entidad]]]: relación a esquemas relacionales.

---
# 🧍‍♂️ Conjuntos de entidades
- Una *entidad* es un objeto que existe y es distinguible de los otros objetos.
- Las entidades tienen *atributos*.
- Un *conjunto de entidades (CE)* es un conjunto de entidades del mismo tipo (i.e. Con los mismos atributos) que comparte las mismas propiedades.

# 🏷️ Atributos
Al conjunto de valores permitidos para cada atributo se le llama *dominio*.

## Clasificaciones de los atributos
- Atributos *simples* y *compuestos*: Es evidente la definición.
	- Atributos *compuestos*: Se descomponen en uno o más atributos simples.
	- Atributos *simples*: No se descomponen en más atributos.
- Atributos *multivalorados*: Pueden tomar 0 o muchos valores.
- Atributos *univalorados*: Sólo toman 1 valor.
- Atributos *no derivados*: No se computan de otros atributos
- Atributos *derivados*: Pueden computarse de otros atributos.

# 🔑 Claves
*Definiciones de superclave, clave y clave candidata*

- Una *superclave* de un CE es un conjunto de uno o más atributos cuyos valores unívocamente determinan cada entidad.
- Una *clave candidata* (CC) de un CE es una superclave minimal (i.e. si se quita atributo dejamos de tener superclave).


**Dato importante**
> Aunque varias claves candidatas pueden existir, una de las claves candidatas es seleccionada para ser la clave primaria.

# Modelado ER
*Propósito:* Diagramar conjuntos de entidades con sus atributos

![[Pasted image 20250825150650.png]]


# Conjunto de relaciones
- Una *relación* es una asociación entre varias entidades.
- Un *conjunto de relaciones (CR)* es una relación matemática entre $n\geq2$ conjunto de entidades.
$$
{(e_1,e_2,...,e_n) | e_1 \in E_1, e_2 \in E_2, ... , e_n \in E_n}
$$
donde $(e_1 , e_2 , …, e_n )$ es una relación.

- Un *atributo* puede ser también una *propiedad* de un conjunto de relaciones.

# Correspondencias de cardinalidades
Sean $E_1$ y $E_2$ conjuntos de entidades y $R$ conjunto de relaciones entre $E_1$ y $E_2$.

- Si tenemos **E1 R -- E2** (línea de R a E2) esto *significa que a cada entidad de E1 le corresponde por R varias entidades de E2* (precisamente: 0 o más entidades)
- De manera similar se define E1 -- R E2.

- Si tenemos **E1 R $\longrightarrow$ E2** (flecha de R a E2) esto *significa que a cada entidad de E1 le corresponde por R como mucho una entidad de E2* (precisamente: 0 o 1 entidad)
- De manera similar se define E1 $\longleftarrow$ R E2.


Entonces tenemos *4 combinaciones* posibles de líneas y flechas (llamadas correspondencias de cardinalidades):

- E1 – R – E2: varios – varios
- E1 $\longleftarrow$ R $\longrightarrow$ E2: uno – uno
- E1 – R $\longrightarrow$ E2: varios – uno 
- E1 $\longleftarrow$ R – E2: uno – varios

## En las relaciones
![[Pasted image 20250825152839.png]]

# Formas de participación de CE en CR
![[Pasted image 20250825153020.png]]

- *Participación total*: (indicada por línea doble) toda entidad en el conjunto de entidades participa en al menos una relación en el conjunto de relaciones.
- *Participación parcial*: (indicada por una sola línea) algunas entidades no participan en alguna relación en el conjunto de relaciones.


# Notación alternativa
**Correspondencia para cardinalidades**

- Notación de intervalos: Usar $[a..b]$ ó $[a..*]$
- Con esta notación se puede expresar participación total y parcial.

![[Pasted image 20250825153409.png]]

**Ejemplo**
*Reflejar la siguiente situación usando notación de intervalos: en varios países árabes un hombre puede casarse con hasta 4 mujeres.*

![[Pasted image 20250825153514.png]]

# Roles
- Cuando los CE en un CR, son iguales, cada ocurrencia en el CE juega un *rol* en el CR.
- Las etiquetas "course_id" y "prereq_id" en *prereq (correlatividades)* son llamadas *roles*.

![[Pasted image 20250825153717.png]]

# Razones para tener diseño ER y relacional
![[Pasted image 20250825153758.png]]

---
# 🗣️ Traducción de modelos de entidad
En la práctica se utilizan *esquemas relacionales* y NO *esquemas de ER*, por eso es importante traducir de modelos de ER a modelos relacionales.
- Hay *reglas de traducción* que son útiles.
- Pero dichas *reglas* no contemplan todos los casos
- Vamos a estudiar *Reglas de traducción automáticas*

## Reducción a esquemas relacionales
Además de los esquemas de relación obtenidos por la traducción automática, se necesita obtener:
- *Claves primarias:* Para esto se usa la información de claves primarias de CE.
- *Restricciones de clave foránea:* Para esto se usa el tipo de elemento de modelo ER a mapear (p.ej. CR, CE débiles, atributo multivalorado, etc.).

### Ejemplos

*Primer tipo de ejemplo*

![[Pasted image 20250825155755.png]]


>[!Note] # Regla
> Un CE fuerte que **no involucra atributos compuestos ni atributos multi-valorados** se mapea a un esquema relacional con los mismos atributos.
> - La clave primaria del CE se convierte en la clave primaria del esquema relacional.

*Vamos con un tipo de ejemplo:*

![[Pasted image 20250825160007.png]]

*Ahora vamos con otro tipo de ejemplo:*
![[Pasted image 20250825160126.png]]
*Aclaración:* Cada valor del atributo multivalorado mapea a una tupla separada
en la tabla del esquema `Libro-autor`.

>[!Danger] Atributos derivados
> *Decisión:* Los atributos derivados no son explícitamente representados en el modelo de datos relacional.
> - Se verá que si se los necesita una forma de computarlos es por medio de consultas.

Vamos ahora con el siguiente ejemplo:
![[Pasted image 20250825160607.png]]

![[Pasted image 20250825160636.png]]

>[!Danger] Regla CR1:
>### La Traducción de una Relación N:M 
>La regla establece que para traducir una relación N:M, debes seguir estos tres pasos:
>1. **Crear una nueva tabla 📜**: Debes crear una tabla intermedia que represente la relación. El nombre de esta tabla debe ser significativo (por ejemplo, `Inscripciones` para una relación entre `Alumnos` y `Cursos`).
>2. **Añadir las claves primarias**: Los atributos de esta nueva tabla serán las **claves primarias** de las dos tablas que se están relacionando. Juntas, estas dos claves forman la **clave primaria compuesta** 🔑 de la nueva tabla.
>3. **Añadir atributos descriptivos**: Si la relación tenía atributos propios (como una "nota" 📝 o una "fecha" 📅), estos también se añaden como columnas en la nueva tabla.


>[!Danger] Regla CR2:
>### La Traducción de una Relación 1:N
> La regla es más simple que la anterior. A diferencia de las relaciones N:M, aquí no es necesario crear una nueva tabla. La forma correcta de representar esta relación es **añadiendo una clave foránea** en la tabla del lado "muchos" que apunte a la tabla del lado "uno".

## Caso de estudio para CR2

A continuación vamos a estudiar en el caso de *¿Cómo traducir a un esquema relacional un CR varios uno donde del lado varios no es participación total?* Ya que
- Si la *participación es parcial* en el lado varios, aplicar la regla CR2 puede resultar en valores nulos.
- Los **valores nulos significan**:
	- el valor no existe; o el valor existe, pero no lo sabemos; o no sabemos si el valor existe.
	- Aquí no usamos valores nulos en un sentido tan amplio, solo en el sentido que el valor no existe.

**Problema**: Si usamos la traducción de CR2, la clave foránea va a ser inválida (para los valores nulos de dept_name en la traducción de instructor).
- Como *dept_name* es una clave primaria del departamento, significa que en departamento este atributo no puede tener valores nulos.

**Solución**
- Inst-dept = (ID, deptName)
- Instructor =(ID,name, salary) 
- Department =(dept_name, building, budget) 
- For Inst_dept foreign key ID references Instructor
- For Inst_dept foreign key dept_name references Department

**Aclaraciones**
- Como ID es clave primaria, el valor de ID determina unívocamente el valor de dept_name. Luego se respeta la condición: varios – uno.
- Por otro lado, nunca se usan valores nulos para dept-name; luego no tenemos los problemas de la filmina anterior. Además, se respeta la participación parcial de instructor en departamento.


## Caso de estudio para CR2
Tenemos la siguientes traducciones:
- Decano = (*DNI*, nombre, nombreFacultad, universidad)
- Facultad = (*nombre*, *universidad*)
- For Decano foreign key nombreFacultad, universidad references Facultad (nombre, universidad)

- Decano = (DNI, nombre)
- Facultad = (nombre, universidad, DNI)
- For Facultad foreign key DNI references Decano

**Aclaración**
- Las dos alternativas cumplen las restricciones de integridad del DER
- Una facultad puede tener dos decanos (diseño de arriba),
- una persona puede ser decano de dos facultades (diseño de abajo)
- Ambos diseños son ineficientes en términos de almacenamiento.
- Buscamos resolver esas ineficiencias.

### Soluciones alternativas que resuelven problemas
Decano = (*DNI*, nombre, nombreFacultad, universidad)
*Aclaración*: Facultad no hace falta por tener sus atributos en decano. Al sacar Facultad no hace falta la clave foránea
Facultad = (*nombre*, *universidad*, DNI, nombreDecano)
*Aclaración*: una tabla para decano no hace falta por tener sus atributos en facultad. Al sacar decano, no hace falta la clave foránea.
• El problema de que facultad puede tener dos decanos no se puede resolver, o porque hay que decir que nombreFacultad y universidad son clave candidata. o De ultima poner en español eso.

>[!Info] Parciales o Finales
>Los ejercicios 1 y 2 son ejemplos de ejercicio para parcial o final, donde tienen que:
>-  Llegar a una traducción que cumpla restricciones de integridad del DER
>- Que sea eficiente (para consultas y almacenamiento) y
>- Que sea adecuada desde el punto de vista lógico. 

