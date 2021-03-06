(Espero no olvidarme nada)

Para levantar server local
--------------------------

```bash
$ git clone git@github.com:TiX-measurements/tix-api-deploy.git
$ cd tix-api-deploy
```

Editar docker-compose.yml para cambiar
    *image: mysql*
por
    *image: mysql:5.5*
Poner dump en la carpeta especificada (/storage/docker/sql-dump o podés cambiarla).

```bash
$ docker-compose up [-d]
```

Ojalá funcione. -d para que se detachee.
Una vez levantado y corriendo podés probar haciendo requests,
y después vamos a modificar el admin para que tenga la pass que querramos

$ docker run -it --link test-mysql:mysql --net tix-api-deploy_default --rm mysql sh -c 'exec mysql -u"root" -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD" -P"3306" -h"test-mysql"'(1)
Enter password: root
mysql> use tix;
mysql> UPDATE user SET password="3ijxvtFepHZ6QkpwPS0eT5A2rbfkB8zeKRqL/UoxVrCHln2MGvnRnKfP1AkIY0N/eTV9/9MXr3kjz09RZWY4Kw==" WHERE username="admin";
mysql> UPDATE user SET salt="3czl3RBrkcNT/6W5NhfO7BP8jCtf1b1YBuF6dtRf/kSoEaWWnnZOVb+N2Q6VnUBl1rgEMItnBvWpWqhIV8gHXQHy30Sz75Ek12CN2xqQAoCQUnt5kYjMpI2h/Bqpv/ctjNI+67LaCHeqz4Tt4nsy0sR9qvDAKGhRsSicoJQE" WHERE username="admin";
(password = 'lapasguor')

(1) Si no importa el dump por algun motivo raro: cat tixdump.sql | docker exec -i test-mysql mysql -u"root" -p"root" tix para importarlo a mano.
(2) Si tira error de Autenticacion al levantar la api, realizar el siguiente comando en la consola mysql: ALTER USER tix IDENTIFIED WITH mysql_native_password BY 'tix'; (Esto solo sucede con la version mysql >8)

## Versión desde Docker Hub (no funcionan un par de cosas)

De ahora en más desde la carpeta tix-api-deploy/ correr `docker-compose up [-d]`

## Versión desde el repo

Hecho lo anterior para la primera corrida, frenar el docker-compose y

```bash
$ docker-compose up mysql tix-iptoas
$ cd ..
$ git clone git@github.com:TiX-measurements/tix-api.git
$ cd tix-api
$ docker build -t tix-api-local .
$ docker run --network tix-api-deploy_default -it tix-api-local        (3)
```

Ahora hay que averiguar la IP del contenedor...

```bash
$ docker ps
$ docker inspect [nombre del contenedor] | grep IPAddress
```

... y ponerla con puerto 3001 en *TiX-web-T3/src/utils/fetch.js*. Ejemplo:
```javascript
    ...
    const fullUrl = `http://172.18.0.3:3001/api${url}`;
    ...
```

(3) Tal vez el nombre de red sea otro; chequear con `docker network ls`.

Para levantar ambiente de desarrollo de tix-web
-----------------------------------------------

(No sé si antes tendrías que borrar algo que ya tenés.)

$ cd TiX-web-T3
$ git pull origin master
$ npm install
$ npm install nodemon
$ npm run dev

La webapp se levanta en el puerto 3050, con versiones estáticas de los recursos.
Al editar algo se debería refreshear en el browser.
