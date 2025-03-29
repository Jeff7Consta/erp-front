#!/bin/bash

# Configurar nome e email
git config --global user.name "Jeff7Consta"
git config --global user.email "jeffersonreis66@gmail.com"

# Entrar na pasta do projeto
cd /opt/erp-admin || exit

# Inicializar repositório (se não estiver iniciado)
if [ ! -d .git ]; then
    git init
fi

# Garantir que o remote 'origin' aponte pro repositório correto
git remote remove origin 2>/dev/null
git remote add origin https://github.com/Jeff7Consta/erp-front.git

# Adicionar e commitar
git add .
git commit -m "Subindo projeto ERP Front 0.1"

# Setar branch principal e subir
git branch -M main
git push -u origin main --force
