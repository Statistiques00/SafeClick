const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const QUESTIONS = [
  /* ===================== EMAIL (15) ===================== */
  {
    category: "EMAIL",
    prompt: "Email : « Votre compte sera suspendu dans 1h ». Que fais-tu ?",
    explanation: "L’urgence est un signal classique de phishing.",
    options: [
      { label: "Je clique sur le lien", isCorrect: false },
      { label: "Je vais sur le site officiel manuellement", isCorrect: true },
      { label: "Je réponds à l’email", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email avec une facture jointe alors que tu n’as rien commandé.",
    explanation: "Les pièces jointes inattendues sont très risquées.",
    options: [
      { label: "Je l’ouvre pour vérifier", isCorrect: false },
      { label: "Je supprime sans ouvrir", isCorrect: true },
      { label: "Je transfère à un collègue", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "L’adresse expéditeur est étrange (ex: support@amaz0n-secure.co).",
    explanation: "Les faux domaines imitent les vrais.",
    options: [
      { label: "C’est normal", isCorrect: false },
      { label: "Je vérifie le domaine exact", isCorrect: true },
      { label: "Je clique vite", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email avec fautes d’orthographe et ton alarmiste.",
    explanation: "Les fautes sont souvent un indice de phishing.",
    options: [
      { label: "Ce n’est pas grave", isCorrect: false },
      { label: "Je me méfie", isCorrect: true },
      { label: "Je réponds", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt: "Email te demandant ton mot de passe.",
    explanation: "Aucun service légitime ne demande ton mot de passe.",
    options: [
      { label: "Je le donne", isCorrect: false },
      { label: "Je signale l’email", isCorrect: true },
      { label: "Je clique sur le lien", isCorrect: false }
    ]
  },

  /* ===================== SMS (15) ===================== */
  {
    category: "SMS",
    prompt: "SMS : « Colis en attente, cliquez ici ». Tu n’attends rien.",
    explanation: "Les faux SMS de livraison sont très fréquents.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je supprime le SMS", isCorrect: true },
      { label: "Je réponds STOP", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS de ta « banque » avec un lien.",
    explanation: "Les banques ne communiquent pas ainsi.",
    options: [
      { label: "Je clique vite", isCorrect: false },
      { label: "Je contacte ma banque via l’app officielle", isCorrect: true },
      { label: "Je réponds au SMS", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS avec un lien raccourci (bit.ly).",
    explanation: "Les liens raccourcis masquent la destination réelle.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je me méfie", isCorrect: true },
      { label: "Je partage", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS alarmiste demandant une action immédiate.",
    explanation: "L’urgence est un signal d’arnaque.",
    options: [
      { label: "Je panique", isCorrect: false },
      { label: "Je prends du recul", isCorrect: true },
      { label: "Je clique", isCorrect: false }
    ]
  },
  {
    category: "SMS",
    prompt: "SMS te demandant un code reçu par SMS.",
    explanation: "Ne jamais partager de code de sécurité.",
    options: [
      { label: "Je le donne", isCorrect: false },
      { label: "Je refuse", isCorrect: true },
      { label: "Je renvoie le message", isCorrect: false }
    ]
  },

  /* ===================== RÉSEAUX SOCIAUX (15) ===================== */
  {
    category: "SOCIAL",
    prompt: "DM Instagram : « Tu as gagné un concours ». Tu n’as jamais participé.",
    explanation: "Les faux concours sont très répandus.",
    options: [
      { label: "Je clique sur le lien", isCorrect: false },
      { label: "Je bloque et signale", isCorrect: true },
      { label: "Je réponds merci", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Un compte se fait passer pour un ami et te demande de l’argent.",
    explanation: "C’est une usurpation d’identité.",
    options: [
      { label: "J’envoie l’argent", isCorrect: false },
      { label: "Je vérifie par un autre moyen", isCorrect: true },
      { label: "Je clique sur le lien", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Lien suspect envoyé via Messenger.",
    explanation: "Les comptes peuvent être compromis.",
    options: [
      { label: "Je clique", isCorrect: false },
      { label: "Je demande confirmation", isCorrect: true },
      { label: "Je partage", isCorrect: false }
    ]
  },
  {
    category: "SOCIAL",
    prompt: "Profil avec peu d’amis et des photos volées.",
    explanation: "Souvent un faux compte.",
    options: [
      { label: "Je fais confiance", isCorrect: false },
      { label: "Je reste méfiant", isCorrect: true },
      { label: "Je clique sur les liens", isCorrect: false }
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
  for (const q of QUESTIONS) {
    const exists = await prisma.question.findFirst({
      where: { prompt: q.prompt }
    });

    if (exists) continue;

    await prisma.question.create({
      data: {
        category: q.category,
        prompt: q.prompt,
        explanation: q.explanation,
        options: {
          create: q.options
        }
      }
    });
  }

  const count = await prisma.question.count();
  console.log(`✅ Seed terminé : ${count} questions en base`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });