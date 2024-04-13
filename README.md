# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "khannedy",
  "password" : "rahasia",
  "name" : "Eko Khannedy"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "khannedy",
    "name" : "Eko Khannedy"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "khannedy",
  "password" : "rahasia"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "khannedy",
    "name" : "Eko Khannedy",
    "token" : "uuid"
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
    "username" : "khannedy",
    "name" : "Eko Khannedy"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
- X-API-TOKEN : token

Request Body :

```json
{
  "password" : "rahasia", // tidak wajib
  "name" : "Eko Khannedy" // tidak wajib
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "khannedy",
    "name" : "Eko Khannedy"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized, ..."
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
  "errors" : "Unauthorized, ..."
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
  "first_name" : "Eko Kurniawan",
  "last_name" : "Khannedy",
  "email" : "eko@example.com",
  "phone" : "089999999"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "email" : "eko@example.com",
    "phone" : "089999999"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "first_name must not blank, ..."
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
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "email" : "eko@example.com",
    "phone" : "089999999"
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
  "first_name" : "Eko Kurniawan",
  "last_name" : "Khannedy",
  "email" : "eko@example.com",
  "phone" : "089999999"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "first_name" : "Eko Kurniawan",
    "last_name" : "Khannedy",
    "email" : "eko@example.com",
    "phone" : "089999999"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "first_name must not blank, ..."
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
      "first_name" : "Eko Kurniawan",
      "last_name" : "Khannedy",
      "email" : "eko@example.com",
      "phone" : "089999999"
    },
    {
      "id" : 2,
      "first_name" : "Eko Kurniawan",
      "last_name" : "Khannedy",
      "email" : "eko@example.com",
      "phone" : "089999999"
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
  "street" : "Jalan Apa",
  "city" : "Kota Apa",
  "province" : "Provinsi Apa",
  "country" : "Negara Apa",
  "postal_code" : "23123"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "id" : 1,
    "street" : "Jalan Apa",
    "city" : "Kota Apa",
    "province" : "Provinsi Apa",
    "country" : "Negara Apa",
    "postal_code" : "23123"
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
    "street" : "Jalan Apa",
    "city" : "Kota Apa",
    "province" : "Provinsi Apa",
    "country" : "Negara Apa",
    "postal_code" : "23123"
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
  "street" : "Jalan Apa",
  "city" : "Kota Apa",
  "province" : "Provinsi Apa",
  "country" : "Negara Apa",
  "postal_code" : "23123"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "id" : 1,
    "street" : "Jalan Apa",
    "city" : "Kota Apa",
    "province" : "Provinsi Apa",
    "country" : "Negara Apa",
    "postal_code" : "23123"
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
      "street" : "Jalan Apa",
      "city" : "Kota Apa",
      "province" : "Provinsi Apa",
      "country" : "Negara Apa",
      "postal_code" : "23123"
    },
    {
      "id" : 2,
      "street" : "Jalan Apa",
      "city" : "Kota Apa",
      "province" : "Provinsi Apa",
      "country" : "Negara Apa",
      "postal_code" : "23123"
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