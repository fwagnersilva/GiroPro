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
--> statement-breakpoint
CREATE INDEX `notificacoes_usuario_idx` ON `notificacoes` (`idUsuario`);--> statement-breakpoint
CREATE INDEX `notificacoes_tipo_idx` ON `notificacoes` (`tipoNotificacao`);--> statement-breakpoint
CREATE INDEX `notificacoes_dataEnvio_idx` ON `notificacoes` (`dataEnvio`);--> statement-breakpoint
CREATE INDEX `notificacoes_usuario_lida_idx` ON `notificacoes` (`idUsuario`,`lida`);