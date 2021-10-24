docker-compose stop
docker-compose build
docker-compose up -d
docker top sosol-graphql-api_postgres_1
npm run docker:prisma