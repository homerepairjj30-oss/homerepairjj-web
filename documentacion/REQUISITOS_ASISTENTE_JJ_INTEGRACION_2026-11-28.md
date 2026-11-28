# Requisitos de voz de JJ y continuidad de presupuestos — 28/11/2026

**Estado:** pedidos por el usuario; NO se declara que estas órdenes funcionen aún. Documento añadido como requisito persistente para no perder decisiones anteriores.

## Órdenes de voz expresas
- «JJ, hazme un presupuesto» → iniciar un presupuesto nuevo, preguntar solo los datos imprescindibles, aceptar dictado de cliente, partidas, unidades/cantidades y materiales, y aplicar **tarifas aprobadas** del catálogo vigente. Calcular tiempo previsto, subtotal sin IVA, descuentos y total con IVA según reglas del documento.
- «JJ, cámbiame este presupuesto» / «Modifica el presupuesto [número]» → localizar el presupuesto existente y **editarlo conservando su número**; no crear duplicado. Recalcular cantidades, tiempo, descuento, IVA y totales; dejar trazabilidad de cambios.
- «JJ, este presupuesto cámbiamelo a factura» / «Convierte el presupuesto [número] en factura» → seleccionar el documento correcto, mostrar importes y situación de cobros, pedir confirmación explícita antes de emitir factura, asignar numeración independiente de facturas y enlazarla al presupuesto de origen. No generar duplicados por repetición o error de voz.
- «JJ, búscame el presupuesto [número / cliente / trabajo]» → búsqueda por número, cliente, obra o palabras relevantes, recuperar y mostrar el documento; preguntar cuál si hay varios coincidentes. Permitir abrir, revisar, modificar, convertir o compartir con control de permisos.
- Estas expresiones son ejemplos; reconocer formulaciones equivalentes y lenguaje conversacional. Si el reconocimiento es ambiguo, confirmar el dato relevante antes de alterar documentos.

## Reglas de cálculos y tarifas acordadas
- Usar catálogo vigente y personalizaciones conservadas, con unidad de medida correcta y tiempo estimado de trabajo; no inventar tarifas ausentes ni sustituir cambios más recientes por valores antiguos.
- Desglosar partidas y cantidades, **IVA automático** al final conforme a la opción y tipo aplicable al documento, con subtotal sin IVA, descuento autorizado calculado de forma transparente, base imponible, cuota de IVA y total.
- Descuento: indicar valor en € o %, recalcular correctamente bases e IVA; reflejar márgenes, costes y límites seguros cuando el sistema disponga de datos fiables. Pedir confirmación antes de aplicar descuentos que afecten a un documento emitido.
- Cualquier edición debe persistir de verdad; no duplicar presupuestos, facturas, recordatorios ni cobros por errores de reconocimiento de voz.
- Mantener números de presupuesto y factura separados, no reiniciarlos o reasignarlos al editar; cuidar PDF y firma, estado de aceptación y anticipos/parciales.

## Diferencia entre Android y web pública
- **Aplicación Android de José:** las funciones de buscar, editar y convertir presupuestos/facturas corresponden al asistente de gestión autenticado y deben verificarse por voz y por interfaz.
- **Asistente en página web pública:** el cliente puede escoger trabajos, consultar una estimación basada solo en precios autorizados y enviar solicitud por correo o WhatsApp. NO debe poder buscar presupuestos privados, editar documentos de otros clientes ni emitir facturas sin autenticación y autorización explícitas.
- Sincronización de catálogo app–web pendiente de implementar y comprobar; web pública no cambia hasta pruebas y permiso para publicar.

## Pruebas de aceptación por realizar
1. Crear presupuesto mediante voz con 2 partidas y tiempos; validar IVA y descuento.
2. Encontrarlo por número y nombre sin mostrar otro documento.
3. Dictar un cambio de cantidad o precio permitido y verificar que conserva el número y no genera duplicado.
4. Convertir a factura con confirmación; numeración de factura independiente, relación con presupuesto y total correcto.
5. Repetir orden o interrumpir voz: sin facturas ni documentos duplicados.
6. Reabrir app y comprobar persistencia, exportación PDF, cobros y estado.
7. En web, confirmar que usuarios públicos no acceden a información interna.

## Continuidad
Incluir estos requisitos en el historial desde el origen; contrastar implementación con fuente Flutter 1.2.34+70 y las conversaciones/ZIP anteriores. Documento de requisitos, no confirmación de función implementada.


