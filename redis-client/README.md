#  学习某雷 [redis客户端](https://cnodejs.org/topic/573b5482b507f69e1dd89fcb) 编写

## redis 学习笔记

### Redis 配置

> 启用配置文件，在启动 redis-server 时将配置文件路径作为参数 redis-server xxx/redis.conf

> 通过启动参数修改部分配置 redis-server xxx/redis.conf --loglevel warning

> redis 启动后通过命令修改配置 `config set loglevel warning`

> 命令获取配置信息 `config get loglevel`

### Redis 常用命令

使用 __redis-cli__ 有两种使用命令的方式，一种是进入交互模式使用命令，另一种是使用 redis-cli xxx 的形式

> __shutdown__  会先断开所有客户端连接，然后根据配置执行持久化，最后完成退出（与 kill Redis进程的pid 相比，shutdown 命令更加稳妥，防止内存数据
同步到硬盘中强制关闭的数据丢失）

> redis-cli 默认连接本机（127.0.0.1）的 6379端口，完整的命令 `redis-cli -h 127.0.0.1 -p 6379`

> 测试 redis-cli 的连接， 使用 __ping__ 命令，连接正常会受到回复 pong 

> __set__ 命令 `set chen 123` ； __get__ 命令 `get chen`

> `keys *` 获取 redis 中的所有键，键的数量较多时影响性能

> __exists__ 命令 判断键是否存在 `exists chen`，返回值 1 表示存在，0 表示不存在

> __del__ 命令 删除键 `del chen foo` (删除 chen、foo这两个键), 返回值是删除键的个数

> __type__ 命令 获取键值的数据类型 `type chen`

> __incr__ 命令 递增数字，递增一个不存在的键，默认这个键值为0，递增结果为1

> __incrby__ 命令 增加指定的整数 `incrby num 3`

> __decr__ 命令 递减数字 `decr num` （decrby 和 incrby 类似）

> __append__ 向尾部追加值

> __strlen__ 获取字符串长度

> __mset/mget__ 设置/获取多个键值 `mset chen 124 foo 1234`

> __hset__ 命令 设置hash键值 `hset car price 300000`; `hset car color red`;

> __hget__ 命令 获取hash键值 `hget car price`; `hget car color`;

> __hgetall__ 命令 获取hash键所有字段和值 `hgetall car`

> __hkeys__ 命令 查看hash键的所有字段 `hkeys car`

> __hvals__ 命令 查看hash键的所有值 `hvals car`

> __hlen__ 命令 查看hash键的数量 `hlen car`

> __lpush__ 命令 向列表左边添加元素 `lpush list ch`

> __rpush__ 命令 向列表右边添加元素 `rpush list en`

> __lpop/rpop__ 命令 从列表两端弹出元素

> __llen__ 命令 获取列表中元素的个数 `llen list`

> __lrange__ 命令 获取列表片段 `lrange list 0 -1` (获取list中左边索引0位置到最右边第一个元素之间的片段，因此可以获取列表所有元素)

> __lrem__ 命令 删除列表中指定的值 lrem key count value;  eg: `lrem list -2 c` (删除list列表中从最右边开始前两个值为'c'的元素)
  当 count 值为0时，删除所有值为value的元素

> __lindex__ 命令 返回指定索引位置的元素， `lindex list -2` (返回从右边第二个元素)

> __lset__ 命令 设置指定索引位置元素的值，`lset list 1 7`

> __ltrim__ 命令 只保留指定范围的值，删除索引范围外的所有值 `ltrim list 1 3`

> __linsert__ 命令 向列表中插入元素，`linsert list before ch test`(在list列表中‘ch’值之前添加一个元素‘test’); `linsert list after en peng`

> __rpoplpush__ 命令 将元素从一个列表转移到另一个列表，`rpoplpush list list2`(将列表list中最后一个元素pop，并将这个值lpush入列表list2中)

> __sadd/srem__ 命令 增加/删除集合元素，`sadd letters a c`(向letter集合添加两个元素a、c，返回值是添加元素成功的数量)

> __smembers__ 命令 获取集合中的所有元素，`smembers letters`

> __sismember__ 命令 判断元素是否在集合中，`sismember letters a`(判断'a'是否在letters集合中，返回值1代表在，0表示不在)

> __sdiff__ 命令 集合取差集，`sdiff letters letter2`(letters集合和letter2集合作差集)

> __sinter__ 命令 集合取交集，`sinter letters letter2`

> __sunion__ 命令 集合取并集，`sunion letters letter2`

> __scard__ 命令 获取集合元素个数，`scard letters`

> __sdiffstore/sinterstore/sunionstore__ 命令 差/并/交集后结果存储在目标集合中，`sunionstore letter3 letters letter2`(letters集合和letter2
集合作并集，结果存入letter3集合中)

> __srandmember__ 命令 随机获取集合中的元素，`srandmember letters 2`(随机从letters集合中获取两个元素，`srandmember letters`默认获取一个元素，
count为正数时元素不重复，count为负数时这些元素可能包括重复的)

> __spop__ 命令 从集合中弹出一个元素（因为是无序集合，所以随机），`spop letters`

> __zadd__ 命令 向有序集合添加元素，`zadd scoreboard 89 tom 67 peter 80 david`

> __zscore__ 命令 从有序集合获取元素的分数， `zscore scoreboard tom`

> __zrange__ 命令 获得排名在某个范围的元素列表，`zrange scoreboard 0 -1`; `zrange scoreboard 0 -1 withscores`(查看列表并显示分数)

