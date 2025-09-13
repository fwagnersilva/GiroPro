CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			);
CREATE TABLE `abastecimentos` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text NOT NULL,
	`dataAbastecimento` integer NOT NULL,
	`tipoCombustivel` text NOT NULL,
	`quantidadeLitros` real NOT NULL,
	`valorLitro` real NOT NULL,
	`valorTotal` real NOT NULL,
	`kmAtual` integer,
	`nomePosto` text(100),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `abastecimentos_usuario_idx` ON `abastecimentos` (`idUsuario`);
CREATE INDEX `abastecimentos_veiculo_idx` ON `abastecimentos` (`idVeiculo`);
CREATE INDEX `abastecimentos_data_idx` ON `abastecimentos` (`dataAbastecimento`);
CREATE INDEX `abastecimentos_veiculo_data_idx` ON `abastecimentos` (`idVeiculo`,`dataAbastecimento`);
CREATE INDEX `abastecimentos_combustivel_idx` ON `abastecimentos` (`tipoCombustivel`);
CREATE TABLE `despesas` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text,
	`dataDespesa` integer NOT NULL,
	`tipoDespesa` text NOT NULL,
	`valorDespesa` real NOT NULL,
	`descricao` text(300),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `despesas_usuario_idx` ON `despesas` (`idUsuario`);
CREATE INDEX `despesas_veiculo_idx` ON `despesas` (`idVeiculo`);
CREATE INDEX `despesas_data_idx` ON `despesas` (`dataDespesa`);
CREATE INDEX `despesas_tipo_idx` ON `despesas` (`tipoDespesa`);
CREATE INDEX `despesas_usuario_data_idx` ON `despesas` (`idUsuario`,`dataDespesa`);
CREATE TABLE `historico_preco_combustivel` (
	`id` text PRIMARY KEY NOT NULL,
	`cidade` text(100) NOT NULL,
	`estado` text(2) NOT NULL,
	`tipoCombustivel` text NOT NULL,
	`precoMedio` real NOT NULL,
	`dataRegistro` integer DEFAULT (unixepoch()) NOT NULL,
	`fonte` text(100),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer
);
CREATE INDEX `historico_local_idx` ON `historico_preco_combustivel` (`cidade`,`estado`);
CREATE INDEX `historico_combustivel_idx` ON `historico_preco_combustivel` (`tipoCombustivel`);
CREATE INDEX `historico_data_idx` ON `historico_preco_combustivel` (`dataRegistro`);
CREATE INDEX `historico_local_data_idx` ON `historico_preco_combustivel` (`cidade`,`estado`,`dataRegistro`);
CREATE TABLE `jornadas` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text NOT NULL,
	`dataInicio` integer NOT NULL,
	`kmInicio` integer NOT NULL,
	`dataFim` integer,
	`kmFim` integer,
	`ganhoBruto` real,
	`kmTotal` integer,
	`tempoTotal` integer,
	`observacoes` text(500),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `jornadas_usuario_idx` ON `jornadas` (`idUsuario`);
