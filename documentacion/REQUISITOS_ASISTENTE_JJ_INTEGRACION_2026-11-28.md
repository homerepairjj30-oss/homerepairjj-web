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