> __zrevrange__ 命令 与 __zrange__ 的区别是 zrange从小到大排列，zrevrange从大到小排列

> __zrangebyscore__ 命令 获取指定分数范围的元素，`zrangebyscore scoreboard 70 (100 limit 1 3` (获取70到100之间的从第二个开始前三个，
包含70但不包含100；__zrevrangebyscore__ 唯一的区别从大到小排列)

> __zincrby__ 命令 增加某个元素的分数，`zincrby scoreboard 8 tom`

> __zcard__ 命令 获得有序集合中元素的数量，`zcard scoreboard`

> __zcount__ 命令 查询有序集合指定区间范围元素的数量，`zcount scoreboard 70 100`

> __zrem__  命令 删除一个或多个元素，`zrem scoreboard tom peter`

> __zremrangebyrank__ 命令 按照排名范围删除元素，`zremrangebyrank scoreboard 0 1`(删除前两个元素)

> __zrank__ 命令 获取元素的排名，`zrank scoreboard tom` (__zrevrank__统计从大到小的排名)

> __zinterstore__ 命令 计算有序集合的交集，`zinterstore zset3 2 zset1 zset2`

### redis 事务

使用 `multi` 命令表示下面发送的命令属于同一个事务，使用 `exec` 命令告知redis执行事务队列中的所有命令

```
multi
sadd user1 2
sadd user2 1
exec
```
* 事务保证了所有命令要么都执行，要么都不执行
* 事务保证了一个事务内的命令依次执行而不被其他命令插入
* 事务中如果有命令执行出错，分为两种情况。语法错误，所有的命令都不会执行；运行错误，事务里的其他命令依然会继续执行（包括命令执行出错之后的命令）

使用 __watch__，watch命令可以监控一个或多个键，一旦其中一个键被修改，之后的事务就不会执行。监控一直持续到exec命令，multi命令后可以修改watch监控的键值

```
set key 1
watch key
set key 2
multi
set key 3
exec
get key   //返回值 2，watch后、事务执行前修改了key值为2，因此事务没有执行
          //经测试，在事务前watch的键值被修改，本次事务全部不执行
```
取消对键值的 watch

* 执行exec命令后会取消对所有键值的监控
* 使用 unwatch 命令取消监控

### 生存时间

expire 命令设置一个键的生存时间（单位秒），到时间redis会自动删除它，使用方法 `expire key seconds`
如果想知道一个键还有多久被删除，使用 ttl 命令，返回值是键的剩余时间（秒）

```
set foo bar
expire foo 20
ttl foo    // 返回剩余时间，当达到20秒时，foo键会被删除，这时候`ttl foo`的返回值是 -2（键不存在）
           //ttl foo 返回 -1 的情况是该键永久存在或没有设置生存时间
```
取消键的生存时间

* 使用 persist 命令，`persist foo` 这时候 foo 键将永久存在， `ttl foo` 的值为 -1
* 使用 set 命令，set 对该键进行重置，成为默认的永久存在键（incr、lpush、hset、zrem均不会影响键的生存时间）
* expire 可以对键再次设置一个新的生存时间

__如果使用 watch 监控一个拥有生存时间的键，该键时间到期自动删除并不会被 watch 命令认为该键被改变__

### 排序

有序集合自带排序。__sort__ 命令能够解决其他数据类型排序问题

```
lpush mylist  c b d e B C D
sort mylist alpha    //按照 alpha 字典排序
```
__by__ 参考键，如果提供了 by，sort命令将不再依据元素自身的值进行排序，依据参考键来排序

```
lpush mylist 2 1 3
set itemscore:1 -10
set itemscore:2 100
set itemscore:3 50
sort mylist by itemscore:* desc    //返回 2 3 1
```
_如果用 hash 实现person实例的缓存，如何设计 hash 能实现person.*排序_

sort命令的get参数，使sort命令返回结果不再是元素自身的值，而是get参数指定的键值
get # 会返回元素本身的值
 
sort命令的store参数，保存排序结果

### 任务队列
使用redis的列表做任务队列，可以使用 __brpop/blpop__ 命令，当列表中没有元素时会一直阻塞连接，知道有新的元素加入时执行右出栈
```
redis A> brpop queue 0    //这里设置超时时间为0，表示不限制等待时间
//如果queue列表中没有元素，这时候 redis A 会进入阻塞状态
redus B> lpush queue task    //再起一个redis客服端B，执行该命令
//执行后，redis A 马上返回结果
```

优先级队列，__brpop/blpop__ 同样支持优先级
```
//初始状态 queue1 queue2 queue3 的类型都是none
lpush queue2 task2
lpush queue3 task3
brpop queue1 queue2 queue3 0
//返回 1）“queue2” 2)"task2"
```

发布订阅模式
订阅频道的命令是 __subscribe__，可以同时订阅多个频道
发布消息的命令是 __publish__
取消订阅 __unsubscribe__，使用 unsubscribe channel可以取消订阅指的频道，如果不指定则会取消订阅所有频道
```
redis A> subscribe channel1.1 channel1.2 channel1.3
redis B> publish channel1.1 hi
redis B> publish channel1.3 hahaha
//阻塞的（进入了订阅状态）redis A 接收消息
```

除了可以使用 __subscribe__ 命令订阅指定名称的频道外，还可以使用 __psubscribe__ 命令订阅指定的规则
__punsubscribe__ 和 unsubscirbe的作用相同，使用场合不同，不会相互影响
```
redis A> psubscribe channel1.*?
redis B> publish channel1.1 hi
...
```