## Envío elegido por voz y seguimiento comercial — petición del 28/11/2026
- JJ debe ofrecer **correo electrónico o WhatsApp** al compartir un presupuesto o factura. Si José no ha indicado el canal, debe preguntárselo; si dice «envíaselo por WhatsApp» o «por correo», utilizar el elegido y mostrar destinatario/documento antes de enviarlo. Conservar la posibilidad de escoger ambos canales.
- Después del envío, registrar en la ficha del documento el **canal**, fecha/hora, destinatario o referencia de contacto y resultado verificable del intento, evitando duplicar envíos por reintentos o instrucciones repetidas. No afirmar «enviado» si solo se ha abierto WhatsApp/correo con un mensaje preparado: confirmar cuando el canal o proveedor permita comprobarlo.
- Cada presupuesto debe tener seguimiento: **borrador, pendiente de envío, enviado, pendiente de respuesta, aceptado, rechazado**; cuando proceda, caducado y convertido en factura. Mantener fecha de cambio, notas e historial de estados, y permitir corregir un estado manualmente.
- Vista de resumen con **número de presupuestos creados, enviados, pendientes de respuesta, aceptados y rechazados**, importes por estado y tasa de aceptación con denominador claramente indicado; filtros por fechas, cliente, canal y estado. Un documento no se contará dos veces por reenvíos.
- Alertas de seguimiento configurables: presupuestos enviados sin respuesta, próximo contacto, avisos para consultar al cliente; permitir al usuario reprogramarlos sin crear recordatorios duplicados.
- Distinguir claramente **envío, entrega, apertura/lectura y aceptación**. Solo informar apertura o lectura si existe un mecanismo legítimo y verificable (por ejemplo, enlace de seguimiento autorizado y correctamente configurado); un mensaje preparado de WhatsApp o correo no garantiza ni entrega ni lectura. Aceptación/rechazo requieren confirmación documentada o registro manual.
- Mostrar a José el estado en lenguaje normal y permitir consultas por voz como «JJ, ¿cuántos presupuestos he enviado este mes?», «¿cuántos me han aceptado?» y «¿cuáles siguen pendientes?».
- En la web pública, el cliente podrá solicitar valoración o presupuesto por correo o WhatsApp; las cifras de seguimiento, los documentos y los datos personales de clientes solo se verán en el entorno privado y autenticado de José, no en páginas abiertas.

**Estado real:** estos son requisitos acordados, NO funciones certificadas en esta sesión. Queda pendiente inspeccionar la implementación de Flutter y la maqueta web, ejecutar pruebas completas de ambos canales y verificar qué eventos de seguimiento están técnicamente disponibles.

## Informe hablado de presupuestos — requisito específico confirmado 28/11/2026
- José puede preguntar de forma natural por voz: «JJ, ¿cómo vamos de presupuestos?», «¿Cuántos se han aceptado?», «¿Cuántos se han rechazado?» y «¿Cuántos quedan pendientes?».
- JJ consulta los **documentos reales guardados**, computa el número de presupuestos **aceptados, rechazados y pendientes** y la **suma en euros de los importes de cada categoría**, y **responde automáticamente en voz alta**, no solo con una pantalla o tabla.
- Ejemplo **ficticio, jamás mostrarlo como información real**: «Tienes cinco presupuestos aceptados por 20.000 euros, tres rechazados por 5.000 euros y dos pendientes por 2 euros en total».
- Permitir «este mes», «esta semana», «este año» o «desde siempre»; si no indica periodo, usar un periodo predeterminado claramente declarado o pedirlo si es imprescindible. Mostrar además los mismos datos en una vista resumida opcional, sin que sustituya a la respuesta de voz.
- Evitar duplicados, contar cada presupuesto una vez conforme a su estado actual y asegurar que una conversión a factura no se cuente como presupuesto nuevo. Definir explícitamente si se suman importes con IVA o sin IVA; por defecto explicar la base usada y permitir consulta alternativa. No mezclar presupuestos con facturas ni importes cobrados con aceptados.
- Si falta una fecha, estado o importe válido, señalarlo y no inventar ni atribuir cifras de prueba. Respetar acceso privado/autenticación y privacidad de datos.
- **La función se solicita para el JJ de gestión de la aplicación**, no para revelar información empresarial en el asistente público de la web. La integración futura solo podrá utilizar datos privados con autenticación y permisos explícitos.
- Pruebas necesarias: conjunto simulado de 5 aceptados (20.000 €), 3 rechazados (5.000 €) y 2 pendientes (1 € cada uno): respuesta oral esperada **5, 3, 2; 20.000 €, 5.000 €, 2 €**, respectivamente. Luego validar con datos reales en Android, voz, filtros temporales y cambios de estado.
- Estado: **acordado y registrado, no verificado como implementado**.

