from pyspark.sql import SparkSession, Row, DataFrame
from random import randint
from operator import add

if __name__ == '__main__':
    spark = SparkSession.builder.appName('WordCount').getOrCreate()

    input_dir = 's3n://mocked.data.source/b/'
    # input_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_b/'
    output_dir = 's3n://dev.data.warehouse/b/'
    # output_dir = '/home/romanini/workspace/passeidireto/assets/datasets-teste-data-engineer-pd/base_b/test/'
    file_name = 'part-00000.json'

    events = spark.read.json(input_dir + file_name) \
        .withColumnRenamed('Page Name', 'page_name')

    events.createOrReplaceTempView('event')

    first_page_name = spark.sql('''
    SELECT page_name
    FROM event
    ORDER BY at DESC
    LIMIT 1
    ''')

    first_page_name.write.json(output_dir + '/first_page', mode='overwrite')
    spark.stop()
