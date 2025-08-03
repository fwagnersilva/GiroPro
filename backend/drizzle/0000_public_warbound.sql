CREATE TYPE "public"."status_conta" AS ENUM('Ativo', 'Inativo', 'Suspenso');--> statement-breakpoint
CREATE TYPE "public"."tipo_combustivel" AS ENUM('Gasolina', 'Etanol', 'Diesel', 'GNV', 'Flex');--> statement-breakpoint
CREATE TYPE "public"."tipo_despesa" AS ENUM('Manutencao', 'Pneus', 'Seguro', 'Outros');--> statement-breakpoint
CREATE TYPE "public"."tipo_uso" AS ENUM('Proprio', 'Alugado', 'Financiado');--> statement-breakpoint
CREATE TABLE "abastecimentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid NOT NULL,
	"id_veiculo" uuid NOT NULL,
	"data_abastecimento" timestamp with time zone NOT NULL,
	"tipo_combustivel" "tipo_combustivel" NOT NULL,
	"quantidade_litros" integer NOT NULL,
	"valor_litro" integer NOT NULL,
	"valor_total" integer NOT NULL,
	"km_atual" integer,
	"nome_posto" varchar(255),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "despesas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid NOT NULL,
	"id_veiculo" uuid,
	"data_despesa" timestamp with time zone NOT NULL,
	"tipo_despesa" "tipo_despesa" NOT NULL,
	"valor_despesa" integer NOT NULL,
	"descricao" text,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "historico_preco_combustivel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cidade" varchar(255) NOT NULL,
	"estado" varchar(2) NOT NULL,
	"tipo_combustivel" "tipo_combustivel" NOT NULL,
	"preco_medio" integer NOT NULL,
	"data_registro" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "jornadas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid NOT NULL,
	"id_veiculo" uuid NOT NULL,
	"data_inicio" timestamp with time zone NOT NULL,
	"km_inicio" integer NOT NULL,
	"data_fim" timestamp with time zone,
	"km_fim" integer,
	"ganho_bruto" integer,
	"km_total" integer,
	"tempo_total" integer,
	"observacoes" text,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "logs_atividades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid,
	"tipo_acao" varchar(100) NOT NULL,
	"descricao" text,
	"data_acao" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha_hash" text NOT NULL,
	"status_conta" "status_conta" DEFAULT 'Ativo' NOT NULL,
	"data_cadastro" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "veiculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_usuario" uuid NOT NULL,
	"marca" varchar(100) NOT NULL,
	"modelo" varchar(100) NOT NULL,
	"ano" integer NOT NULL,
	"placa" varchar(7) NOT NULL,
	"tipo_combustivel" "tipo_combustivel" NOT NULL,
	"tipo_uso" "tipo_uso" NOT NULL,
	"valor_aluguel" integer,
	"valor_prestacao" integer,
	"media_consumo" integer,
	"data_cadastro" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "veiculos_placa_unique" UNIQUE("placa")
);
--> statement-breakpoint
ALTER TABLE "abastecimentos" ADD CONSTRAINT "abastecimentos_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abastecimentos" ADD CONSTRAINT "abastecimentos_id_veiculo_veiculos_id_fk" FOREIGN KEY ("id_veiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_id_veiculo_veiculos_id_fk" FOREIGN KEY ("id_veiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jornadas" ADD CONSTRAINT "jornadas_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jornadas" ADD CONSTRAINT "jornadas_id_veiculo_veiculos_id_fk" FOREIGN KEY ("id_veiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_atividades" ADD CONSTRAINT "logs_atividades_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;