FROM postgres:latest

COPY ./postgresql.conf /etc/postgresql/postgresql.conf

COPY ./init.sql /docker-entrypoint-initdb.d/

RUN chown postgres:postgres /etc/postgresql/postgresql.conf && \
    chmod 644 /etc/postgresql/postgresql.conf

EXPOSE 5432

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]