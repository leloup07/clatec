# CLATEC — Puesta en producción (Vercel + Supabase + Stripe)

Guía paso a paso para pasar clatec.consulting del prototipo estático (GitHub Pages) a la aplicación Next.js real.

Las claves se pegan **solo** en los paneles de Supabase, Stripe, Anthropic, Resend y Vercel. No se escriben en el repositorio, que es público.

---

## 0. Qué cambia

| | Hoy (GitHub Pages) | Después (Vercel) |
|---|---|---|
| Intake | No guarda nada | Se guarda en Supabase (`leads` + tablas por tipo de asunto) |
| Chat | Respuestas simuladas | Claude (`claude-opus-5-5`) vía `/api/chat` |
| Pago | Un Payment Link único | Stripe Checkout con importe fijado en el servidor (450 € / 750 €) → KYC → enlace de reserva |
| Panel `/admin` | — | Contraseña comprobada en el servidor y cookie HttpOnly firmada |
| Páginas SEO | `/regulacion-mica/` etc. | Las mismas, servidas desde `public/` |

---

## 1. Supabase (base de datos)

1. Crea una cuenta en https://supabase.com y un proyecto nuevo:
   - **Region:** `Central EU (Frankfurt)` (`eu-central-1`), para mantener los datos en la UE.
   - Guarda la contraseña de la base de datos en tu gestor de contraseñas.
2. En el proyecto: **SQL Editor → New query**. Pega el contenido completo de `docs/clatec-schema.sql` y pulsa **Run**. Debe terminar sin errores.
3. Comprueba en **Table Editor** que todas las tablas muestran el candado de RLS activado. No hay políticas: el navegador no puede leer ni escribir nada, y la app accede solo desde el servidor.
4. Copia estos dos valores (los usarás en el paso 5):
   - **Project Settings → API → Project URL** → `SUPABASE_URL`
   - **Project Settings → API → `service_role` secret** → `SUPABASE_SERVICE_ROLE_KEY`. Es una clave maestra: solo va en Vercel y nunca en el navegador ni en el repositorio.

## 2. Anthropic (Claude)

1. Entra en https://console.anthropic.com con la cuenta del despacho y configura la facturación (**Billing**).
2. **Settings → Limits**: pon un límite de gasto mensual razonable (por ejemplo 50 €) mientras pruebas.
3. **API Keys → Create Key**, con el nombre `clatec-produccion` → `ANTHROPIC_API_KEY`.

Coste orientativo: el chat usa `claude-opus-5-5` (4 $ por millón de tokens de entrada y 20 $ de salida). Un análisis completo de unos 8 intercambios cuesta aproximadamente entre 0,30 y 1 $. La app limita cada conversación a 20 mensajes del usuario.

## 3. Stripe (modo test)

1. Entra en https://dashboard.stripe.com y activa **Test mode** (interruptor arriba a la derecha).
2. **Developers → API keys → Secret key** (`sk_test_…`) → `STRIPE_SECRET_KEY`.
3. El webhook se crea en el paso 6, cuando ya exista la URL de Vercel.

## 4. Resend (avisos por email, opcional)

Sirve para recibir un email en `ADMIN_EMAIL` con cada intake, pago o KYC. Si no lo configuras, la app funciona igual y sin avisos.

1. Crea una cuenta en https://resend.com → **Domains → Add domain** → `clatec.consulting`, región **EU (Ireland)**.
2. Resend te dará unos registros DNS: `resend._domainkey` (DKIM) y `send` (MX y TXT). Añádelos en Cloudflare como **DNS only** (nube gris). No tocan el MX ni el SPF del dominio raíz, así que el correo de Microsoft 365 sigue igual.
3. **API Keys → Create** (permiso *Sending access*) → `RESEND_API_KEY`.

## 5. Vercel

> El plan Hobby de Vercel es solo para uso personal no comercial. CLATEC cobra servicios, así que necesitas el plan **Pro** (20 $/mes).

1. Crea una cuenta en https://vercel.com con **Continue with GitHub**, usando la cuenta `leloup07`.
2. **Add New → Project → Import** el repositorio `leloup07/clatec`.
   - Framework: Next.js (se detecta solo). No cambies los comandos de build.
   - Rama: la que te indique Claude (`app-vercel` para la prueba; `main` cuando se fusione).
3. Antes de pulsar **Deploy**, abre **Environment Variables** y añade (entorno *Production* y *Preview*):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_APP_URL` | De momento, la URL que te dé Vercel (`https://clatec-xxxx.vercel.app`). Tras el cambio de DNS, `https://clatec.consulting` |
| `SUPABASE_URL` | Paso 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | Paso 1 (márcala como *Sensitive*) |
| `ANTHROPIC_API_KEY` | Paso 2 (*Sensitive*) |
| `STRIPE_SECRET_KEY` | Paso 3, `sk_test_…` (*Sensitive*) |
| `STRIPE_WEBHOOK_SECRET` | Paso 6 (de momento déjala vacía y vuelve a ella) |
| `ADMIN_PASSWORD` | Una contraseña nueva de 20 caracteres o más, generada con tu gestor de contraseñas (*Sensitive*) |
| `ADMIN_SESSION_SECRET` | 64 caracteres aleatorios: ejecuta `openssl rand -hex 32` en el Terminal y pega el resultado (*Sensitive*) |
| `CALENDLY_URL` | El enlace de reserva de Calendly o Cal.com que se muestra tras pagar y completar el KYC |
| `ADMIN_EMAIL` | Dirección donde quieres recibir los avisos |
| `RESEND_API_KEY` | Paso 4 (opcional, *Sensitive*) |
| `RESEND_FROM_EMAIL` | `notifications@clatec.consulting` (opcional) |