## Notificaciones a la aplicación Android desde el asistente público web — 28/11/2026
- **Petición expresa:** cuando un visitante de homerepairjj.es use JJ para solicitar presupuesto de algún trabajo, la aplicación privada Home Repair JJ de José debe recibir una notificación con el tipo de trabajo, resumen de lo solicitado, fecha/hora y datos de contacto **solo si la persona los ha facilitado voluntariamente**.
- También se solicita conocer el uso del asistente web, incluso si un visitante estuvo seleccionando servicios o haciendo pruebas sin llegar a solicitar presupuesto. Diferenciar **visita anónima**, **interacción con JJ**, **solicitud iniciada** y **solicitud enviada correctamente**; no identificar a personas que no se han identificado ni afirmar que quieren presupuesto solo por navegar.
- Mantener una bandeja de **solicitudes web** dentro de la app con estado «nuevo», «contactar», «en seguimiento», «presupuestado», «cerrado» y acceso a crear un presupuesto privado conservando el origen de la solicitud. Evitar duplicados por recarga o reintento, y permitir marcar notificaciones como leídas.
- Para reducir ruido, permitir resumen agregado de visitas o interacciones anónimas (si se recopilan con los permisos y transparencia aplicables) y alertas individuales solo para solicitudes efectivamente enviadas; frecuencia de alertas configurable.
- Propuesta de notificación **ilustrativa, no dato real**: «JJ Web: nueva solicitud de presupuesto. Sustitución de mampara de baño. Contacto facilitado: correo electrónico. Abrir solicitud».
- La arquitectura necesita un servicio backend confiable, autenticación de José, permisos de notificaciones Android, entrega fiable y reintentos; la web pública **no** debe tener credenciales privadas ni enviar directamente avisos con acceso a la base de clientes.
- Cumplir privacidad y normativa aplicable: informar del tratamiento de solicitudes y, cuando corresponda, del análisis de uso; minimizar datos, mantener controles de acceso y aplicar consentimiento cuando sea exigible. No implementar seguimiento invasivo o identificación oculta.
- **Criterio de aceptación:** enviar una solicitud de prueba desde la rama web de pruebas; verificar registro único, aviso en Android, detalles correctos, seguimiento y reintento sin duplicación. Probar con app abierta, cerrada y sin conexión.
- **Estado actual:** requisito acordado y documentado, NO integrado ni probado; la web pública sigue sin modificaciones.

## Captación de interesados que usan JJ pero no terminan solicitando presupuesto (28/11/2026)
- Solicitud expresa: no limitar el seguimiento a presupuestos aceptados/rechazados ni a solicitudes enviadas. Considerar **posibles clientes que interactúan con JJ y abandonan sin decidirse**.
- Durante la conversación o al finalizar una estimación, JJ debe ofrecer una opción amable y no obligatoria: «¿Prefieres que te contactemos para asesorarte? Puedes dejarnos teléfono para llamada o WhatsApp, correo electrónico, o continuar sin dar tus datos». Permitir elegir canal, consultar presupuesto o solicitar visita personal.
- Si el visitante **deja voluntariamente un medio de contacto y solicita seguimiento**, guardar una oportunidad de venta en la bandeja privada de José con servicios consultados, estado «interesado, sin presupuesto», canal elegido y permiso/preferencia de contacto. Notificar en la app aunque no se haya generado presupuesto.
- Si el visitante **no proporciona datos ni autoriza contacto**, no se puede identificar ni contactar a esa persona. Se podrán obtener métricas agregadas de uso del asistente conforme a la información y consentimientos aplicables, pero nunca inventar identidad, teléfono o correo. No convertir actividad anónima en una solicitud confirmada.
- Los visitantes podrán elegir expresamente no ser contactados; no bloquear el uso del asistente ni insistir repetidamente. Presentar aviso de privacidad, finalidad de contacto, conservación limitada y control para retirar la solicitud.
- Bandeja separada de «interesados sin presupuesto» y «solicitudes de presupuesto enviadas»; filtros, avisos configurables y seguimiento sin duplicados. No mezclar las tasas de aceptación con meros interesados.
- Pruebas pendientes: interesado que deja correo y pide asesoramiento -> notificación y oportunidad privada; interesado que elige WhatsApp -> respetar canal; visitante anónimo sin datos -> solo estadísticas admisibles y ningún contacto personal. Verificar consentimiento, permisos, privacidad, entrega y reintentos.
- Estado: requisito registrado, **aún no implementado ni probado** en la aplicación o web pública.
