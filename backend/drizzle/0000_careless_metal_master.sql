CREATE TABLE `abastecimentos` (
	`id` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`id_veiculo` text NOT NULL,
	`data_abastecimento` text NOT NULL,
	`km_atual` integer NOT NULL,
	`litros` real NOT NULL,
	`valor_total` integer NOT NULL,
	`preco_litro` integer NOT NULL,
	`posto` text,
	`tipo_combustivel` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `despesas` (
	`id` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`id_veiculo` text,
	`data_despesa` text NOT NULL,
	`tipo_despesa` text NOT NULL,
	`valor_despesa` integer NOT NULL,
	`descricao` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `jornadas` (
	`id` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`id_veiculo` text NOT NULL,
	`data_inicio` text NOT NULL,
	`km_inicio` integer NOT NULL,
	`data_fim` text,
	`km_fim` integer,
	`ganho_bruto` integer,
	`km_total` integer,
	`tempo_total` integer,
	`observacoes` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `metas` (
	`id` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`id_veiculo` text,
	`titulo` text NOT NULL,
	`descricao` text,
	`tipo_meta` text NOT NULL,
	`periodo` text NOT NULL,
	`valor_objetivo` integer NOT NULL,
	`valor_atual` integer DEFAULT 0 NOT NULL,
	`percentual_concluido` integer DEFAULT 0 NOT NULL,
	`data_inicio` text NOT NULL,
	`data_fim` text NOT NULL,
	`data_conclusao` text,
	`status` text DEFAULT 'Ativa' NOT NULL,
	`data_criacao` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `notificacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`titulo` text NOT NULL,
	`mensagem` text NOT NULL,
	`tipo` text DEFAULT 'Sistema' NOT NULL,
	`lida` integer DEFAULT 0 NOT NULL,
	`data_envio` text NOT NULL,
	`data_leitura` text,
	`dados_extras` text,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `progresso_metas` (
	`id` text PRIMARY KEY NOT NULL,
	`id_meta` text NOT NULL,
	`data_registro` text NOT NULL,
	`valor_atual` integer NOT NULL,
	`valor_anterior` integer DEFAULT 0 NOT NULL,
	`incremento` integer DEFAULT 0 NOT NULL,
	`percentual_atingido` integer NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`senha_hash` text NOT NULL,
	`status_conta` text DEFAULT 'Ativo' NOT NULL,
	`data_cadastro` text NOT NULL,
	`pontos_total` integer DEFAULT 0 NOT NULL,
	`nivel_usuario` text DEFAULT 'Iniciante' NOT NULL,
	`conquistas_desbloqueadas` integer DEFAULT 0 NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `veiculos` (
	`id` text PRIMARY KEY NOT NULL,
	`id_usuario` text NOT NULL,
	`marca` text NOT NULL,
	`modelo` text NOT NULL,
	`ano` integer NOT NULL,
	`placa` text NOT NULL,
	`tipo_combustivel` text NOT NULL,
	`tipo_uso` text NOT NULL,
	`valor_aluguel` integer,
	`valor_prestacao` integer,
	`media_consumo` integer,
	`data_cadastro` text NOT NULL,
	`deleted_at` text
);
