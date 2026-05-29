# Estado actual 29-05

- Actualmente el backend es simple y funcional(hasta por ahi)

* Tiene endpoints acordes al crud de datos (productsRoutes)
* Valida estos datos, crea los productos, los edita, elimina y lista
* Los endpoint estan en /api/products
* La DB guarda los productos en la tabla products, con las columnas que tiene productsInterface

# Como va a funcionar la APP en un principio

1. El Login y un Menú Desplegable:
   Cuando el usuario pone su email y contraseña en el front, el backend valida que sea correcto y hace esta consulta:
   - SQL SELECT id_local, locales.nombre, rol FROM usuarios_locales JOIN locales ON usuarios_locales.id_local = locales.id WHERE id_usuario = ?;
   - asi la db devuelve una lista de los locales donde trabaja el usuario y su rol en c/u

2. Cambiar de Local en el Frontend:
   - Cuando el usuario selecciona "LOCAL A", guardo el id_local de LOCAL A en la app. A partir de ese momento, cada petición HTTP que haga el frontend a el backend debe incluir ese id_local.

3. (Middleware de Autorización):
   - Cuando llegue una petición para, por ejemplo, POST /api/products (crear un producto) acompañada del header x-local-id: 1 (LOCAL A):

   - El backend agarra el id_usuario (del token JWT) y el id_local (del header).

   - Primero se fija: ¿El usuario es es_superadmin = true? Si lo es, lo deja pasar directamente.

   - Si no, hace una consulta rápida a la tabla usuarios_locales:
     - "Buscame si el usuario X está en el local 1 y qué rol tiene".
       - Si no existe la fila: Devuelve un 403 Forbidden (No perteneces a este local).
       - Si existe analiza las reglas de negocio para los empleados.
   - Si el rol es 'jefe': ¡Adelante! Se procesa la creación del producto.

# Pasos 1.0

- ✅ Modificar la DB para que pueda guardar USUARIO
  - Se va a crear una tabla de usuario, donde cada usuario va a tener:
    - Tabla usuarios
      - id (PK)
      - email (Único)
      - password
      - nombre, apellido, telefono...
      - superadmin (Booleano: true para mi, false para el resto).

- ✅ Modificar la DB para que pueda guardar LOCALES (puntos de ventas o depositos)
  - Se va a crear una tabla de Local, donde cada local va a tener:
    - Tabla Locales
      - id (PK)
      - nombre
      - ubicacion, telefono ...
      - FUTURO OPCIONAL DE CADENAS QUIZAS

- ✅ Modificar la DB para que un usuario pueda ser "Dueño" de ese local y "empleado" de otro
  - Se va a crear una tabla relacional de Usuarios y Locales( para que un usuario pueda estar en varios locales)
    - Tabla usuarios_locales
      - id (PK)
      - id_usuario (FK -> usuarios.id)
      - id_local (FK -> locales.id)
      - rol (ENUM: 'jefe', 'empleado')
      - (Unique Constraint): id_usuario + id_local debe ser única.

- ✅ Modificar la DB para que los productos tengan ID_LOCAL, osea que cada producto pertenece si o si a un local

# Pasos 1.1

- ✅Crear un endpoint para hacer sign-up
  - ✅ por ahora simplemente vamos a crear un endpoint que guarde en la db los datos nuevos, verificando que no se repita el email con uno ya existente
  - En un futuro deberia poderse poner un codigo de local, el cual seria una especie de invitacion para que ese usuario empieze a perteneces a un local

- Crear un endpoint para hacer log-in
  - ✅ por ahora simplemente se va a matchear email y password
  - Los JWT se van a manejar de una forma precaria al principio
