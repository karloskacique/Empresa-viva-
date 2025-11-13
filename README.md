## Empresa Viva
<a href="https://www.linkedin.com/in/carlos-eduardo-90762a209/" target="_blank">Autor Carlos Eduardo Freitas Cacique</a>

<!-- [Autor Carlos Eduardo Freitas Cacique](https://www.linkedin.com/in/carlos-eduardo-90762a209/){:target="_blank"} -->

- Projeto desenvolvido na PIT I, foram realizadas atualizações e melhorias com o objetivo de otimizar o desempenho do sistema e torna-lo mais funcional para pequenas empresas prestadoras de serviços.

### Requisitos

- PHP > 8.4
- MySQL > 8.0 ou SQLite
- Node > 21

### Instalação

- Clonar o projeto na maquina
- Rodar `composer install` e depois `npm install`

### Executando o projeto

- Primeiro temos de rodar as migrations e criar nosso banco de dados:

```Bash
php artisan migrate
```

> OBS.: Caso queira usar dados mocados de teste, pode rodar direto com as seeders:
```Bash
php artisan migrate --seed
```

- O usuário de teste é:
```
email: testmaster@example.com
password: master123
```

- Dar permissoes nas pastas para uso e salvar imagens localmente:

```Bash
sudo chmod -R 775 storage
sudo chown -R www-data:www-data storage
```

- Executar dois terminais, em um rodar o Vite:

```Bash
npm run dev
```

- Em outro executar a aplicação

```Bash
php artisan serve
```

- Só abrir o local indicado.

- Desfrute!