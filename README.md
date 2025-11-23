# @unsent/sdk SDK

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

const client = new unsent("us_12345");
```

### Environment Variables

You can also set your API key using environment variables:

```typescript
// Set UNSENT_API_KEY or UNSENT_API_KEY in your environment
// Then initialize without passing the key
const client = new unsent();
```

### Sending Emails

#### Simple Email

```typescript
const { data, error } = await client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "unsent email",
  html: "<p>unsent is the best email service provider to send emails</p>",
  text: "unsent is the best email service provider to send emails",
});

if (error) {
  console.error("Error:", error);
} else {
  console.log("Email sent! ID:", data.id);
}
```

#### Email with Attachments

```typescript
const { data, error } = await client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "Email with attachment",
  html: "<p>Please find the attachment below</p>",
  attachments: [
    {
      filename: "document.pdf",
      content: "base64-encoded-content-here",
    },
  ],
});
```

#### Email with React Component

```typescript
import { MyEmailTemplate } from "./templates/MyEmailTemplate"

const { data, error } = await client.emails.send({
   to: "hello@acme.com",
   from: "hello@company.com",
   subject: "Email with React template",
   react: <MyEmailTemplate name="John" />,
})
```

#### Scheduled Email

```typescript
const scheduledTime = new Date();
scheduledTime.setHours(scheduledTime.getHours() + 1); // Schedule for 1 hour from now

const { data, error } = await client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "Scheduled email",
  html: "<p>This email was scheduled</p>",
  scheduledAt: scheduledTime.toISOString(),
});
```

#### Batch Emails

```typescript
const emails = [
  {
    to: "user1@example.com",
    from: "hello@company.com",
    subject: "Hello User 1",
    html: "<p>Welcome User 1</p>",
  },
  {
    to: "user2@example.com",
    from: "hello@company.com",
    subject: "Hello User 2",
    html: "<p>Welcome User 2</p>",
  },
];

const { data, error } = await client.emails.batch(emails);

if (error) {
  console.error("Error:", error);
} else {
  console.log(`Sent ${data.length} emails`);
}
```

### Managing Emails

#### Get Email Details

```typescript
const { data, error } = await client.emails.get("email_id");

if (error) {
  console.error("Error:", error);
} else {
  console.log("Email status:", data.status);
}
```

#### Update Email

```typescript
const { data, error } = await client.emails.update("email_id", {
  subject: "Updated subject",
  html: "<p>Updated content</p>",
});
```

#### Cancel Scheduled Email

```typescript
const { data, error } = await client.emails.cancel("email_id");

if (error) {
  console.error("Error:", error);
} else {
  console.log("Email cancelled successfully");
}
```

### Managing Contacts

#### Create Contact

```typescript
const { data, error } = await client.contacts.create("contact_book_id", {
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  metadata: {
    company: "Acme Inc",
    role: "Developer",
  },
});
```

#### Get Contact

```typescript
const { data, error } = await client.contacts.get(
  "contact_book_id",
  "contact_id",
);
```

#### Update Contact

```typescript
const { data, error } = await client.contacts.update(
  "contact_book_id",
  "contact_id",
  {
    firstName: "Jane",
    metadata: {
      role: "Senior Developer",
    },
  },
);
```

#### Upsert Contact

```typescript
// Creates if doesn't exist, updates if exists
const { data, error } = await client.contacts.upsert(
  "contact_book_id",
  "contact_id",
  {
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
  },
);
```

#### Delete Contact

```typescript
const { data, error } = await client.contacts.delete(
  "contact_book_id",
  "contact_id",
);
```

### Managing Campaigns

Create and manage email campaigns:

```typescript
import { unsent } from "@unsent/sdk";

const client = new unsent("us_12345");

// Create a campaign
const campaign = await client.campaigns.create({
  name: "Welcome Series",
  from: "hello@company.com",
  subject: "Welcome to our platform!",
  contactBookId: "cb_12345",
  html: "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
  sendNow: false,
});

