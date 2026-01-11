const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const QUESTIONS = [
  /* ================= EMAIL (10) ================= */
  {
    category: "EMAIL",
    prompt: "Email : « Votre compte sera suspendu dans 1h ». Que fais-tu ?",
    explanation: "L’urgence est un signal classique de phishing.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je vais sur le site officiel manuellement", isCorrect: true },
      { label: "Je réponds à l’email", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email avec une facture jointe alors que tu n’as rien commandé.",
    explanation: "Les pièces jointes inattendues sont risquées.",
    options: [
      { label: "Je l’ouvre", isCorrect: false },
      { label: "Je supprime sans ouvrir", isCorrect: true },
      { label: "Je transfère", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Adresse expéditeur : support@amaz0n-secure.com",
    explanation: "Les faux domaines imitent les vrais.",
    options: [
      { label: "Normal", isCorrect: false },
      { label: "Je vérifie le domaine exact", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email plein de fautes d’orthographe.",
    explanation: "Les fautes sont souvent un signe d’arnaque.",
    options: [
      { label: "Ce n’est pas grave", isCorrect: false },
      { label: "Je me méfie", isCorrect: true },
      { label: "Je réponds", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email demandant ton mot de passe.",
    explanation: "Aucun service légitime ne demande un mot de passe.",
    options: [
      { label: "Je le donne", isCorrect: false },
      { label: "Je signale", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email avec lien raccourci.",
    explanation: "Les liens raccourcis masquent la destination.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je passe la souris pour vérifier", isCorrect: true },
      { label: "Je partage", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email de loterie inconnue.",
    explanation: "Tu ne peux pas gagner sans participer.",
    options: [
      { label: "Je réponds", isCorrect: false },
      { label: "Je supprime", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email te demandant des infos personnelles.",
    explanation: "Les infos sensibles ne sont jamais demandées par email.",
    options: [
      { label: "Je réponds", isCorrect: false },
      { label: "Je refuse", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email avec une signature étrange.",
    explanation: "Une signature incohérente est suspecte.",
    options: [
      { label: "Normal", isCorrect: false },
      { label: "Je vérifie l’identité", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email pressant venant d’un « supérieur ».",
    explanation: "Technique de fraude au président.",
    options: [
      { label: "J’obéis", isCorrect: false },
      { label: "Je vérifie par un autre canal", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },

  /* ================= SMS (10) ================= */
  {
    category: "SMS",
    prompt: "SMS : « Colis en attente ». Tu n’attends rien.",
    explanation: "Les faux SMS de livraison sont fréquents.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je supprime", isCorrect: true },
      { label: "Je réponds", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS de ta banque avec un lien.",
    explanation: "Les banques n’envoient pas de liens par SMS.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je contacte ma banque via l’app", isCorrect: true },
      { label: "Je réponds", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "Lien raccourci dans un SMS.",
    explanation: "Lien raccourci = danger potentiel.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je me méfie", isCorrect: true },
      { label: "Je partage", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS alarmiste demandant une action immédiate.",
    explanation: "L’urgence est un piège classique.",
    options: [
      { label: "Je panique", isCorrect: false },
      { label: "Je prends du recul", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS demandant un code de sécurité.",
    explanation: "Un code est personnel.",
    options: [
      { label: "Je le donne", isCorrect: false },
      { label: "Je refuse", isCorrect: true },
      { label: "Je réponds", isCorrect: false }
    ]
  },

  /* ================= SOCIAL (10) ================= */
  {
    category: "SOCIAL",
    prompt: "DM : « Tu as gagné un concours ».",
    explanation: "Faux concours très répandus.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je bloque et signale", isCorrect: true },
      { label: "Je réponds", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Un ami te demande de l’argent via message.",
    explanation: "Usurpation d’identité possible.",
    options: [
      { label: "J’envoie", isCorrect: false },
      { label: "Je vérifie autrement", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Lien suspect envoyé par un contact.",
    explanation: "Le compte peut être piraté.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je demande confirmation", isCorrect: true },
      { label: "Je partage", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Profil récent avec peu d’amis.",
    explanation: "Souvent un faux compte.",
    options: [
      { label: "Je fais confiance", isCorrect: false },
      { label: "Je me méfie", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Publicité promettant de l’argent facile.",
    explanation: "Les promesses irréalistes sont suspectes.",
    options: [
      { label: "J’essaie", isCorrect: false },
      { label: "Je me méfie", isCorrect: true },
      { label: "Je partage", isCorrect: false }
    ]
  }
];

async function main() {
  await prisma.answer.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();

  for (const q of QUESTIONS) {
    await prisma.question.create({
      data: {
        category: q.category,
        prompt: q.prompt,
        explanation: q.explanation,
        options: { create: q.options }
      }
    });
  }

  console.log(`✅ Seed terminé : ${QUESTIONS.length} questions en base`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });