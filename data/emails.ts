export type LevelId = "recruit" | "agent" | "elite";

export interface EmailLink {
  label: string;
  href: string;
}

export interface PhishEmail {
  id: string;
  level: LevelId;
  fromLabel: string;
  fromAddress: string;
  to: string;
  subject: string;
  date: string;
  paragraphs: string[];
  links: EmailLink[];
  attachments: string[];
  isPhishing: boolean;
  hint: string;
  explanation: string;
}

export interface Level {
  id: LevelId;
  name: string;
  rank: string;
  tagline: string;
  color: "green" | "cyan" | "red";
}

export const LEVELS: Level[] = [
  {
    id: "recruit",
    name: "RECRUIT",
    rank: "01",
    tagline: "Obvious threats. Train your eyes.",
    color: "green",
  },
  {
    id: "agent",
    name: "AGENT",
    rank: "02",
    tagline: "Lookalike domains. Subtle pressure.",
    color: "cyan",
  },
  {
    id: "elite",
    name: "ELITE",
    rank: "03",
    tagline: "Near-perfect impersonation.",
    color: "red",
  },
];

export const EMAILS: PhishEmail[] = [
  // ─────────────────────────── LEVEL 01 · RECRUIT ───────────────────────────
  {
    id: "r1",
    level: "recruit",
    fromLabel: "JIC Mail Security",
    fromAddress: "alerts@jic-mail.verify.net",
    to: "you@jicollege.edu.sa",
    subject: "ACCOUNT SUSPENSION NOTICE — ACT NOW",
    date: "Mon, 12 Oct 2026 09:14",
    paragraphs: [
      "Dear JIC student,",
      "Our system detected suspicious activity on your college mailbox. Your account will be SUSPENDED within 24 HOURS if you do not verify your identity immediately.",
      "Click the link below and enter your credentials to keep your account active. Failure to act will result in permanent loss of access to all your assignments.",
    ],
    links: [{ label: "https://jic-mail.verify.net/secure/login", href: "https://jic-mail.verify.net/secure/login" }],
    attachments: [],
    isPhishing: true,
    hint: "Check the sender's domain carefully — is it really jicollege.edu.sa?",
    explanation:
      "The sender is 'jic-mail.verify.net', not 'jicollege.edu.sa'. Real colleges never demand credentials over email with an external domain.",
  },
  {
    id: "r2",
    level: "recruit",
    fromLabel: "WinPrizes",
    fromAddress: "noreply@win-big-2026.com",
    to: "you@jicollege.edu.sa",
    subject: "CONGRATULATIONS! You've been selected for a FREE iPhone 16",
    date: "Mon, 12 Oct 2026 10:02",
    paragraphs: [
      "You have been randomly selected as the 100,000th visitor to our site!",
      "To claim your prize, simply confirm your shipping details within the next 10 MINUTES by clicking the link below. This offer expires immediately.",
      "You have won, but only if you act fast!",
    ],
    links: [{ label: "https://win-big-2026.com/claim/your-iphone", href: "https://win-big-2026.com/claim/your-iphone" }],
    attachments: [],
    isPhishing: true,
    hint: "You never entered any contest. Why would you win an iPhone?",
    explanation:
      "Classic prize scam. Urgency ('10 MINUTES'), a random win you never entered, and a non-college domain are all red flags.",
  },
  {
    id: "r3",
    level: "recruit",
    fromLabel: "Ayesha Rahman",
    fromAddress: "a.rahman@jicollege.edu.sa",
    to: "cyber0ne-members@jicollege.edu.sa",
    subject: "Cyber0ne Weekly Meet — Friday 4:00 PM (Agenda inside)",
    date: "Tue, 13 Oct 2026 08:30",
    paragraphs: [
      "Hey Cyber0ne team,",
      "This week's meeting is in Lab 4B on Friday at 4:00 PM. We'll be reviewing the CTF write-ups from last weekend and planning the phishing-awareness booth for the college fair.",
      "Bring your laptops — we're doing a live demo of packet capture. Agenda attached if you want a preview. See you there!",
      "— Ayesha",
    ],
    links: [{ label: "https://clubs.jicollege.edu.sa/cyber0ne/agenda", href: "https://clubs.jicollege.edu.sa/cyber0ne/agenda" }],
    attachments: ["cyber0ne_agenda_friday.pdf"],
    isPhishing: false,
    hint: "The sender domain ends in jicollege.edu.sa — a legit club address.",
    explanation:
      "This is a genuine internal club email: real jicollege.edu.sa domain, normal tone, a real meeting location, and a PDF attachment from a known member.",
  },
  {
    id: "r4",
    level: "recruit",
    fromLabel: "IT Service Desk",
    fromAddress: "service.desk@jic-login.secure-support.co",
    to: "you@jicollege.edu.sa",
    subject: "URGENT: Password reset required within 24 hours",
    date: "Tue, 13 Oct 2026 11:47",
    paragraphs: [
      "Dear student,",
      "Due to a security update, all student passwords MUST be reset before tomorrow. Ignoring this message will lock your JIC account permanently.",
      "Reset your password now using the secure portal below. Do not tell anyone your new password.",
    ],
    links: [{ label: "https://jic-login.secure-support.co/reset", href: "https://jic-login.secure-support.co/reset" }],
    attachments: [],
    isPhishing: true,
    hint: "Look at the reset link's domain, and note the typos and panic language.",
    explanation:
      "The real domain is jicollege.edu.sa, not 'secure-support.co'. Combined with all-caps urgency and 'do not tell anyone', this is a credential-harvesting phish.",
  },
  {
    id: "r5",
    level: "recruit",
    fromLabel: "JIC Library",
    fromAddress: "library@jicollege.edu.sa",
    to: "all-students@jicollege.edu.sa",
    subject: "Workshop: Spotting Fake News & Deepfakes — register now",
    date: "Wed, 14 Oct 2026 09:05",
    paragraphs: [
      "The JIC Library is hosting a free lunch-hour workshop on identifying fake news, manipulated media and deepfakes — a perfect warm-up for anyone interested in cyber hygiene.",
      "Date: Thursday, 22 October. Location: Library Seminar Room. Limited seats, so register early through the official student portal.",
      "We look forward to seeing you there!",
    ],
    links: [{ label: "https://portal.jicollege.edu.sa/events/library-workshop", href: "https://portal.jicollege.edu.sa/events/library-workshop" }],
    attachments: [],
    isPhishing: false,
    hint: "The link goes to portal.jicollege.edu.sa — an official college domain.",
    explanation:
      "Safe. A normal, well-written announcement from a jicollege.edu.sa address linking to the official student portal. Nothing is asking for credentials or money.",
  },

  // ─────────────────────────── LEVEL 02 · AGENT ───────────────────────────
  {
    id: "a1",
    level: "agent",
    fromLabel: "PayPal",
    fromAddress: "billing@paypa1-verify.com",
    to: "you@jicollege.edu.sa",
    subject: "Payment confirmation — Invoice #INV-9021",
    date: "Wed, 14 Oct 2026 13:22",
    paragraphs: [
      "Dear customer,",
      "We processed a payment of $149.99 to GAME-STORE GLOBAL on your PayPal account. If you did not authorise this payment, sign in immediately to dispute it.",
      "An unauthorised charge will be deducted from your linked bank account unless you act within 48 hours.",
    ],
    links: [{ label: "https://paypa1-verify.com/login/dispute", href: "https://paypa1-verify.com/login/dispute" }],
    attachments: ["invoice_INV-9021.pdf"],
    isPhishing: true,
    hint: "PayPal is spelled 'paypa1' — compare the 'l' and the '1'.",
    explanation:
      "Classic lookalike domain: 'paypa1' substitutes a 1 for an l. Real PayPal would use paypal.com. The fake invoice and fake charge pressure you to 'sign in' and hand over credentials.",
  },
  {
    id: "a2",
    level: "agent",
    fromLabel: "GitHub",
    fromAddress: "notifications@github.com",
    to: "you@jicollege.edu.sa",
    subject: "Your weekly security digest",
    date: "Wed, 14 Oct 2026 15:40",
    paragraphs: [
      "Hi there,",
      "Here's your summary of security-related activity across the repositories you follow this week: 2 new advisories, 4 dependency updates, and 1 new release for the repository you starred.",
      "No action required — just keeping you in the loop. You can adjust how often you receive these digests anytime.",
    ],
    links: [{ label: "https://github.com/settings/notifications", href: "https://github.com/settings/notifications" }],
    attachments: [],
    isPhishing: false,
    hint: "The sender is on the real github.com domain and nothing asks you to log in.",
    explanation:
      "Safe. A legitimate notification from a real service domain. No attachments, no urgency, no login links — just informational content.",
  },
  {
    id: "a3",
    level: "agent",
    fromLabel: "JIC Human Resources",
    fromAddress: "hr@jic-employees-portal.net",
    to: "you@jicollege.edu.sa",
    subject: "HR: Updated benefits enrollment window — action required",
    date: "Thu, 15 Oct 2026 10:18",
    paragraphs: [
      "Dear staff and students,",
      "The benefits enrollment window has been updated. Review your selections and confirm before the new deadline.",
      "All members must re-verify their details by logging into the employee portal. Use the link below to avoid losing your current benefits.",
    ],
    links: [{ label: "https://jic-employees-portal.net/hr/enroll", href: "https://jic-employees-portal.net/hr/enroll" }],
    attachments: [],
    isPhishing: true,
    hint: "JIC HR emails come from jicollege.edu.sa, not a '.net' portal.",
    explanation:
      "Impersonation of an internal department. The 'jic-employees-portal.net' domain is unrelated to the college. Internal teams use official college domains.",
  },
  {
    id: "a4",
    level: "agent",
    fromLabel: "DHL Express",
    fromAddress: "tracking@dhl-delivery-alerts.com",
    to: "you@jicollege.edu.sa",
    subject: "Your package could not be delivered",
    date: "Thu, 15 Oct 2026 12:55",
    paragraphs: [
      "We attempted to deliver your parcel but no one was available at the address.",
      "To reschedule delivery, confirm your details and pay a small redelivery fee of PKR 250 within 24 hours. Your parcel will be returned to sender otherwise.",
      "The tracking link below will take you to the delivery portal.",
    ],
    links: [{ label: "https://bit.ly/3x-delivery-jic", href: "https://bit.ly/3x-delivery-jic" }],
    attachments: [],
    isPhishing: true,
    hint: "A shortened 'bit.ly' link is used instead of a real DHL tracking page.",
    explanation:
      "Real couriers use their own domains (dhl.com) and never demand a 'redelivery fee' via a link shortener. Shortened links hide the real destination — a classic phish.",
  },
  {
    id: "a5",
    level: "agent",
    fromLabel: "HBL",
    fromAddress: "statements@hbl.com",
    to: "you@jicollege.edu.sa",
    subject: "Your monthly account statement is ready",
    date: "Fri, 16 Oct 2026 08:00",
    paragraphs: [
      "Dear customer,",
      "Your monthly account statement for September is now available. You can download it from the secure online banking portal.",
      "If you did not request this statement, contact our helpline. We never ask for your PIN or password in emails.",
    ],
    links: [{ label: "https://www.hbl.com/online-banking", href: "https://www.hbl.com/online-banking" }],
    attachments: [],
    isPhishing: false,
    hint: "Sender uses the real hbl.com domain and explicitly warns you not to share credentials.",
    explanation:
      "Safe. The real bank domain, a generic statement notice, and a healthy warning that banks never ask for credentials in email. This is how a legit bank notification looks.",
  },

  // ─────────────────────────── LEVEL 03 · ELITE ───────────────────────────
  {
    id: "e1",
    level: "elite",
    fromLabel: "JIC IT Helpdesk",
    fromAddress: "helpdesk@jic-education.org",
    to: "you@jicollege.edu.sa",
    subject: "Scheduled mailbox maintenance — verify your credentials",
    date: "Fri, 16 Oct 2026 14:30",
    paragraphs: [
      "Dear student,",
      "As part of scheduled maintenance this weekend, the mail server will be migrated to a new cluster. To preserve your mailbox data, you must verify your account within 72 hours.",
      "Please complete the verification using the portal below. Your mailbox will be unavailable until verification is finished.",
      "Best regards, JIC IT Helpdesk",
    ],
    links: [{ label: "https://mail.jic-education.org/verify", href: "https://mail.jic-education.org/verify" }],
    attachments: [],
    isPhishing: true,
    hint: "The display name says 'JIC IT Helpdesk' — but is the domain jicollege.edu.sa?",
    explanation:
      "Elite-level spoof: a convincing display name and calm, professional wording, but the sending domain 'jic-education.org' is a lookalike of jicollege.edu.sa. Always verify the address, not the name.",
  },
  {
    id: "e2",
    level: "elite",
    fromLabel: "HR Payroll",
    fromAddress: "payroll@jicollege.edu.sa",
    to: "you@jicollege.edu.sa",
    subject: "Payslip for September is ready",
    date: "Sat, 17 Oct 2026 09:12",
    paragraphs: [
      "Hello,",
      "Your payslip for September has been generated. Please note this is an automated message — do not reply to it.",
      "To view your payslip, sign in to the payroll portal using your college credentials. If you have any questions, contact the payroll office directly.",
    ],
    links: [{ label: "https://payroll.jicollege.edu.sa/login", href: "https://payroll.jicollege.edu.sa/login" }],
    attachments: [],
    isPhishing: false,
    hint: "Despite looking like a phish, the domain is the real payroll.jicollege.edu.sa.",
    explanation:
      "This one looks suspicious but is genuinely safe: the link goes to payroll.jicollege.edu.sa, a legitimate subdomain of the college. Not every email with a login link is a phish — but you must confirm the domain.",
  },
  {
    id: "e3",
    level: "elite",
    fromLabel: "Cyber0ne Club",
    fromAddress: "cyber0ne@cyber0ne-events.info",
    to: "you@jicollege.edu.sa",
    subject: "RE: Cyber0ne CTF registration confirmation",
    date: "Sat, 17 Oct 2026 11:26",
    paragraphs: [
      "Hi there,",
      "You're registered for the Cyber0ne Capture The Flag night! Here's everything you need to get started.",
      "Please review the attached challenge briefing and install the included setup tool before Saturday. Spots are limited so confirm your attendance by replying to this address.",
    ],
    links: [{ label: "https://cyber0ne-events.info/ctf", href: "https://cyber0ne-events.info/ctf" }],
    attachments: ["ctf_briefing.pdf", "setup_tool.exe"],
    isPhishing: true,
    hint: "Executable (.exe) attachments are never sent by a real club. And the domain isn't jicollege.edu.sa.",
    explanation:
      "Clubs use official college or club domains, and nobody sends .exe files in email. A 'setup_tool.exe' is malware — combined with the lookalike club domain, this is a Trojan delivery attempt.",
  },
  {
    id: "e4",
    level: "elite",
    fromLabel: "Microsoft account team",
    fromAddress: "account-security-noreply@microsoft.com",
    to: "you@jicollege.edu.sa",
    subject: "We signed you in with a new device",
    date: "Sun, 18 Oct 2026 18:44",
    paragraphs: [
      "Your Microsoft account was just used to sign in on a new device (Windows 11, Chrome, Lahore, PK).",
      "If this was you, no further action is needed. If this wasn't you, review your recent activity and secure your account using the official security page below.",
      "This is an automated notification. Microsoft will never ask you for your password in an email.",
    ],
    links: [{ label: "https://account.microsoft.com/security", href: "https://account.microsoft.com/security" }],
    attachments: [],
    isPhishing: false,
    hint: "The link points to the real account.microsoft.com security page.",
    explanation:
      "Safe. Real microsoft.com sender, a link to Microsoft's actual security page, and the correct 'never ask for passwords' behaviour. Even though sign-in alerts can be scary, this one is legitimate.",
  },
  {
    id: "e5",
    level: "elite",
    fromLabel: "National Bank of Pakistan",
    fromAddress: "security@nbp-bank.support",
    to: "you@jicollege.edu.sa",
    subject: "Suspicious login detected — verify your account now",
    date: "Sun, 18 Oct 2026 20:15",
    paragraphs: [
      "Dear valued customer,",
      "We noticed a login to your online banking from an unrecognised device. To protect your funds, we have temporarily limited your account.",
      "Please complete a quick verification to restore full access. Your account will remain limited until verification is complete. For your security, never share your OTP with anyone.",
      "NBP Customer Support",
    ],
    links: [{ label: "https://nbp-bank.support/secure/verify", href: "https://nbp-bank.support/secure/verify" }],
    attachments: [],
    isPhishing: true,
    hint: "NBP's real website is nbp.com.pk. This sender uses 'nbp-bank.support'.",
    explanation:
      "A polished, realistic bank scare — but the real domain is nbp.com.pk. The '.support' lookalike is designed to trick you into entering your online banking credentials on a fake page.",
  },
];

export const EMAIL_MAP: Record<string, PhishEmail> = Object.fromEntries(
  EMAILS.map((e) => [e.id, e]),
);

export const EMAILS_BY_LEVEL = (level: LevelId): PhishEmail[] =>
  EMAILS.filter((e) => e.level === level);