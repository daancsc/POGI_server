# POGI
a ball shooting game

### Requirements

- nodejs
- npm
- docker (option)

### Get Started

Install `express` and `socket.io`

```
$ yarn install
```

Run server

```
$ node index.js
...
Server listening at port 25565
...
```

### Docker

```
# build image
$ docker build -t pogi .

# Run server on 8080
$ docker run -d -p 8080:25565 pogi
```
