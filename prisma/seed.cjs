const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const questions = [
  {
    category: "EMAIL",
    prompt:
      "Tu reçois un email : “Votre compte sera suspendu dans 1h. Cliquez ici pour vérifier votre identité.” Quel est le bon réflexe ?",
    explanation:
      "L’urgence est un signal classique. Ne clique pas. Va sur le site officiel en tapant l’adresse toi-même.",
    options: [
      { label: "Je clique vite", isCorrect: false },
      { label: "Je vais sur le site officiel manuellement", isCorrect: true },
      { label: "Je réponds avec mes infos", isCorrect: false }
    ]
  },
  {
    category: "EMAIL",
    prompt:
      "Un email “Facture impayée” contient une pièce jointe “facture.zip”. Tu n’attends rien. Que fais-tu ?",
    explanation:
      "Les .zip peuvent cacher des malwares. En cas de doute : ne pas ouvrir, vérifier la source.",
    options: [
      { label: "Je l’ouvre", isCorrect: false },
      { label: "Je vérifie l’expéditeur / contexte puis supprime si doute", isCorrect: true },
      { label: "Je transfère à un ami", isCorrect: false }
    ]
  }
];

async function main() {
  for (const q of questions) {
    // On évite les doublons en cherchant par prompt (simple)
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
  console.log(`✅ Seed terminé. Total questions en DB : ${count}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
