# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "allianoanonymous@gmail.com",
  "password" : "secreetPass",
  "name" : "Allano"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "alliananonymous@gmail.com",
    "name" : "Alliano"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username is required"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "allianoanonymous@gmail.com",
  "password" : "secreetPass"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "allianoanonymous@gmail.com",
    "name" : "Alliano",
    "token" : "token"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password wrong, ..."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "allianoanonymous@gmail.com",
    "name" : "Alliano",
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "password" : "secreetPass",// optional
  "name" : "Alliano"// optional
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "allianoanonymous@gmail.com",
    "name" : "Alliano",
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "first_name" : "Audia Naila",
  "last_name" : "Safa",
  "email" : "audiaalli@gmail.com",
  "phone" : "08123345345"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Audia Naila",
    "last_name" : "Safa",
    "email" : "audiaalli@gmail.com",
    "phone" : "08123345345"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "first_name must not blank"
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Audia Naila",
    "last_name" : "Safa",
    "email" : "audiaalli@gmail.com",
    "phone" : "08123345345"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Contact is not found"
}
```

## Update Contact

Endpoint : PUT /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "first_name" : "Audia Naila",
  "last_name" : "Safa",
  "email" : "audiaalli@gmail.com",
  "phone" : "08123345345"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Audia Naila",
    "last_name" : "Safa",
    "email" : "audiaalli@gmail.com",
    "phone" : "08123345345"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "first_name must not blank"
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:id

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Contact is not found"
}
```

## Search Contact

Endpoint : GET /api/contacts

Query Parameter :
- name : string, contact first name or contact last name, optional
- phone : string, contact phone, optional
- email : string, contact email, optional
- page : number, default 1
- size : number, default 10

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
      "id" : 1,
      "first_name" : "Audia Naila",
      "last_name" : "Safa",
      "email" : "audiaalli@gmail.com",
      "phone" : "08123345345"
    },
    {
      "id" : 2,
      "first_name" : "Abdillah",
      "last_name" : "Alli",
      "email" : "alliaudia@gmail.com",
      "phone" : "08219938523"
    }
  ],
  "paging" : {
    "current_page" : 1,
    "total_page" : 10,
    "size" : 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:idContact/addresses

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "street" : "Al-Kausar",
  "city" : "Atlantis",
  "province" : "Majapahit",
  "country" : "Majapahit",
  "postal_code" : "2123"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "id" : 1,
    "street" : "Al-Kausar",
    "city" : "Atlantis",
    "province" : "Majapahit",
    "country" : "Majapahit",
    "postal_code" : "2123"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "postal_code is required"
}
```

## Get Address

Endpoint : GET /api/contacts/:idContact/addresses/:idAddress

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "street" : "Al-Kausar",
    "city" : "Atlantis",
    "province" : "Majapahit",
    "country" : "Majapahit",
    "postal_code" : "2123"
  }
}
```

Response Body (Failed) : 

```json
{
  "errors" : "Address is not found"
}
```

## Update Address

Endpoint : PUT /api/contacts/:idContact/addresses/:idAddress

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "street" : "Al-Kausar",
  "city" : "ANCHOR WAT",
  "province" : "Majapahit",
  "country" : "Majapahit",
  "postal_code" : "2123"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "street" : "Al-Kausar",
    "city" : "ANCHOR WAT",
    "province" : "Majapahit",
    "country" : "Majapahit",
    "postal_code" : "2123"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "postal_code is required"
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:idContact/addresses/:idAddress

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : "OK"
}
```

Response Body (Failed) :

```json
{
  "errors" : "Address is not found"
}
```

## List Address

Endpoint : GET /api/contacts/:idContact/addresses

Request Header :
- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data" : [
    {
      "id" : 1,
      "street" : "Al-Kausar",
      "city" : "ANCHOR WAT",
      "province" : "Majapahit",
      "country" : "Majapahit",
      "postal_code" : "2123"
    },
    {
      "id" : 2,
      "street" : "Al-Kausar",
      "city" : "ANCHOR WAT",
      "province" : "Majapahit",
      "country" : "Majapahit",
      "postal_code" : "2123"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors" : "Contact is not found"
}
```