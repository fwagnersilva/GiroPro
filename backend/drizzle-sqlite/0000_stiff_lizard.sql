CREATE TABLE `abastecimentos` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text NOT NULL,
	`dataAbastecimento` integer NOT NULL,
	`tipoCombustivel` text NOT NULL,
	`quantidadeLitros` real NOT NULL,
	`valorLitro` integer NOT NULL,
	`valorTotal` integer NOT NULL,
	`kmAtual` integer,
	`nomePosto` text(100),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `abastecimentos_usuario_idx` ON `abastecimentos` (`idUsuario`);--> statement-breakpoint
CREATE INDEX `abastecimentos_veiculo_idx` ON `abastecimentos` (`idVeiculo`);--> statement-breakpoint
CREATE INDEX `abastecimentos_data_idx` ON `abastecimentos` (`dataAbastecimento`);--> statement-breakpoint
CREATE INDEX `abastecimentos_veiculo_data_idx` ON `abastecimentos` (`idVeiculo`,`dataAbastecimento`);--> statement-breakpoint
CREATE INDEX `abastecimentos_combustivel_idx` ON `abastecimentos` (`tipoCombustivel`);--> statement-breakpoint
CREATE TABLE `despesas` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text,
	`dataDespesa` integer NOT NULL,
	`tipoDespesa` text NOT NULL,
	`valorDespesa` integer NOT NULL,
	`descricao` text(300),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `despesas_usuario_idx` ON `despesas` (`idUsuario`);--> statement-breakpoint
CREATE INDEX `despesas_veiculo_idx` ON `despesas` (`idVeiculo`);--> statement-breakpoint
CREATE INDEX `despesas_data_idx` ON `despesas` (`dataDespesa`);--> statement-breakpoint
CREATE INDEX `despesas_tipo_idx` ON `despesas` (`tipoDespesa`);--> statement-breakpoint
CREATE INDEX `despesas_usuario_data_idx` ON `despesas` (`idUsuario`,`dataDespesa`);--> statement-breakpoint
CREATE TABLE `historico_preco_combustivel` (
	`id` text PRIMARY KEY NOT NULL,
	`cidade` text(100) NOT NULL,
	`estado` text(2) NOT NULL,
	`tipoCombustivel` text NOT NULL,
	`precoMedio` integer NOT NULL,
	`dataRegistro` integer DEFAULT (unixepoch()) NOT NULL,
	`fonte` text(100),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer
);
--> statement-breakpoint
CREATE INDEX `historico_local_idx` ON `historico_preco_combustivel` (`cidade`,`estado`);--> statement-breakpoint
CREATE INDEX `historico_combustivel_idx` ON `historico_preco_combustivel` (`tipoCombustivel`);--> statement-breakpoint
CREATE INDEX `historico_data_idx` ON `historico_preco_combustivel` (`dataRegistro`);--> statement-breakpoint
CREATE INDEX `historico_local_data_idx` ON `historico_preco_combustivel` (`cidade`,`estado`,`dataRegistro`);--> statement-breakpoint
CREATE TABLE `jornadas` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text NOT NULL,
	`dataInicio` integer NOT NULL,
	`kmInicio` integer NOT NULL,
	`dataFim` integer,
	`kmFim` integer,
	`ganhoBruto` integer,
	`kmTotal` integer,
	`tempoTotal` integer,
	`observacoes` text(500),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `jornadas_usuario_idx` ON `jornadas` (`idUsuario`);--> statement-breakpoint
CREATE INDEX `jornadas_veiculo_idx` ON `jornadas` (`idVeiculo`);--> statement-breakpoint
CREATE INDEX `jornadas_dataInicio_idx` ON `jornadas` (`dataInicio`);--> statement-breakpoint
CREATE INDEX `jornadas_periodo_idx` ON `jornadas` (`dataInicio`,`dataFim`);--> statement-breakpoint
CREATE INDEX `jornadas_usuario_data_idx` ON `jornadas` (`idUsuario`,`dataInicio`);--> statement-breakpoint
CREATE INDEX `jornadas_status_idx` ON `jornadas` (`dataFim`);--> statement-breakpoint
CREATE TABLE `logs_atividades` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text,
	`tipoAcao` text(50) NOT NULL,
	`descricao` text(500),
	`metadados` text,
	`dataAcao` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `logs_usuario_idx` ON `logs_atividades` (`idUsuario`);--> statement-breakpoint
