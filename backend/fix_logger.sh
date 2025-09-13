#!/bin/bash

# Script para corrigir problemas do Logger em todos os arquivos

# Corrigir middlewares/cache.ts
sed -i 's/Logger\./logger\./g' src/middlewares/cache.ts
sed -i '1i const logger = new Logger();' src/middlewares/cache.ts

# Corrigir middlewares/performance.ts  
sed -i 's/Logger\./logger\./g' src/middlewares/performance.ts
sed -i '1i const logger = new Logger();' src/middlewares/performance.ts

# Corrigir middlewares/security.ts
sed -i 's/Logger\./logger\./g' src/middlewares/security.ts
sed -i '1i const logger = new Logger();' src/middlewares/security.ts

# Corrigir routes/admin.ts
sed -i 's/Logger\./logger\./g' src/routes/admin.ts
sed -i '1i const logger = new Logger();' src/routes/admin.ts

# Corrigir routes/analytics.ts
sed -i 's/Logger\./logger\./g' src/routes/analytics.ts
sed -i '1i const logger = new Logger();' src/routes/analytics.ts

# Corrigir services/backupService.ts
sed -i 's/Logger\./logger\./g' src/services/backupService.ts
sed -i '1i const logger = new Logger();' src/services/backupService.ts

# Corrigir services/cacheService.ts
sed -i 's/Logger\./logger\./g' src/services/cacheService.ts
sed -i '1i const logger = new Logger();' src/services/cacheService.ts

# Corrigir services/performanceService.ts
sed -i 's/Logger\./logger\./g' src/services/performanceService.ts
sed -i '1i const logger = new Logger();' src/services/performanceService.ts

echo "Logger fixes applied!"

