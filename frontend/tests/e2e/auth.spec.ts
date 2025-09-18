import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('/');
  });

  test('deve navegar até a tela de registro', async ({ page }) => {
    // Procurar pelo link ou botão de registro
    const registerButton = page.locator('text=Registrar').or(page.locator('text=Criar conta')).or(page.locator('[data-testid="register-button"]'));
    
    // Verificar se o botão existe
    await expect(registerButton).toBeVisible();
    
    // Clicar no botão de registro
    await registerButton.click();
    
    // Verificar se chegou na tela de registro
    await expect(page).toHaveURL(/.*register.*/);
    
    // Verificar se os campos de registro estão visíveis
    await expect(page.locator('input[name="nome"]').or(page.locator('input[placeholder*="nome"]'))).toBeVisible();
    await expect(page.locator('input[name="email"]').or(page.locator('input[type="email"]'))).toBeVisible();
    await expect(page.locator('input[name="senha"]').or(page.locator('input[type="password"]'))).toBeVisible();
  });

  test('deve preencher o formulário de registro com campos válidos', async ({ page }) => {
    // Navegar para a tela de registro
    const registerButton = page.locator('text=Registrar').or(page.locator('text=Criar conta')).or(page.locator('[data-testid="register-button"]'));
    await registerButton.click();
    
    // Preencher os campos do formulário
    const nomeField = page.locator('input[name="nome"]').or(page.locator('input[placeholder*="nome"]'));
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]'));
    const senhaField = page.locator('input[name="senha"]').or(page.locator('input[type="password"]'));
    
    await nomeField.fill('João Silva');
    await emailField.fill('joao.silva@teste.com');
    await senhaField.fill('senha123');
    
    // Verificar se os campos foram preenchidos
    await expect(nomeField).toHaveValue('João Silva');
    await expect(emailField).toHaveValue('joao.silva@teste.com');
    await expect(senhaField).toHaveValue('senha123');
  });

  test('deve submeter o formulário de registro', async ({ page }) => {
    // Navegar para a tela de registro
    const registerButton = page.locator('text=Registrar').or(page.locator('text=Criar conta')).or(page.locator('[data-testid="register-button"]'));
    await registerButton.click();
    
    // Preencher os campos do formulário
    await page.locator('input[name="nome"]').or(page.locator('input[placeholder*="nome"]')).fill('João Silva');
    await page.locator('input[name="email"]').or(page.locator('input[type="email"]')).fill('joao.silva@teste.com');
    await page.locator('input[name="senha"]').or(page.locator('input[type="password"]')).fill('senha123');
    
    // Submeter o formulário
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=Registrar')).or(page.locator('[data-testid="submit-button"]'));
    await submitButton.click();
    
    // Aguardar resposta (pode ser redirecionamento ou mensagem)
    await page.waitForTimeout(2000);
  });

  test('deve navegar até a tela de login', async ({ page }) => {
    // Procurar pelo link ou botão de login
    const loginButton = page.locator('text=Login').or(page.locator('text=Entrar')).or(page.locator('[data-testid="login-button"]'));
    
    // Verificar se o botão existe
    await expect(loginButton).toBeVisible();
    
    // Clicar no botão de login
    await loginButton.click();
    
    // Verificar se chegou na tela de login
    await expect(page).toHaveURL(/.*login.*/);
    
    // Verificar se os campos de login estão visíveis
    await expect(page.locator('input[name="email"]').or(page.locator('input[type="email"]'))).toBeVisible();
    await expect(page.locator('input[name="senha"]').or(page.locator('input[type="password"]'))).toBeVisible();
  });

  test('deve preencher o formulário de login com credenciais válidas', async ({ page }) => {
    // Navegar para a tela de login
    const loginButton = page.locator('text=Login').or(page.locator('text=Entrar')).or(page.locator('[data-testid="login-button"]'));
    await loginButton.click();
    
    // Preencher os campos do formulário
    const emailField = page.locator('input[name="email"]').or(page.locator('input[type="email"]'));
    const senhaField = page.locator('input[name="senha"]').or(page.locator('input[type="password"]'));
    
    await emailField.fill('joao.silva@teste.com');
    await senhaField.fill('senha123');
    
    // Verificar se os campos foram preenchidos
    await expect(emailField).toHaveValue('joao.silva@teste.com');
    await expect(senhaField).toHaveValue('senha123');
  });

  test('deve submeter o formulário de login', async ({ page }) => {
    // Navegar para a tela de login
    const loginButton = page.locator('text=Login').or(page.locator('text=Entrar')).or(page.locator('[data-testid="login-button"]'));
    await loginButton.click();
    
    // Preencher os campos do formulário
    await page.locator('input[name="email"]').or(page.locator('input[type="email"]')).fill('joao.silva@teste.com');
    await page.locator('input[name="senha"]').or(page.locator('input[type="password"]')).fill('senha123');
    
    // Submeter o formulário
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=Entrar')).or(page.locator('[data-testid="submit-button"]'));
    await submitButton.click();
    
    // Aguardar resposta (pode ser redirecionamento ou mensagem)
    await page.waitForTimeout(2000);
  });

  test('deve verificar sucesso do login (redirecionamento para dashboard)', async ({ page }) => {
    // Este teste assume que existe um usuário válido no sistema
    // Em um ambiente real, você criaria um usuário de teste ou usaria mocks
    
    // Navegar para a tela de login
    const loginButton = page.locator('text=Login').or(page.locator('text=Entrar')).or(page.locator('[data-testid="login-button"]'));
    await loginButton.click();
    
    // Preencher com credenciais válidas (assumindo que existem)
    await page.locator('input[name="email"]').or(page.locator('input[type="email"]')).fill('usuario@teste.com');
    await page.locator('input[name="senha"]').or(page.locator('input[type="password"]')).fill('senha123');
    
    // Submeter o formulário
    const submitButton = page.locator('button[type="submit"]').or(page.locator('text=Entrar')).or(page.locator('[data-testid="submit-button"]'));
    await submitButton.click();
    
    // Verificar redirecionamento para dashboard ou página principal
    await expect(page).toHaveURL(/.*dashboard.*|.*home.*|.*main.*/);
    
    // Ou verificar se elementos do dashboard estão visíveis
    await expect(page.locator('text=Dashboard').or(page.locator('text=Painel')).or(page.locator('[data-testid="dashboard"]'))).toBeVisible();
  });
});

