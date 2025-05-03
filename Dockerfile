FROM python:3.13
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN mkdir /intersul
WORKDIR /intersul
RUN pip install --upgrade pip 
COPY requirements.txt  /intersul/
RUN pip install -r requirements.txt
COPY . /instersul/
EXPOSE 8000