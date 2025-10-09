

ALTER TABLE `abastecimentos` RENAME COLUMN `litros` TO `quantidade_litros`;
ALTER TABLE `abastecimentos` RENAME COLUMN `valorLitro` TO `valor_litro`;

CREATE TABLE `jornadasFaturamentoPorPlataforma` (
	`id` text PRIMARY KEY NOT NULL,
	`idJornada` text NOT NULL,
	`idPlataforma` text NOT NULL,
	`valor` integer NOT NULL,
	`valorAntesCorte` integer,
	`valorDepoisCorte` integer,
	FOREIGN KEY (`idJornada`) REFERENCES `jornadas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idPlataforma`) REFERENCES `plataformas`(`id`) ON UPDATE no action ON DELETE cascade
);

