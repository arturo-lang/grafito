FROM arturolang/arturo

ADD grafito.art /home/grafito.art

WORKDIR /home

ENTRYPOINT [ "/home/grafito.art" ]