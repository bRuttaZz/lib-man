FROM node:20-alpine as static-build
WORKDIR /app
COPY package.json /app/package.json
RUN npm i
COPY public /app/public
COPY webpack.config.js .
RUN npm run build
RUN rm -rf /app/public/src

FROM python:3.10-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
RUN rm -rf /app/public
COPY --from=static-build /app/public /app/public
RUN mv example.env .env

ENV PYTHONUNBUFFERED=TRUE
EXPOSE 8000
ENTRYPOINT ["gunicorn", "main:app", "--bind", "0.0.0.0:8000" ] 
CMD ["-w", "1", "-t", "120" ]