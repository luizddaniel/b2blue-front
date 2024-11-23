
# Instruções de Instalação

Siga os passos abaixo para configurar o ambiente e executar o projeto.

---

## Pré-requisitos

Certifique-se de ter os seguintes requisitos instalados em sua máquina:

- Node.js (versão recomendada: v14.21.3 ou superior)
- NPM (ou Yarn, dependendo da sua preferência)
- Backend em execução (configurado para responder às rotas definidas)

---

## Passos para Instalação

1. **Clone este repositório:**

   ```bash
   git clone git@github.com:luizddaniel/b2blue-front.git
   cd b2blue-front
   ```

2. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`:**

   - Crie um arquivo `.env` na raiz do projeto.
   - Use o arquivo de exemplo `.env.example` como referência:

     ```bash
     cp .env.example .env
     ```

   - Configure as variáveis no `.env` conforme necessário. Por exemplo:

     ```
     REACT_APP_API_BASE_URL=http://localhost:8000/api
     ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   ```

5. **Acesse a aplicação no navegador:**

   O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Notas

- Certifique-se de que o backend esteja em execução e acessível no endereço configurado na variável `REACT_APP_API_BASE_URL` no arquivo `.env`.
- Para suporte ou dúvidas, entre em contato com o administrador do projeto.
