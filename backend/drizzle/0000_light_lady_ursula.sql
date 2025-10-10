CREATE TABLE "abastecimentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid NOT NULL,
	"idVeiculo" uuid NOT NULL,
	"dataAbastecimento" timestamp with time zone NOT NULL,
	"tipoCombustivel" text NOT NULL,
	"litros" real NOT NULL,
	"valorLitro" integer NOT NULL,
	"valorTotal" integer NOT NULL,
	"kmAtual" integer,
	"nomePosto" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "despesas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid NOT NULL,
	"idVeiculo" uuid,
	"dataDespesa" timestamp with time zone NOT NULL,
	"tipoDespesa" text NOT NULL,
	"valorDespesa" integer NOT NULL,
	"descricao" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "jornadas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid NOT NULL,
	"idVeiculo" uuid NOT NULL,
	"dataInicio" timestamp with time zone NOT NULL,
	"kmInicio" integer NOT NULL,
	"dataFim" timestamp with time zone,
	"kmFim" integer,
	"ganhoBruto" integer,
	"lucroLiquidoEstimado" integer DEFAULT 0 NOT NULL,
	"margemLucro" real DEFAULT 0 NOT NULL,
	"kmTotal" integer,
	"duracaoMinutos" integer,
	"custoCombustivelEstimado" integer DEFAULT 0 NOT NULL,
	"outrasDespesas" integer DEFAULT 0 NOT NULL,
	"observacoes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "jornadasFaturamentoPorPlataforma" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idJornada" uuid NOT NULL,
	"idPlataforma" uuid NOT NULL,
	"valor" integer NOT NULL,
	"valorAntesCorte" integer,
	"valorDepoisCorte" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logsAtividades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid,
	"tipoAcao" text NOT NULL,
	"descricao" text,
	"metadados" text,
	"dataAcao" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "metas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid NOT NULL,
	"idVeiculo" uuid,
	"titulo" text NOT NULL,
	"descricao" text,
	"tipoMeta" text NOT NULL,
	"periodoMeta" text NOT NULL,
	"valorObjetivo" integer NOT NULL,
	"dataInicio" timestamp with time zone NOT NULL,
	"dataFim" timestamp with time zone NOT NULL,
	"statusMeta" text DEFAULT 'ativa' NOT NULL,
	"valorAtual" integer DEFAULT 0 NOT NULL,
	"percentualConcluido" integer DEFAULT 0 NOT NULL,
	"dataConclusao" timestamp with time zone,
	"notificacaoEnviada" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "notificacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"tipoNotificacao" text NOT NULL,
	"titulo" text NOT NULL,
	"mensagem" text NOT NULL,
	"dadosExtras" text,
	"lida" boolean DEFAULT false NOT NULL,
	"dataEnvio" timestamp with time zone DEFAULT now() NOT NULL,
	"dataLeitura" timestamp with time zone,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "plataformas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid NOT NULL,
	"nome" text NOT NULL,
	"isPadrao" boolean DEFAULT false NOT NULL,
	"ativa" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "progressoMetas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idMeta" uuid NOT NULL,
	"dataRegistro" timestamp with time zone DEFAULT now() NOT NULL,
	"valorAnterior" integer NOT NULL,
	"valorAtual" integer NOT NULL,
	"incremento" integer NOT NULL,
	"percentualAnterior" integer NOT NULL,
	"percentualAtual" integer NOT NULL,
	"observacoes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senhaHash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"statusConta" text DEFAULT 'ativo' NOT NULL,
	"dataNascimento" timestamp with time zone,
	"cidade" text,
	"dataCadastro" timestamp with time zone DEFAULT now() NOT NULL,
	"pontosTotal" integer DEFAULT 0 NOT NULL,
	"nivelUsuario" text DEFAULT 'iniciante' NOT NULL,
	"conquistasDesbloqueadas" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone,
	"tentativasLogin" integer DEFAULT 0 NOT NULL,
	"ultimoLoginFalhado" timestamp with time zone,
	"ultimaAtividade" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veiculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idUsuario" uuid NOT NULL,
	"marca" text NOT NULL,
	"modelo" text NOT NULL,
	"ano" integer NOT NULL,
	"placa" text NOT NULL,
	"tipoCombustivel" text NOT NULL,
	"tipoUso" text NOT NULL,
	"valorAluguel" integer,
	"valorPrestacao" integer,
	"mediaConsumo" real,
	"dataCadastro" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "abastecimentos" ADD CONSTRAINT "abastecimentos_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abastecimentos" ADD CONSTRAINT "abastecimentos_idVeiculo_veiculos_id_fk" FOREIGN KEY ("idVeiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "despesas" ADD CONSTRAINT "despesas_idVeiculo_veiculos_id_fk" FOREIGN KEY ("idVeiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jornadas" ADD CONSTRAINT "jornadas_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jornadas" ADD CONSTRAINT "jornadas_idVeiculo_veiculos_id_fk" FOREIGN KEY ("idVeiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jornadasFaturamentoPorPlataforma" ADD CONSTRAINT "jornadasFaturamentoPorPlataforma_idJornada_jornadas_id_fk" FOREIGN KEY ("idJornada") REFERENCES "public"."jornadas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jornadasFaturamentoPorPlataforma" ADD CONSTRAINT "jornadasFaturamentoPorPlataforma_idPlataforma_plataformas_id_fk" FOREIGN KEY ("idPlataforma") REFERENCES "public"."plataformas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logsAtividades" ADD CONSTRAINT "logsAtividades_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metas" ADD CONSTRAINT "metas_idVeiculo_veiculos_id_fk" FOREIGN KEY ("idVeiculo") REFERENCES "public"."veiculos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_userId_usuarios_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plataformas" ADD CONSTRAINT "plataformas_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progressoMetas" ADD CONSTRAINT "progressoMetas_idMeta_metas_id_fk" FOREIGN KEY ("idMeta") REFERENCES "public"."metas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_idUsuario_usuarios_id_fk" FOREIGN KEY ("idUsuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "abastecimentos_usuario_idx" ON "abastecimentos" USING btree ("idUsuario");--> statement-breakpoint
CREATE INDEX "abastecimentos_veiculo_idx" ON "abastecimentos" USING btree ("idVeiculo");--> statement-breakpoint
CREATE INDEX "abastecimentos_data_idx" ON "abastecimentos" USING btree ("dataAbastecimento");--> statement-breakpoint
CREATE INDEX "abastecimentos_veiculo_data_idx" ON "abastecimentos" USING btree ("idVeiculo","dataAbastecimento");--> statement-breakpoint
CREATE INDEX "abastecimentos_combustivel_idx" ON "abastecimentos" USING btree ("tipoCombustivel");--> statement-breakpoint
CREATE INDEX "despesas_usuario_idx" ON "despesas" USING btree ("idUsuario");--> statement-breakpoint
CREATE INDEX "despesas_veiculo_idx" ON "despesas" USING btree ("idVeiculo");--> statement-breakpoint
CREATE INDEX "despesas_data_idx" ON "despesas" USING btree ("dataDespesa");--> statement-breakpoint
CREATE INDEX "despesas_tipo_idx" ON "despesas" USING btree ("tipoDespesa");--> statement-breakpoint
CREATE INDEX "despesas_usuario_data_idx" ON "despesas" USING btree ("idUsuario","dataDespesa");--> statement-breakpoint
CREATE INDEX "jornadas_usuario_idx" ON "jornadas" USING btree ("idUsuario");--> statement-breakpoint
CREATE INDEX "jornadas_veiculo_idx" ON "jornadas" USING btree ("idVeiculo");--> statement-breakpoint
CREATE INDEX "jornadas_dataInicio_idx" ON "jornadas" USING btree ("dataInicio");--> statement-breakpoint
CREATE INDEX "jornadas_periodo_idx" ON "jornadas" USING btree ("dataInicio","dataFim");--> statement-breakpoint
CREATE INDEX "jornadas_usuario_data_idx" ON "jornadas" USING btree ("idUsuario","dataInicio");--> statement-breakpoint
CREATE INDEX "jornadas_status_idx" ON "jornadas" USING btree ("dataFim");--> statement-breakpoint
CREATE UNIQUE INDEX "jornadasFaturamento_jornada_plataforma_idx" ON "jornadasFaturamentoPorPlataforma" USING btree ("idJornada","idPlataforma");--> statement-breakpoint
CREATE INDEX "jornadasFaturamento_jornada_idx" ON "jornadasFaturamentoPorPlataforma" USING btree ("idJornada");--> statement-breakpoint
CREATE INDEX "jornadasFaturamento_plataforma_idx" ON "jornadasFaturamentoPorPlataforma" USING btree ("idPlataforma");--> statement-breakpoint
CREATE INDEX "logsAtividades_usuario_idx" ON "logsAtividades" USING btree ("idUsuario");--> statement-breakpoint
CREATE INDEX "logsAtividades_tipo_idx" ON "logsAtividades" USING btree ("tipoAcao");--> statement-breakpoint
CREATE INDEX "logsAtividades_data_idx" ON "logsAtividades" USING btree ("dataAcao");--> statement-breakpoint
CREATE INDEX "logsAtividades_usuario_data_idx" ON "logsAtividades" USING btree ("idUsuario","dataAcao");--> statement-breakpoint
CREATE INDEX "metas_usuario_idx" ON "metas" USING btree ("idUsuario");--> statement-breakpoint
CREATE INDEX "metas_veiculo_idx" ON "metas" USING btree ("idVeiculo");--> statement-breakpoint
CREATE INDEX "metas_status_idx" ON "metas" USING btree ("statusMeta");--> statement-breakpoint
CREATE INDEX "metas_tipo_idx" ON "metas" USING btree ("tipoMeta");--> statement-breakpoint
CREATE INDEX "metas_periodo_idx" ON "metas" USING btree ("dataInicio","dataFim");--> statement-breakpoint
CREATE INDEX "metas_usuario_status_idx" ON "metas" USING btree ("idUsuario","statusMeta");--> statement-breakpoint
CREATE INDEX "metas_ativas_idx" ON "metas" USING btree ("statusMeta","dataFim");--> statement-breakpoint
CREATE INDEX "notificacoes_usuario_idx" ON "notificacoes" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "notificacoes_tipo_idx" ON "notificacoes" USING btree ("tipoNotificacao");--> statement-breakpoint
CREATE INDEX "notificacoes_dataEnvio_idx" ON "notificacoes" USING btree ("dataEnvio");--> statement-breakpoint
CREATE INDEX "notificacoes_usuario_lida_idx" ON "notificacoes" USING btree ("userId","lida");--> statement-breakpoint
CREATE INDEX "plataformas_usuario_idx" ON "plataformas" USING btree ("idUsuario");--> statement-breakpoint
CREATE UNIQUE INDEX "plataformas_nome_unico_idx" ON "plataformas" USING btree ("idUsuario","nome");--> statement-breakpoint
CREATE INDEX "progressoMetas_meta_idx" ON "progressoMetas" USING btree ("idMeta");--> statement-breakpoint
CREATE INDEX "progressoMetas_data_idx" ON "progressoMetas" USING btree ("dataRegistro");--> statement-breakpoint
CREATE INDEX "progressoMetas_meta_data_idx" ON "progressoMetas" USING btree ("idMeta","dataRegistro");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");--> statement-breakpoint
CREATE INDEX "usuarios_status_idx" ON "usuarios" USING btree ("statusConta");--> statement-breakpoint
CREATE INDEX "usuarios_pontos_idx" ON "usuarios" USING btree ("pontosTotal");--> statement-breakpoint
CREATE INDEX "usuarios_nivel_idx" ON "usuarios" USING btree ("nivelUsuario");--> statement-breakpoint
CREATE INDEX "veiculos_usuario_idx" ON "veiculos" USING btree ("idUsuario");--> statement-breakpoint
CREATE UNIQUE INDEX "veiculos_placa_idx" ON "veiculos" USING btree ("placa");--> statement-breakpoint
CREATE INDEX "veiculos_ano_idx" ON "veiculos" USING btree ("ano");--> statement-breakpoint
CREATE INDEX "veiculos_combustivel_idx" ON "veiculos" USING btree ("tipoCombustivel");--> statement-breakpoint
CREATE INDEX "veiculos_usuario_ativo_idx" ON "veiculos" USING btree ("idUsuario","deletedAt");