4. Pulsa **Deploy**. Cuando termine, abre la URL `*.vercel.app`.
5. Cada vez que cambies una variable: **Deployments → ⋯ → Redeploy**.
6. Recomendado: **Firewall → Rate limiting** → una regla para `/api/chat` y `/api/intake` (por ejemplo 20 peticiones por minuto e IP) y otra para `/api/admin/session` (5 por minuto).

## 6. Webhook de Stripe

1. Stripe (en Test mode) → **Developers → Webhooks → Add endpoint**:
   - URL: `https://<tu-url>.vercel.app/api/checkout/webhook` (tras el cambio de DNS, crea otro con `https://clatec.consulting/api/checkout/webhook` y borra este).
   - Eventos: `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
2. Copia el **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET` en Vercel → **Redeploy**.

## 7. Pruebas en la URL de Vercel (antes de tocar el DNS)

- [ ] **Intake:** `/intake` → rellena el formulario y envíalo. Debe aparecer en Supabase, en la tabla `leads`.
- [ ] **Chat:** responde a las dos preguntas iniciales. La respuesta debe ser un análisis real, no un texto fijo. Los mensajes quedan en la tabla `messages`.
- [ ] **Pago (test):** `/consultation` → elige un tramo → tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC. Debe volver a `/kyc` y la fila de `consultation_requests` debe pasar a `paid`.
- [ ] **KYC:** completa el formulario. Debe aparecer el botón con el enlace de reserva.
- [ ] **Panel:** `/admin` → entra con `ADMIN_PASSWORD`. Debes ver el lead, la conversación, el pago y el KYC. Prueba también **Log out**.
- [ ] **SEO:** `/regulacion-mica`, `/mica-regulation-explained`, etc. cargan.
- [ ] **Avisos** (si configuraste Resend): llegan a `ADMIN_EMAIL`.

## 8. Cambio de DNS en Cloudflare (requiere tu aprobación)

Estado actual: los nameservers son de Cloudflare, `clatec.consulting` y `www` apuntan a GitHub Pages con proxy (nube naranja) y el correo es Microsoft 365. **No toques los registros MX, TXT (SPF, `NETORGFT…`) ni los de autodiscover.**

1. **Antes:** Cloudflare → **DNS → Records** → haz una captura de pantalla o **Export** de la zona. Es tu plan de vuelta atrás.
2. Vercel → Project → **Settings → Domains** → añade `clatec.consulting` y `www.clatec.consulting` (con `www` redirigiendo a la raíz). Vercel mostrará los valores exactos que espera. Normalmente son:
   - `A  @    76.76.21.21`
   - `CNAME www  cname.vercel-dns.com`

   Si Vercel muestra otros valores específicos del proyecto, usa los que muestre Vercel.
3. Elige un momento tranquilo. En Cloudflare:
   - Borra los registros `A` (y `AAAA`, si hay) de `clatec.consulting` que apuntan a GitHub (`185.199.108–111.153` / `2606:50c0:…`).
   - Crea `A @ → valor de Vercel` con **Proxy status: DNS only** (nube gris) y TTL Auto.
   - Edita `www`: `CNAME → cname.vercel-dns.com` (o el valor de Vercel), en **DNS only**.
4. Vercel verifica el dominio y emite el certificado en 1–5 minutos. Durante ese rato, la web puede dar un aviso de certificado. Es el único corte previsto y suele durar menos de cinco minutos.
5. Cambia en Vercel `NEXT_PUBLIC_APP_URL=https://clatec.consulting` → **Redeploy**.
6. Crea el webhook de Stripe con la URL definitiva (paso 6) y actualiza `STRIPE_WEBHOOK_SECRET` → **Redeploy**.
7. Repite las pruebas del paso 7 en https://clatec.consulting.
8. GitHub → `leloup07/clatec` → **Settings → Pages** → quita el dominio personalizado y desactiva Pages.

**Vuelta atrás:** restaura en Cloudflare los registros de la captura del punto 1. GitHub Pages sigue sirviendo el prototipo mientras no lo desactives (punto 8).

## 9. Paso a real (cuando las pruebas estén validadas)

1. Stripe: desactiva Test mode → **API keys** → `sk_live_…` → `STRIPE_SECRET_KEY` en Vercel. Crea un webhook *live* con la misma URL y eventos y actualiza `STRIPE_WEBHOOK_SECRET`. Después, **Redeploy**.
2. Haz un pago real de prueba y reembólsalo desde Stripe.
3. Revisa la política de privacidad (`/legal`): ahora intervienen como encargados del tratamiento Anthropic (EE. UU.), Vercel, Supabase (UE), Stripe y Resend.

## 10. Mantenimiento

- **Rotar la contraseña del panel:** cambia `ADMIN_PASSWORD` en Vercel → Redeploy. Para cerrar todas las sesiones abiertas, cambia también `ADMIN_SESSION_SECRET`.
- **Cambiar el modelo de Claude:** variable `ANTHROPIC_MODEL` (por defecto `claude-opus-5-5`).
- **Gasto de Claude:** console.anthropic.com → **Usage**.
