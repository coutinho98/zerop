FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários do estágio de construção
# O package.json e node_modules são necessários para rodar!
COPY package*.json ./

# MUDANÇA: Instala TODAS as dependências para uso em ambiente de DESENVOLVIMENTO
RUN npm install 

# Copia os arquivos compilados (dist) do estágio de construção
COPY --from=builder /app/dist ./dist

# Expõe a porta que o NestJS usa (3000 por padrão)
EXPOSE 3000

# Comando para iniciar a aplicação compilada
CMD [ "node", "dist/main" ]