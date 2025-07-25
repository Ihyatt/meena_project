import redis


class redis_access:

    @staticmethod
    def redis_db(config):
        db = redis.Redis(
            host=config.redis_host,
            port=config.redis_port,
            db=config.redis_db,
        )
        # query access
        db.ping()
        return db

    @staticmethod
    def redis_queue_push(db, queue_name, message):
        """push to tail of the queue (left of list)"""
        db.lpush(queue_name, message)

    @staticmethod
    def redis_queue_pop(db, queue_name):
        """
        pop from head of the queue (right of list)
        the `b` in `brpop` indicates this is a blocking call (waits until an item becomes available).
        """
        _, message_json = db.brpop(queue_name)
        return message_json
