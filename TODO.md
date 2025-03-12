- [ ] Centralizar o Error handler
- [ ] Apagar tabelas desnecessárias
- [ ] Apagar métodos desnecessários
- [ ] Aplicar melhorias de revisores de código.
- [ ] Aplicar melhorias de segurança.

Rate Limiting:
Implemente rate limiting nos endpoints de login para prevenir ataques de força bruta.

Token Refresh e Revogação:
Considere implementar refresh tokens para manter a segurança dos tokens de acesso com expirações curtas e possibilitar a revogação dos tokens quando necessário.

Verificação e Validação de Entrada:
Use bibliotecas de validação (como o Zod) para garantir que os dados enviados sejam consistentes e evitar injeções ou dados maliciosos.

Uso de Algoritmos Fortes:
Garanta que o JWT seja assinado com um algoritmo seguro (como HS256 ou RS256) e que a chave secreta esteja armazenada de forma segura (por exemplo, em variáveis de ambiente).

HTTPS:
Em produção, utilize HTTPS para garantir que os tokens e credenciais não sejam interceptados.
