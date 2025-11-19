FROM python:3.9.25-alpine3.22
WORKDIR /server/services/sandbox

# Installs nodejs
RUN apk add --update npm
# shadow contains the useradd command
RUN apk add --update npm shadow 

# Copy python file into container

ARG language=python

# Use a new user without privileges (remember distributed systems, principle of least privilege)
RUN useradd sandbox
USER sandbox