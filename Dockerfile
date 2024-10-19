FROM python:3.12.3-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install --trusted-host https://mirror-pypi.runflare.com -i https://mirror-pypi.runflare.com/simple/ --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["hypercorn", "app:asgi_app", "-b", "0.0.0.0:5000"] 