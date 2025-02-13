import { Collection } from '@/types'

const testMd = `# Hypersomnia ☀

## Test 

### markdown

A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

### Bulleted Lists

* [ ] todo
* [x] done

### Numbered List

1. one
2. two

A table:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Column 1 | Row 1, Column 2 | Row 1, Column 3 |
| Row 2, Column 1 | Row 2, Column 2 | Row 2, Column 3 |
| Row 3, Column 1 | Row 3, Column 2 | Row 3, Column 3 |`

export const initialCollections: Collection[] = [
  {
    id: 'test-collection',
    title: 'Test Collection',
    description: 'Description',
    fileSystem: [
      {
        id: '6444b39f-2622-44a3-93a2-995687047720',
        name: 'Your Local Endpoint',
        request: {
          url: 'http://localhost:3000',
          options: {
            method: 'get',
          },
          doc: `# Localhost

To use Hypersomnia with your local server, you need to ensure that your server is configured to accept requests from origin hypersomnia.vercel.app.

Sadly, it's CORS configuration.
          
## Run Hypersomnia Locally

Hypersomnia is a Next.js open-source application. You can clone the [repository](https://github.com/ViniciusCestarii/Hypersomnia) and run it locally.`,
        },
      },
      {
        id: 'b17cd125-a12a-49e3-b974-ee7bb70ba5ff',
        name: 'Get User Post by Id',
        request: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          doc: testMd,
          headers: [
            {
              id: 'f4b3a0d1-6c1c-4d2c-9f3f-1b0b1d5c3c9e',
              key: 'Content-Type',
              value: 'application/json',
              enabled: true,
            },
          ],
          queryParameters: [
            {
              id: '22d4ae2e-d37b-4538-a37a-c8b009c8886f',
              key: 'userId',
              value: '1',
              enabled: true,
            },
            {
              id: '119556a5-411f-4956-8ed0-75e1f8660044',
              key: 'today',
              enabled: false,
            },
          ],
          options: {
            method: 'get',
          },
        },
      },
      {
        id: 'a08729b1-f892-4ebe-b093-94ec7a9942d8',
        name: 'Get All Users',
        request: {
          url: 'https://jsonplaceholder.typicode.com/users',
          options: {
            method: 'get',
          },
        },
      },
      {
        id: '1d6f4cc2-ef00-499d-8167-bb501c9ba6ce',
        name: 'Create Post',
        request: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          body: {
            type: 'json',
            content:
              '{\n    "title": "foo",\n    "body": "bar",\n    "userId": 1\n}',
          },
          options: {
            method: 'post',
          },
        },
      },
      {
        id: '77bba476-a16e-4328-8b90-81674b97ae69',
        name: 'Update Post',
        request: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          body: {
            type: 'json',
            content:
              '{\n    "title": "foo",\n    "body": "bar",\n    "id": 1\n}',
          },
          options: {
            method: 'put',
          },
        },
      },
      {
        id: '77bba476-a14e-4328-8b90-12674b97ae69',
        name: 'Basic Auth',
        request: {
          url: 'https://httpbin.org/basic-auth/user/pass',
          auth: {
            type: 'basic',
            enabled: true,
            data: {
              username: 'user',
              password: 'pass',
            },
          },
          options: {
            method: 'get',
          },
        },
      },
      {
        id: '742aa476-a16e-4328-8b90-81674b97ae69',
        name: 'Get Cookie',
        request: {
          url: 'https://yummy-cookies.vercel.app',
          options: {
            method: 'get',
          },
        },
      },
      {
        id: '742aa476-a16e-4328-8b90-81674b97a232',
        name: 'Get Brazil PIB',
        request: {
          url: 'https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/-6/variaveis/9808',
          options: {
            method: 'get',
          },
          queryParameters: [
            {
              id: '2692d070-64ae-4189-8637-25850b849c73',
              key: 'localidades',
              value: 'N1[all]',
              enabled: true,
            },
          ],
          doc: `# Brazil PIB
          
Get Brazil PIB data from IBGE API.

\`\`\`json
[
  {
    "id": "9808",
    "variavel": "PIB - valores correntes",
    "unidade": "Milhões de Reais",
    "resultados": [
      {
        "classificacoes": [],
        "series": [
          {
            "localidade": {
              "id": "1",
              "nivel": {
                "id": "N1",
                "nome": "Brasil"
              },
              "nome": "Brasil"
            },
            "serie": {
              "2016": "6269328",
              "2017": "6585479",
              "2018": "7004141",
              "2019": "7389131",
              "2020": "7609597",
              "2021": "9012142"
            }
          }
        ]
      }
    ]
  }
]
\`\`\`
              `,
        },
      },
      {
        id: '742aa476-a16e-4328-8b90-81674237a232',
        name: 'Get Brazil IBGE "Agregados"',
        request: {
          url: 'https://servicodados.ibge.gov.br/api/v3/agregados',
          options: {
            method: 'get',
          },
        },
      },
      {
        id: 'fa000186-7198-4b35-8d5b-a229c5de38e5',
        name: 'Get Hypersomnia HTML',
        request: {
          url: 'https://hypersomnia.vercel.app/home',
          doc: `# CORS Warning

## Blocked by Browser: 

Browsers enforce CORS policies to prevent unauthorized cross-origin requests. This means that if you try to make requests of websites that do not have CORS enabled, the browser will block the request.
          `,
          options: {
            method: 'get',
          },
        },
      },
    ],
  },
]
