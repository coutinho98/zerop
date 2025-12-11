# ----------------------------------------------------
# 1. ESTÁGIO DE CONSTRUÇÃO (BUILD STAGE)
# Usamos uma imagem Node mais completa para compilação
# ----------------------------------------------------
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala todas as dependências (incluindo as de desenvolvimento)
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Constrói (compila) a aplicação NestJS (cria a pasta 'dist')
RUN npm run build

# ----------------------------------------------------
# 2. ESTÁGIO DE PRODUÇÃO (PRODUCTION STAGE)
# Usamos uma imagem mais leve apenas para rodar o código compilado
# ----------------------------------------------------
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários do estágio de construção
# O package.json e node_modules são necessários para rodar!
COPY package*.json ./
RUN npm install --only=production

# Copia os arquivos compilados (dist) do estágio de construção
COPY --from=builder /app/dist ./dist

# Expõe a porta que o NestJS usa (3000 por padrão)
EXPOSE 3000

# Comando para iniciar a aplicação compilada
CMD [ "node", "dist/main" ]