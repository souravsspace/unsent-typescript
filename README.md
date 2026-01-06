# @unsent/sdk SDK

The official TypeScript SDK for the Unsent API. Send transactional emails, manage contacts, campaigns, and more with ease.

## Prerequisites

- [unsent API key](https://app.unsent.dev/dev-settings/api-keys)
- [Verified domain](https://app.unsent.dev/domains)

## Installation

### NPM

```bash
npm install @unsent/sdk
```

### Yarn

```bash
yarn add @unsent/sdk
```

### PNPM

```bash
pnpm add @unsent/sdk
```

### Bun

```bash
bun add @unsent/sdk
```

## Usage

### Basic Setup

```typescript
import { unsent } from "@unsent/sdk";

const client = new unsent("un_xxxx");
```

### Environment Variables

You can also set your API key using environment variables:

```typescript
// Set UNSENT_API_KEY in your environment
// Then initialize without passing the key
const client = new unsent();
```

### Emails

#### Send Email

```typescript
const { data, error } = await client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "unsent email",
  html: "<p>unsent is the best email service provider</p>",
  text: "unsent is the best email service provider",
});

if (error) {
  console.error("Error:", error);
} else {
  console.log("Email sent! ID:", data.id);
}
```

#### Get Email

```typescript
const { data, error } = await client.emails.get("email_id");
```

#### Send Batch Emails

```typescript
const emails = [
   { to: "user1@example.com", from: "hello@company.com", subject: "Hi", html: "<p>Hi</p>" },
   { to: "user2@example.com", from: "hello@company.com", subject: "Hello", html: "<p>Hello</p>" }
];

const { data, error } = await client.emails.batch(emails);
```

#### Schedule Email

```typescript
const { data, error } = await client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "Scheduled email",
  html: "<p>This is scheduled</p>",
  scheduledAt: "2024-12-25T10:00:00Z",
});
```

#### Cancel Scheduled Email

```typescript
const { data, error } = await client.emails.cancel("email_id");
```

### Contacts

#### Create Contact

```typescript
const { data, error } = await client.contacts.create("contact_book_id", {
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  metadata: { role: "Admin" }
});
```

#### List Contacts

```typescript
const { data, error } = await client.contacts.list("contact_book_id", {
  page: 1,
  limit: 20,
  emails: "user@example.com",
  ids: "id1,id2"
});
```

#### Get Contact

```typescript
const { data, error } = await client.contacts.get("contact_book_id", "contact_id");
```

#### Update Contact

```typescript
const { data, error } = await client.contacts.update("contact_book_id", "contact_id", {
  firstName: "Jane"
});
```

#### Upsert Contact

```typescript
const { data, error } = await client.contacts.upsert("contact_book_id", "contact_id", {
  email: "user@example.com",
  firstName: "John"
});
```

#### Delete Contact

```typescript
const { data, error } = await client.contacts.delete("contact_book_id", "contact_id");
```

### Contact Books

#### List Contact Books

```typescript
const { data, error } = await client.contactBooks.list();
```

#### Create Contact Book

```typescript
const { data, error } = await client.contactBooks.create({
  name: "Newsletter Subscribers",
  emoji: "📧"
});
```

#### Get Contact Book

```typescript
const { data, error } = await client.contactBooks.get("book_id");
```

#### Update Contact Book

```typescript
const { data, error } = await client.contactBooks.update("book_id", {
  name: "New Name"
});
```

#### Delete Contact Book

```typescript
const { data, error } = await client.contactBooks.delete("book_id");
```

### Campaigns

#### Create Campaign

```typescript
const { data, error } = await client.campaigns.create({
  name: "Monthly Newsletter",
  from: "news@company.com",
  subject: "January Updates",
  contactBookId: "book_id",
  html: "<h1>News</h1>",
  sendNow: false // set to true to send immediately
});
```

#### Get Campaign

```typescript
const { data, error } = await client.campaigns.get("campaign_id");
```

#### Schedule Campaign

```typescript
const { data, error } = await client.campaigns.schedule("campaign_id", {
  scheduledAt: "2025-01-01T09:00:00Z",
  batchSize: 500
});
```

#### Pause/Resume Campaign

```typescript
await client.campaigns.pause("campaign_id");
await client.campaigns.resume("campaign_id");
```

### Templates

#### List Templates

```typescript
const { data, error } = await client.templates.list();
```

#### Create Template

```typescript
const { data, error } = await client.templates.create({
  name: "Welcome Email",
  subject: "Welcome {{name}}",
  html: "<h1>Welcome!</h1>"
});
```

#### Get Template

```typescript
const { data, error } = await client.templates.get("template_id");
```

#### Update Template

```typescript
const { data, error } = await client.templates.update("template_id", {
  subject: "New Subject"
});
```

#### Delete Template

```typescript
const { data, error } = await client.templates.delete("template_id");
```

### Webhooks

> **Note:** Webhooks are currently in development. The following methods are placeholders for future implementation.

#### List Webhooks

```typescript
const { data, error } = await client.webhooks.list();
```

#### Create Webhook

```typescript
const { data, error } = await client.webhooks.create({
  url: "https://api.myapp.com/webhooks/unsent",
  events: ["email.sent", "email.opened"]
});
```

#### Update Webhook

```typescript
const { data, error } = await client.webhooks.update("webhook_id", {
  events: ["email.bounced"]
});
```

#### Delete Webhook

```typescript
const { data, error } = await client.webhooks.delete("webhook_id");
```

### Domains

#### List Domains

```typescript
const { data, error } = await client.domains.list();
```

#### Create Domain

```typescript
const { data, error } = await client.domains.create({
  domain: "mail.example.com"
});
```

#### Verify Domain

```typescript
const { data, error } = await client.domains.verify("123"); // Uses domain ID (string)
```

#### Get Domain

```typescript
const { data, error } = await client.domains.get("123");
```

#### Delete Domain

```typescript
const { data, error } = await client.domains.delete("123");
```

### Analytics

#### Get General Analytics

```typescript
const { data, error } = await client.analytics.get();
```

#### Get Time Series

```typescript
const { data, error } = await client.analytics.getTimeSeries({
  days: 30,
  domain: "example.com"
});
```

#### Get Reputation

```typescript
const { data, error } = await client.analytics.getReputation({
  domain: "example.com"
});
```

### Suppressions

#### List Suppressions

```typescript
const { data, error } = await client.suppressions.list({
  page: 1,
  limit: 10,
  search: "test",
  reason: "COMPLAINT"
});
```

#### Add Suppression

```typescript
const { data, error } = await client.suppressions.add({
  email: "bad@example.com",
  reason: "COMPLAINT"
});
```

#### Delete Suppression

```typescript
const { data, error } = await client.suppressions.delete("bad@example.com");
```

### API Keys

#### List API Keys

```typescript
const { data, error } = await client.apiKeys.list();
```

#### Create API Key

```typescript
const { data, error } = await client.apiKeys.create({
  name: "Prod Key",
  permission: "FULL"
});
```

#### Delete API Key

```typescript
const { data, error } = await client.apiKeys.delete("key_id");
```

### Settings

#### Get Settings

```typescript
const { data, error } = await client.settings.get();
```

## Error Handling

The SDK returns a consistent response structure with `data` and `error`:

```typescript
const { data, error } = await client.emails.send({ ... });

if (error) {
  // error: { code: string; message: string; }
  console.error(`Error ${error.code}: ${error.message}`);
  return;
}

console.log("Success:", data);
```

### TypeScript Support

The SDK is fully typed. You can use inferred types:

```typescript
import { unsent } from "@unsent/sdk";

const client = new unsent();
// Types are automatically inferred
const { data } = await client.domains.list();
```

## License

MIT

## Support

- [Documentation](https://docs.unsent.dev)
- [GitHub Issues](https://github.com/souravsspace/unsent-typescript/issues)
- [Discord Community](https://discord.gg/unsent)
