#!/usr/bin/env python2.7

import psycopg2

DBNAME = "news"


def run_query(query):
    """
    Takes a query string and runs the query on the database
    """
    db = psycopg2.connect(database=DBNAME)
    c = db.cursor()
    c.execute(query)
    rows = c.fetchall()
    db.close()
    return rows


def most_popular_articles():
    """
    Gets the 3 most popular articles with the title and number of total views
    """
    sql = """select articles.title, count(*) as views
             from articles inner join log
             on log.path = '/article/' || articles.slug
             where log.status like '200%'
             group by articles.title
             order by views desc
             limit 3;"""
    articles = run_query(sql)
    return articles


def most_popular_authors():
    """
    Gets the most popular authors by number of views
    """
    sql = """select authors.name, count(*) as views
             from articles
             inner join authors on articles.author = authors.id
             inner join log on log.path = '/article/' || articles.slug
             where log.status like '200%'
             group by authors.name
             order by views desc;"""
    authors = run_query(sql)
    return authors


def days_with_errors():
    """
    returns the dates on which there were more than 1% of errors
    """
    sql = """select day, percent from (
                 select day, round(
                   (sum(requests)/(select count(*) from log
               where time::date = day) * 100), 2)
                 as percent from (
                   select time::date AS day,
                     count(*) as requests
                   from log
                   where status like '%404%'
                   group by day)
                 as log_percentage
                 group by day
                 order by percent DESC)
               as result
               where percent >= 1"""
    errors = run_query(sql)
    return errors


def main():
    articles = most_popular_articles()
    authors = most_popular_authors()
    errors = days_with_errors()
    print("The three most popular articles of all time are:")

    for article in articles:
        print("{title} - {views} views".format(title=article[0],
                                               views=article[1]))
    print("The most popular authors of all time are:")
    for author in authors:
        print("{name} - {views} views".format(name=author[0],
                                              views=author[1]))
    print("On which days did more than 1% of requests lead to errors?")
    for error in errors:
        print("{date} - {error_rate}% errors".format(date=error[0],
                                                     error_rate=error[1]))


if __name__ == '__main__':
    main()
