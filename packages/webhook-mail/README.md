# Bonde Mail README

## Documentation

### Send Mail

Responsible for processing a notification log (`notify_mail`) and sending an SMTP email. Updates the record received successfully for follow-up.

**Endpoint:** `/`

**Request:**
```
{
  event: {
    data: {
      new: {
        email_from: string;
        email_to: string;
        subject: string;
        body: string;
        context: json;
      }
    }
  }
}
```

**Response (200):**
```
{
  message: number;
  mail: number;
  delivered_at: string;
}
```

**Response (400): Email Reject**
```
{
  mode: 'testing'
}
```

## Services

- API-GraphQL
- Data Structure (Notify Mail)
- SMTP

## Getting started

Clone repository:

```
git clone https://github.com/nossas/bonde-redes.git
git checkout tags/v0.2.2
```

Install dependencies and run the local server:

```
cd bonde-redes
pnpm m i --filter webhook-mail
pnpm m run dev --filter webhook-mail
```

Tests:

```
pnpm m run test --filter webhook-mail
```

Clean:

```
pnpm m run lint --filter webhook-mail
```

Build:

```
pnpm m run build --filter webhook-mail
pnpm m run start --filter webhook-mail
```
_________________________________________
<p align='right'>:heart_eyes: Made with love by <b>B</b>onde!</p>