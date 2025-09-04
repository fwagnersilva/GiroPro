# Anotações da Refatoração - GoalsScreen.tsx

## Análise Inicial

O arquivo `GoalsScreen.tsx` é um bom candidato para a refatoração, pois utiliza vários componentes que podem ser substituídos pelos novos padrões do design system.

### Componentes a serem substituídos:

- **Botões:** `TouchableOpacity` será substituído por `InteractiveButton`.
- **Cards:** O `View` que representa o `goalCard` será substituído por `InteractiveCard`.
- **Ícones:** O ícone de lixeira (🗑️) será substituído pelo `TrashIcon` de `EnhancedIcons.tsx`.
- **Estilos:** Cores, fontes e espaçamentos serão atualizados para usar os `enhancedTokens`.
- **Inputs:** `TextInput` será substituído por `FormInput` para padronização.

## Plano de Ação

1.  **Importar os novos componentes:** Adicionar as importações de `InteractiveButton`, `InteractiveCard`, `TrashIcon`, `enhancedTokens` e `FormInput`.
2.  **Refatorar o botão "+ Nova Meta":** Substituir o `TouchableOpacity` por `InteractiveButton`.
3.  **Refatorar o `goalCard`:** Substituir o `View` principal do card por `InteractiveCard`.
4.  **Refatorar o botão de deletar:** Substituir o `TouchableOpacity` com o emoji de lixeira pelo `TrashIcon`.
5.  **Refatorar o formulário de criação de meta:** Substituir os `TextInput` por `FormInput`.
6.  **Atualizar os estilos:** Substituir as cores e outros estilos hardcoded pelos `enhancedTokens`.
7.  **Testar as alterações:** Garantir que a tela continue funcionando como esperado.