if (campaign.error) {
  console.error("Error creating campaign:", campaign.error);
} else {
  console.log("Campaign created:", campaign.data.id);
}

// Schedule a campaign
const scheduleResult = await client.campaigns.schedule(campaign.data.id, {
  scheduledAt: "2024-12-01T09:00:00Z",
  batchSize: 1000,
});

if (scheduleResult.error) {
  console.error("Error scheduling campaign:", scheduleResult.error);
} else {
  console.log("Campaign scheduled successfully");
}

// Get campaign details
const details = await client.campaigns.get(campaign.data.id);

if (details.error) {
  console.error("Error getting details:", details.error);
} else {
  console.log("Campaign status:", details.data.status);
  console.log("Total recipients:", details.data.total);
}

// Pause a campaign
const pauseResult = await client.campaigns.pause(campaign.data.id);

if (pauseResult.error) {
  console.error("Error pausing campaign:", pauseResult.error);
} else {
  console.log("Campaign paused successfully");
}

// Resume a campaign
const resumeResult = await client.campaigns.resume(campaign.data.id);

if (resumeResult.error) {
  console.error("Error resuming campaign:", resumeResult.error);
} else {
  console.log("Campaign resumed successfully");
}
```

### Error Handling

The SDK returns a consistent response structure with `data` and `error`:

```typescript
const { data, error } = await client.emails.send({
  to: "invalid-email",
  from: "hello@company.com",
  subject: "Test",
  html: "<p>Test</p>",
});

if (error) {
  console.error(`Error ${error.code}: ${error.message}`);
  return;
}

// Safe to use data here
console.log("Email sent:", data.id);
```

### TypeScript Support

The SDK is fully typed with TypeScript:

```typescript
import { unsent } from "@unsent/sdk";

const client = new unsent("us_12345");

// Full type inference and autocomplete
const result = await client.emails.send({
  to: "hello@acme.com",
  from: "hello@company.com",
  subject: "Typed email",
  html: "<p>Fully typed!</p>",
});

// Type-safe access
if (result.data) {
  const emailId: string = result.data.id;
}
```

## API Reference

### Client Methods

- `new unsent(key?, url?)` - Initialize the client

### Email Methods

- `client.emails.send(payload)` - Send an email (alias for `create`)
- `client.emails.create(payload)` - Create and send an email
- `client.emails.batch(emails)` - Send multiple emails in batch (max 100)
- `client.emails.get(emailId)` - Get email details
- `client.emails.update(emailId, payload)` - Update a scheduled email
- `client.emails.cancel(emailId)` - Cancel a scheduled email

### Contact Methods

- `client.contacts.create(bookId, payload)` - Create a contact
- `client.contacts.get(bookId, contactId)` - Get contact details
- `client.contacts.update(bookId, contactId, payload)` - Update a contact
- `client.contacts.upsert(bookId, contactId, payload)` - Upsert a contact
- `client.contacts.delete(bookId, contactId)` - Delete a contact

### Campaign Methods

- `client.campaigns.create(payload)` - Create a campaign
- `client.campaigns.get(campaignId)` - Get campaign details
- `client.campaigns.schedule(campaignId, payload)` - Schedule a campaign
- `client.campaigns.pause(campaignId)` - Pause a campaign
- `client.campaigns.resume(campaignId)` - Resume a campaign

## Features

- 🔐 **Type-safe** - Full TypeScript support with type inference
- ⚡ **Modern** - Built with ESM and async/await
- 🎨 **React Email** - Send emails using React components
- 📦 **Lightweight** - Minimal dependencies
- 🔄 **Batch sending** - Send up to 100 emails in a single request
- ⏰ **Scheduled emails** - Schedule emails for later delivery

## Requirements

- Node.js 16+
- TypeScript 4.7+ (for TypeScript projects)

## License

MIT

## Support

- [Documentation](https://docs.unsent.dev)
- [GitHub Issues](https://github.com/souravsspace/unsent-typescript/issues)
- [Discord Community](https://discord.gg/unsent)
