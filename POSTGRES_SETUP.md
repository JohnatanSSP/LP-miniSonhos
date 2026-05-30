# 🗄️ PostgreSQL + Docker — Mini Sonhos

## Setup completo

### 1. Instalar dependências

```bash
npm install prisma @prisma/client
```

### 2. Configurar variáveis de ambiente

Adicione ao seu `.env`:

```env
# PostgreSQL
DATABASE_URL="postgresql://minisonhos:minisonhos_secret@localhost:5432/minisonhos"

# Docker (pgAdmin)
POSTGRES_USER=minisonhos
POSTGRES_PASSWORD=minisonhos_secret
POSTGRES_DB=minisonhos
PGADMIN_EMAIL=admin@minisonhos.com
PGADMIN_PASSWORD=admin123

# Admin
ADMIN_SECRET=troque_essa_senha_em_producao
```

### 3. Subir o banco com Docker

```bash
# Subir PostgreSQL e pgAdmin
docker-compose up -d

# Verificar se está rodando
docker-compose ps
```

### 4. Rodar a migration (criar tabelas)

```bash
npx prisma migrate deploy
```

Ou em desenvolvimento (gera migration automática):

```bash
npx prisma migrate dev --name init
```

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

### 6. Iniciar o Next.js

```bash
npm run dev
```

---

## Estrutura de arquivos adicionados

```
prisma/
  schema.prisma               ← definição das tabelas
  migrations/
    001_init/migration.sql    ← SQL da migration inicial

app/lib/
  prisma.ts                   ← singleton do Prisma Client

docker-compose.yml            ← PostgreSQL + pgAdmin
```

---

## Comandos úteis

```bash
# Ver os dados no banco (UI visual)
npx prisma studio
# Acessa em http://localhost:5555

# pgAdmin (interface web)
# http://localhost:5050
# Email: admin@minisonhos.com / Senha: admin123

# Conectar ao banco direto
docker exec -it minisonhos_db psql -U minisonhos -d minisonhos

# Parar o Docker
docker-compose down

# Apagar tudo (cuidado: apaga os dados!)
docker-compose down -v
```

---

## Para produção (deploy)

Use um serviço gerenciado de PostgreSQL:
- **[Supabase](https://supabase.com)** — gratuito até 500MB, fácil de configurar
- **[Neon](https://neon.tech)** — serverless PostgreSQL, gratuito
- **[Railway](https://railway.app)** — mais simples, pago
- **RDS (AWS)** — se já usa AWS

Apenas troque a `DATABASE_URL` no `.env` de produção. O schema e migrations são os mesmos.