CREATE INDEX `logs_tipo_idx` ON `logs_atividades` (`tipoAcao`);--> statement-breakpoint
CREATE INDEX `logs_data_idx` ON `logs_atividades` (`dataAcao`);--> statement-breakpoint
CREATE INDEX `logs_usuario_data_idx` ON `logs_atividades` (`idUsuario`,`dataAcao`);--> statement-breakpoint
CREATE TABLE `metas` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text,
	`titulo` text(100) NOT NULL,
	`descricao` text(500),
	`tipoMeta` text NOT NULL,
	`periodoMeta` text NOT NULL,
	`valorObjetivo` integer NOT NULL,
	`dataInicio` integer NOT NULL,
	`dataFim` integer NOT NULL,
	`statusMeta` text DEFAULT 'ativa' NOT NULL,
	`valorAtual` integer DEFAULT 0 NOT NULL,
	`percentualConcluido` integer DEFAULT 0 NOT NULL,
	`dataConclusao` integer,
	`notificacaoEnviada` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `metas_usuario_idx` ON `metas` (`idUsuario`);--> statement-breakpoint
CREATE INDEX `metas_veiculo_idx` ON `metas` (`idVeiculo`);--> statement-breakpoint
CREATE INDEX `metas_status_idx` ON `metas` (`statusMeta`);--> statement-breakpoint
CREATE INDEX `metas_tipo_idx` ON `metas` (`tipoMeta`);--> statement-breakpoint
CREATE INDEX `metas_periodo_idx` ON `metas` (`dataInicio`,`dataFim`);--> statement-breakpoint
CREATE INDEX `metas_usuario_status_idx` ON `metas` (`idUsuario`,`statusMeta`);--> statement-breakpoint
CREATE INDEX `metas_ativas_idx` ON `metas` (`statusMeta`,`dataFim`);--> statement-breakpoint
CREATE TABLE `progresso_metas` (
	`id` text PRIMARY KEY NOT NULL,
	`idMeta` text NOT NULL,
	`dataRegistro` integer DEFAULT (unixepoch()) NOT NULL,
	`valorAnterior` integer NOT NULL,
	`valorAtual` integer NOT NULL,
	`incremento` integer NOT NULL,
	`percentualAnterior` integer NOT NULL,
	`percentualAtual` integer NOT NULL,
	`observacoes` text(300),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`idMeta`) REFERENCES `metas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `progresso_meta_idx` ON `progresso_metas` (`idMeta`);--> statement-breakpoint
CREATE INDEX `progresso_data_idx` ON `progresso_metas` (`dataRegistro`);--> statement-breakpoint
CREATE INDEX `progresso_meta_data_idx` ON `progresso_metas` (`idMeta`,`dataRegistro`);--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text(100) NOT NULL,
	`email` text(255) NOT NULL,
	`senhaHash` text(255) NOT NULL,
	`statusConta` text DEFAULT 'ativo' NOT NULL,
	`dataCadastro` integer DEFAULT (unixepoch()) NOT NULL,
	`pontosTotal` integer DEFAULT 0 NOT NULL,
	`nivelUsuario` text DEFAULT 'iniciante' NOT NULL,
	`conquistasDesbloqueadas` integer DEFAULT 0 NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	`tentativasLogin` integer DEFAULT 0 NOT NULL,
	`ultimoLoginFalhado` integer,
	`ultimaAtividade` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_idx` ON `usuarios` (`email`);--> statement-breakpoint
CREATE INDEX `usuarios_status_idx` ON `usuarios` (`statusConta`);--> statement-breakpoint
CREATE INDEX `usuarios_pontos_idx` ON `usuarios` (`pontosTotal`);--> statement-breakpoint
CREATE INDEX `usuarios_nivel_idx` ON `usuarios` (`nivelUsuario`);--> statement-breakpoint
CREATE TABLE `veiculos` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`marca` text(50) NOT NULL,
	`modelo` text(100) NOT NULL,
	`ano` integer NOT NULL,
	`placa` text(8) NOT NULL,
	`tipoCombustivel` text NOT NULL,
	`tipoUso` text NOT NULL,
	`valorAluguel` integer,
	`valorPrestacao` integer,
	`mediaConsumo` real,
	`dataCadastro` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `veiculos_usuario_idx` ON `veiculos` (`idUsuario`);--> statement-breakpoint
CREATE UNIQUE INDEX `veiculos_placa_idx` ON `veiculos` (`placa`);--> statement-breakpoint
CREATE INDEX `veiculos_ano_idx` ON `veiculos` (`ano`);--> statement-breakpoint
CREATE INDEX `veiculos_combustivel_idx` ON `veiculos` (`tipoCombustivel`);--> statement-breakpoint
CREATE INDEX `veiculos_usuario_ativo_idx` ON `veiculos` (`idUsuario`,`deletedAt`);