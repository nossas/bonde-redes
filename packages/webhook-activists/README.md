# Bonde Activists README

## Documentation

### Pressure Webhook

From a pressure generated `activist_pressures`, you must create notification to send the email `notify_mail`.

**Endpoint:** `/webhook/pressure`

**Request:**
```
{
  event: {
    data: {
      new: {
        id: number;
      }
    }
  }
}
```

**Response (200)**

## Services

- API-GraphQL
- Data Structure (Notify Mail, Activist Pressure)

## Getting started

Clone repository:

```
git clone https://github.com/nossas/bonde-redes.git
git checkout tags/v0.2.2
```

Install dependencies and run the local server:

```
cd bonde-redes
pnpm m i --filter webhook-activists
pnpm m run dev --filter webhook-activists
```

Tests:

```
pnpm m run test --filter webhook-activists
```

Clean:

```
pnpm m run lint --filter webhook-activists
```

Build:

```
pnpm m run build --filter webhook-activists
```
_________________________________________
<p align='right'>:heart_eyes: Made with love by <b>B</b>onde!</p>