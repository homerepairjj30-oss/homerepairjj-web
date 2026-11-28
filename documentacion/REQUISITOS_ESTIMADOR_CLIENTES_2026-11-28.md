# Estimador público Home Repair JJ — requisitos confirmados 28/11/2026

## Objetivo
El cliente describe por sí mismo una reparación, cambio, reforma o pequeña obra, y recibe en pantalla una **estimación económica orientativa** antes de hablar con Home Repair JJ. La experiencia debe ser visual, cómoda en móvil/tablet y mostrar desglose como la maqueta de presupuestos enseñada por el propietario. No confundir con un presupuesto vinculante.

## Recorrido de cliente
1. Elegir tipo de trabajo: reparación, instalación, sustitución, reforma o pequeña obra/construcción.
2. Describir libremente qué necesita; pedir solo datos relevantes (medidas, cantidades, superficie, estancia, materiales a aportar, ubicación aproximada y acceso) según categoría. Poder añadir fotos de modo voluntario si existe una vía de tratamiento segura.
3. Calcular solo con tarifas publicables autorizadas, cantidades, tiempo de trabajo estimado, materiales pertinentes y desplazamiento cuando proceda. No inventar precios: ante insuficiencia de datos mostrar rango sujeto a revisión o pedir información mínima.
4. Mostrar desglose entendible por el cliente (conceptos, mano de obra y materiales cuando se incluyan), subtotal sin IVA, IVA aplicable solo cuando se conozca correctamente y total orientativo, o rango si el trabajo requiere visita.
5. Avisar claramente: «Estimación orientativa. No constituye un presupuesto cerrado ni una oferta contractual. Precio final sujeto a revisión técnica, medición y materiales».
6. Ofrecer «Enviar mi solicitud» **por correo o WhatsApp**, a elección del cliente, con texto listo para revisar antes del envío. No comunicar datos ni enviar consultas automáticamente; facilitar enlace a privacidad cerca del formulario y consentimiento cuando corresponda.
7. En el futuro conectar al flujo privado del profesional para valorar, revisar y convertir a presupuesto definitivo, sin publicar costes internos ni márgenes.

## Restricciones
- Sin presupuestos falsos ni importes cero usados como precio de venta.
- Mantener separados precios públicos estimados de costes internos, márgenes, descuentos y datos de clientes en app privada.
- Descuentos: no proponer ni aplicar automáticamente.
- Si hay fotos/formularios almacenados, evaluar responsable, proveedor, conservación, seguridad y documentación de privacidad antes de activar la recopilación.
- La primera versión debe probarse en rama `jj-asistente-preview`, no publicarse directamente en `main`.
- Se requieren pruebas de categorías, cantidades, casos incompletos, IVA, privacidad, móvil y llamadas a correo/WhatsApp.

## Estado
Definición funcional confirmada; **no** confundir con implementación o publicación terminada. La rama de pruebas tiene módulos de estimación previos pendientes de integración y revisión con tarifas publicables.


## Estimación condicionada a visita técnica (confirmado por el propietario)
- El cliente solo recibe un precio aproximado para el alcance **y las condiciones declaradas**. Deben indicarse claramente las hipótesis de cálculo.
- Ejemplo: pintura blanca de vivienda de 80 m² con paredes en buen estado; cualquier cifra mostrada es ilustrativa hasta validar precios y mediciones.
- Antes de calcular, consultar estado de superficies: buen estado, grietas/desconchados, humedad, moho o «no lo sé»; documentar otras condiciones según trabajo.
- Al encontrar humedad, desprendimientos, irregularidades u otras patologías, **no incluir automáticamente una reparación desconocida** ni confirmar el precio base. Mostrar «Requiere visita y valoración técnica», e indicar que saneado, tratamiento, preparación, reparaciones y acabado pueden aumentar el presupuesto.
- La visita presencial verifica estado real, dimensiones, accesos, posibles trabajos previos, materiales y condiciones de ejecución.
- Tras la visita, el profesional puede recuperar la solicitud, registrar hallazgos, ajustar cantidades y añadir partidas de reparación con tarifas aprobadas; emitir **presupuesto definitivo para aceptación**. La web no lo convierte por sí sola en precio comprometido.
- Mostrar al cliente algo como: «Estimación basada en los datos proporcionados y suponiendo superficies en buen estado. No incluye humedades, saneamientos ni reparaciones no descritas. El importe definitivo se confirmará tras la visita y evaluación de la obra».
- No tratar «80 m² de vivienda» como «80 m² de pared»: calcular las superficies de pintura con medición o datos adicionales, sin inferencia falsa.
