npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
npm install -D @types/passport-jwt @types/bcrypt
npx nest g module auth
npx nest g controller auth --no-spec
npx nest g service auth --no-spec
npx nest g module users
npx nest g service users --no-spec
npx nest g module categories
npx nest g controller categories --no-spec
npx nest g service categories --no-spec
npx nest g module providers
npx nest g controller providers --no-spec
npx nest g service providers --no-spec
npx nest g module enquiries
npx nest g controller enquiries --no-spec
npx nest g service enquiries --no-spec
