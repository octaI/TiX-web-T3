Things to fix
=============

* Al registrarse correctamente, redirigir al login
* Falta devolución de error en varios lados
* RecoverView redefine clase HomeView (cambiarle al nombre correcto)
* Tiene sentido que "Reporte de usuario" esté en la sección "Configuración"?
* Poder modificar la escala de los gráficos; que las fechas aclaren el año
* Al cambiar entre isp's, queda el gráfico (o falta de él) del anterior
* Mensajes de error si los filtros son inválidos (e.g., fecha inicio >= fecha final)
* Filtros de reportes: Opción "Todos" (días de la semana) no parece funcionar como debería
* Abstraer host:port address
* Los gráficos muestran el rango que tiene datos, en vez de todo el rango elegido
* Filtros de reporte: mostrar por default el último buscado
* Aclarar que el instalador es para Debian-based
* Page title dice "Tix App" en vez de "TiX App"
* Si se carga la página de una instalación distinta a la idx 0, igual aparece la 0 desplegada
* Installation graphs: Al cambiar el rango (incluso con el botón) se olvida de la opción up/down-stream

Solved?
-------

* Lista de Panel de Admin en sidebar no queda desplegada : (mc) ahora siempre abierta



### Cosas para hablar con tix-backend:

- Endpoint en backend con la fecha del último dato para cierto usuario+instalación+isp
- Tema de errores en listado de impersonalización
