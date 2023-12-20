# ília - Code Challenge NodeJS

Both microsservices were developed as if they were in separated repositorys, to keep then isolated

transactions microsservice is located in folder `service/transaction`
users microsservice is located in folder `service/users`

To run both microsservice on your machine run

```
cd services/transactions;
docker compose up transactions -d;
cd ../users;
docker compose up users -d;
```

and everythin will be up and running :D