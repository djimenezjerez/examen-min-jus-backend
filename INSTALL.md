# Instalación

## Generar el archivo .env

Copiar el archivo _.env.example_ a _.env_ y mnodificar los datos para la conexión a la base de datos.

## Instalar las dependencias

```sh
yarn install
node ace migration:fresh --seed
```

## Iniciar el servidor API

```sh
yarn dev
```

Se abrirá la API en el puerto 3333.

Las credenciales iniciales por defecto son:
* usuario: _admin_
* password: _admin_
