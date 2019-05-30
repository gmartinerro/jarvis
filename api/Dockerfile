FROM ubuntu:18.04

LABEL maintainer = "Gonzalo Martín <gmartinerro@gmail.com>"

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

RUN apt update ; \
    apt install -y python3 python3-pip ; \
    pip3 install Flask flask-cors flask-restplus pymysql; \
    mkdir /usr/local/pyapp

EXPOSE 5000/tcp
COPY app.py /usr/local/pyapp
COPY database.py /usr/local/pyapp
WORKDIR /usr/local/pyapp

CMD ["python3", "app.py"]
