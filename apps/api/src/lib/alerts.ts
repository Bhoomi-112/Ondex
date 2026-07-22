import { createLogger } from "./logger.js";
import { getSecret } from "./secrets.js";

const log = createLogger("alerts");

export type AlertPayload = {
  title: string;
  severity: "info" | "warning" | "critical";
  body: string;
  fields?: Record<string, string | number | boolean | null | undefined>;
};

/**
 * Fire alert on role escalation / anomaly events.
 * Uses Slack-compatible webhook and optional email endpoint from secrets manager.
 */
export async function sendAlert(payload: AlertPayload): Promise<void> {
  const webhook = getSecret("ALERT_WEBHOOK_URL");
  const emailTo = getSecret("ALERT_EMAIL_TO");

  log.warn(
    { title: payload.title, severity: payload.severity, fields: payload.fields },
    payload.body,
  );

  const tasks: Promise<void>[] = [];

  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `[${payload.severity.toUpperCase()}] ${payload.title}\n${payload.body}`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${payload.title}*\n${payload.body}`,
              },
            },
            ...(payload.fields
              ? [
                  {
                    type: "section",
                    fields: Object.entries(payload.fields).map(([k, v]) => ({
                      type: "mrkdwn",
                      text: `*${k}:*\n${String(v ?? "—")}`,
                    })),
                  },
                ]
              : []),
          ],
        }),
      })
        .then((r) => {
          if (!r.ok) log.error({ status: r.status }, "Webhook alert failed");
        })
        .catch((err) => log.error({ err }, "Webhook alert error")),
    );
  }

  if (emailTo) {
    // Mailgun/SendGrid-style HTTP API can be wired here; log for now if no provider URL
    const mailUrl = getSecret("ALERT_EMAIL_API_URL");
    if (mailUrl) {
      tasks.push(
        fetch(mailUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: emailTo,
            subject: `[Ondex] ${payload.title}`,
            text: `${payload.body}\n\n${JSON.stringify(payload.fields ?? {}, null, 2)}`,
          }),
        })
          .then(() => undefined)
          .catch((err) => log.error({ err }, "Email alert error")),
      );
    } else {
      log.info({ emailTo, title: payload.title }, "Alert email target configured (no API URL)");
    }
  }

  await Promise.allSettled(tasks);
}

export async function alertRoleEscalation(data: {
  actorId: string;
  targetId: string;
  oldRole: string | null;
  newRole: string;
  ip: string | null;
}): Promise<void> {
  await sendAlert({
    title: "Role escalation",
    severity: "critical",
    body: `User role changed from ${data.oldRole ?? "none"} → ${data.newRole}`,
    fields: {
      actorId: data.actorId,
      targetId: data.targetId,
      oldRole: data.oldRole,
      newRole: data.newRole,
      ip: data.ip,
    },
  });
}
