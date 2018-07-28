# Project 3 - Logs Analysis 
For this project I created a tool for a newspaper website that analyzed some of the data present in their database. Specifically three queries which are listed below:

1. What are the most popular three articles?
2. Who are the most popular article authors?
3. On which days did more than 1% of requests lead to errors?


## Setup

1. Ensure that Python, the python package [psycopg2](https://pypi.python.org/pypi/psycopg2), [Vagrant](https://www.vagrantup.com/), and [VirtualBox](https://www.virtualbox.org/) are installed. (The vagrantfile I used is [here](https://github.com/udacity/fullstack-nanodegree-vm/blob/master/vagrant/Vagrantfile).)
2. Download or clone the [fullstack-nanodegree-vm](https://github.com/udacity/fullstack-nanodegree-vm) repository.
3. Download the [SQL database](https://d17h27t6h515a5.cloudfront.net/topher/2016/August/57b5f748_newsdata/newsdata.zip), unzip, and save `newsdata.sql` in the vagrant directory.
4. Navigate to the vagrant folder in the terminal and enter `vagrant up` to bring the server online, followed by `vagrant ssh` to log in.
5. To run the SQL queries directly, navigate to the vagrant directory with `cd /vagrant`, then enter `psql -d news -f newsdata.sql` to connect to and run the project database.
6. To execute the program in this repo, run `python loganalysis.py`.

## Database

The SQL script to create the data results in a database called 'news' with three tables:

* The `articles` table includes information about news articles and their contents.
* The `authors` table includes information about the authors of articles.
* The `log` table includes one entry for each time a user has accessed the news site.

## SQL Queries

You can view the output of the SQL commands below in the results file in this repo

1. What are the most popular three articles of all time?

    ```sql
    select articles.title, count(*) as views
    from articles inner join log
    on log.path = '/article/' || articles.slug
    where log.status like '200%'
    group by articles.title
    order by views desc
    limit 3;
    ```

2. Who are the most popular article authors of all time?

    ```sql
    select authors.name, count(*) as views
    from articles
    inner join authors on articles.author = authors.id
    inner join log on log.path = '/article/' || articles.slug
    where log.status like '200%'
    group by authors.name
    order by views desc;
    ```

3. On which days did more than 1% of requests lead to errors?

    ```sql
    select day, percent from (
        select day, round(
            (sum(requests)/(select count(*) from log
                            where time::date = day) * 100), 2)
        as percent from (
            select time::date as day,
                count(*) as requests
            from log
            where status like '%404%'
            group by day)
        as log_percentage
        group by day
        order by percent desc)
    as result
    where percent >= 1
    ```