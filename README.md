Ilumeo - Pontos

Node 18+
Docker
Docker Compose


Repositório (back e front)
git clone https://github.com/XVINILX/marcacao-pontos/

## BACK
Repositório back:
- https://github.com/XVINILX/marcacao-pontos
Stacks:
- Node;

Bibliotecas:
- Bcrypt

Deploy:
-  AWS com PM2 e NGINX
  

Rodando back:
docker-compose up --build
Pode usar o env em .env.example;
Back pode ser encontrado em: https://18.231.127.205/

Ao rodar o back, um usuário admin e "empregado" será criado quando a variável NODE_ENV for "DEV"
O Admin terá o login:
email: "superadmin@teste.com",
password: "Teste@123",

## FRONT
Repositório front:
- https://github.com/XVINILX/front-marcacao-pontos

Stacks:
- React


Bibliotecas:
- Antd;
- Axios;

Deploy:
- Digital Ocean
 

Rodando front:
yarn
yarn start
.env

.env deve ter a variável de ambiente:
REACT_APP_API_URL=https://18.231.127.205/
ou apontando para servidor local;
URL 
https://king-prawn-app-yq9ia.ondigitalocean.app/
