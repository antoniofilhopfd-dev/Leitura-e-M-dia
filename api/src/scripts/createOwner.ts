import "dotenv/config";
import { hashPassword } from "../lib/auth";
import { prisma } from "../lib/prisma";

// Provisiona a conta única do MVP (seção 4 da especificação). Não existe
// cadastro público — rode com: npm run create-owner
// Requer OWNER_NAME, OWNER_EMAIL, OWNER_PASSWORD no .env.
async function main() {
  const name = process.env.OWNER_NAME;
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;

  if (!name || !email || !password) {
    console.error("Defina OWNER_NAME, OWNER_EMAIL e OWNER_PASSWORD no .env antes de rodar este script.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash },
  });

  console.log(`Conta pronta: ${user.email} (id: ${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
