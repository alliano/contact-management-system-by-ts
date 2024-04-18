# Setup

Create .env file
``` shell
DATABASE_URL="mysql://root:secreetPass@localhost:3306/typescript_restfull_api?schema=public&connection_limit=30"
```

``` shell
npm install
```

``` shell
npx prisma migrate dev
```

``` shell
npx prisma generate
```

``` shell
tsc
```
``` shell
npm run build
```

``` shell
npm run start
```