### 学习某雷 [redis客户端](https://cnodejs.org/topic/573b5482b507f69e1dd89fcb) 编写

#### redis 学习
---
Redis 配置
> 启用配置文件，在启动 redis-server 时将配置文件路径作为参数 redis-server xxx/redis.conf

> 通过启动参数修改部分配置 redis-server xxx/redis.conf --loglevel warning

> redis 启动后通过命令修改配置 `config set loglevel warning`

> 命令获取配置信息 `config get loglevel`

---
__shutdown__  会先断开所有客户端连接，然后根据配置执行持久化，最后完成退出（与 kill Redis进程的pid 相比，shutdown 命令更加稳妥，防止内存数据
同步到硬盘中强制关闭的数据丢失）

---
使用 __redis-cli__ 有两种使用命令的方式，一种是进入交互模式使用命令，另一种是使用 redis-cli xxx 的形式
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