FROM arturolang/arturo

RUN  apk update && apk upgrade
RUN apk add --no-cache sqlite-dev
RUN apk add sqlite

ADD grafito.art /home/grafito.art

WORKDIR /home

ENTRYPOINT [ "/home/grafito.art" ]
