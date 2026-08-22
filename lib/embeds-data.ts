export type Embed = {
  name: string;
  projectId: string;
  tag: string;
  domain: string;
  /** Demo secret used on the Setup tab. */
  secret: string;
};

export const EMBEDS: Embed[] = [
  { name: "testing embed_8", projectId: "projmxuQ4sJe", tag: "asdfdsf", domain: "test.com", secret: "soh3aXPJN6QlCesDUOSFx3CeE5k6RyA0iEU17eH4VpM" },
  { name: "testing embed_7", projectId: "projX0NVuZ58", tag: "asdfdsf", domain: "test.com", secret: "kv8Wn2QcLpR7xTfA3mHsY6bJ4dZ9eU1gN5oV0iBqXwM" },
  { name: "hello embed_3", projectId: "projz7VJm44a", tag: "hofiahosifiaosfahoisfohisafxhio", domain: "test.io", secret: "aP2rT9wKmX4vB7nQ6sD1yH8jL3fC5gZ0eR2uN4oI6bV" },
  { name: "hello embed_2", projectId: "proj4b8f9vZO", tag: "hofiahosifiaosfahoisfohisafxhio", domain: "test.io", secret: "mW7xK2pR9nT4vC6sB1yD8jL3fH5gZ0eQ2uA4oI6cN0b" },
  { name: "testing embed_6", projectId: "projV1cAqjbP", tag: "asdfdsf", domain: "test.com", secret: "zX4cV7bN2mK9lP1oQ6wR3eT8yU5iA0sD2fG4hJ6kL8m" },
  { name: "testing embed_5", projectId: "projWoTnYGwQ", tag: "asdfdsf", domain: "test.com", secret: "qA9sW2dE7fR4gT6yH1jU8kI3lO5pZ0xC2vB4nM6bV8c" },
  { name: "testing embed_4", projectId: "proj1o44va00", tag: "asdfdsf", domain: "test.com", secret: "eR3tY7uI2oP9aS4dF6gH1jK8lZ5xC0vB2nM4qW6sE8d" },
  { name: "testing embed_3", projectId: "projNNraUpRe", tag: "asdfdsf", domain: "test.com", secret: "tY6uI9oP2aS7dF4gH1jK8lZ3xC5vB0nM2qW4eR6sT8y" },
  { name: "testing embed_2", projectId: "projoZLwTiGo", tag: "asdfdsf", domain: "test.com", secret: "uI2oP7aS9dF4gH6jK1lZ8xC3vB5nM0qW2eR4tY6uI8o" },
  { name: "testing embed", projectId: "proj0x8LwabT", tag: "asdfdsf", domain: "test.com", secret: "oP9aS2dF7gH4jK6lZ1xC8vB3nM5qW0eR2tY4uI6oP8a" },
  { name: "hello embed", projectId: "projlm4qbOoa", tag: "hofiahosifiaosfahoisfohisafxhio", domain: "test.io", secret: "aS7dF2gH9jK4lZ6xC1vB8nM3qW5eR0tY2uI4oP6aS8d" },
  { name: "Webhook", projectId: "proje02NSuQ3", tag: "webhook", domain: "No domain", secret: "dF4gH7jK2lZ9xC6vB1nM8qW3eR5tY0uI2oP4aS6dF8g" },
];

export function getEmbed(projectId: string): Embed | undefined {
  return EMBEDS.find((e) => e.projectId === projectId);
}