CREATE INDEX `jornadas_veiculo_idx` ON `jornadas` (`idVeiculo`);
CREATE INDEX `jornadas_dataInicio_idx` ON `jornadas` (`dataInicio`);
CREATE INDEX `jornadas_periodo_idx` ON `jornadas` (`dataInicio`,`dataFim`);
CREATE INDEX `jornadas_usuario_data_idx` ON `jornadas` (`idUsuario`,`dataInicio`);
CREATE INDEX `jornadas_status_idx` ON `jornadas` (`dataFim`);
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
CREATE INDEX `logs_usuario_idx` ON `logs_atividades` (`idUsuario`);
CREATE INDEX `logs_tipo_idx` ON `logs_atividades` (`tipoAcao`);
CREATE INDEX `logs_data_idx` ON `logs_atividades` (`dataAcao`);
CREATE INDEX `logs_usuario_data_idx` ON `logs_atividades` (`idUsuario`,`dataAcao`);
CREATE TABLE `metas` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`idVeiculo` text,
	`titulo` text(100) NOT NULL,
	`descricao` text(500),
	`tipoMeta` text NOT NULL,
	`periodoMeta` text NOT NULL,
	`valorObjetivo` real NOT NULL,
	`dataInicio` integer NOT NULL,
	`dataFim` integer NOT NULL,
	`statusMeta` text DEFAULT 'ativa' NOT NULL,
	`valorAtual` real DEFAULT 0 NOT NULL,
	`percentualConcluido` real DEFAULT 0 NOT NULL,
	`dataConclusao` integer,
	`notificacaoEnviada` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idVeiculo`) REFERENCES `veiculos`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `metas_usuario_idx` ON `metas` (`idUsuario`);
CREATE INDEX `metas_veiculo_idx` ON `metas` (`idVeiculo`);
CREATE INDEX `metas_status_idx` ON `metas` (`statusMeta`);
CREATE INDEX `metas_tipo_idx` ON `metas` (`tipoMeta`);
CREATE INDEX `metas_periodo_idx` ON `metas` (`dataInicio`,`dataFim`);
CREATE INDEX `metas_usuario_status_idx` ON `metas` (`idUsuario`,`statusMeta`);
CREATE INDEX `metas_ativas_idx` ON `metas` (`statusMeta`,`dataFim`);
CREATE TABLE `progresso_metas` (
	`id` text PRIMARY KEY NOT NULL,
	`idMeta` text NOT NULL,
	`dataRegistro` integer DEFAULT (unixepoch()) NOT NULL,
	`valorAnterior` real NOT NULL,
	`valorAtual` real NOT NULL,
	`incremento` real NOT NULL,
	`percentualAnterior` integer NOT NULL,
	`percentualAtual` integer NOT NULL,
	`observacoes` text(300),
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`idMeta`) REFERENCES `metas`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `progresso_meta_idx` ON `progresso_metas` (`idMeta`);
CREATE INDEX `progresso_data_idx` ON `progresso_metas` (`dataRegistro`);
CREATE INDEX `progresso_meta_data_idx` ON `progresso_metas` (`idMeta`,`dataRegistro`);
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
CREATE UNIQUE INDEX `usuarios_email_idx` ON `usuarios` (`email`);
CREATE INDEX `usuarios_status_idx` ON `usuarios` (`statusConta`);
CREATE INDEX `usuarios_pontos_idx` ON `usuarios` (`pontosTotal`);
CREATE INDEX `usuarios_nivel_idx` ON `usuarios` (`nivelUsuario`);
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
CREATE INDEX `veiculos_usuario_idx` ON `veiculos` (`idUsuario`);
CREATE UNIQUE INDEX `veiculos_placa_idx` ON `veiculos` (`placa`);
CREATE INDEX `veiculos_ano_idx` ON `veiculos` (`ano`);
CREATE INDEX `veiculos_combustivel_idx` ON `veiculos` (`tipoCombustivel`);
CREATE INDEX `veiculos_usuario_ativo_idx` ON `veiculos` (`idUsuario`,`deletedAt`);
CREATE TABLE `notificacoes` (
	`id` text PRIMARY KEY NOT NULL,
	`idUsuario` text NOT NULL,
	`tipoNotificacao` text NOT NULL,
	`titulo` text(200) NOT NULL,
	`mensagem` text(1000) NOT NULL,
	`dadosExtras` text,
	`lida` integer DEFAULT false NOT NULL,
	`dataEnvio` integer DEFAULT (unixepoch()) NOT NULL,
	`dataLeitura` integer,
	`deletedAt` integer,
	FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `notificacoes_usuario_idx` ON `notificacoes` (`idUsuario`);
CREATE INDEX `notificacoes_tipo_idx` ON `notificacoes` (`tipoNotificacao`);
CREATE INDEX `notificacoes_dataEnvio_idx` ON `notificacoes` (`dataEnvio`);
CREATE INDEX `notificacoes_usuario_lida_idx` ON `notificacoes` (`idUsuario`,`lida`);
