-- Aggiornamento tabella "User" per conformità GDPR (Co-titolarità ORUM & Morgana)
-- Eseguire questo script per allineare il database manualmentese non si usa Prisma Migrate

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "consenso_marketing_orum" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "consenso_marketing_morgana" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "accettazione_termini_condivisi" BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN "User"."consenso_marketing_orum" IS 'Consenso per comunicazioni marketing e news da parte di ORUM';
COMMENT ON COLUMN "User"."consenso_marketing_morgana" IS 'Consenso per comunicazioni marketing e news da parte di Associazione Morgana';
COMMENT ON COLUMN "User"."accettazione_termini_condivisi" IS 'Accettazione dei termini di servizio e privacy policy in co-titolarità';
