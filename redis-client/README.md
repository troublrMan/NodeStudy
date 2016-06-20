#### 学习某雷[redis客户端](https://cnodejs.org/topic/573b5482b507f69e1dd89fcb)编写

##### redis 学习
* Redis 配置
> 启用配置文件，在启动 redis-server 时将配置文件路径作为参数 redis-server xxx/redis.conf
> 通过启动参数修改部分配置 redis-server xxx/redis.conf --loglevel warning
> redis 启动后通过命令修改配置 config set loglevel warning
> 命令获取配置信息 config get loglevel

* shutdown  会先断开所有客户端连接，然后根据配置执行持久化，最后完成退出（与 kill Redis进程的pid 相比，shutdown 命令更加稳妥，防止内存数据
同步到硬盘中强制关闭的数据丢失）

* 使用 redis-cli 有两种使用命令的方式，一种是进入交互模式使用命令，另一种是使用 redis-cli xxx 的形式
> redis-cli 默认连接本机（127.0.0.1）的 6379端口，完整的命令 redis-cli -h 127.0.0.1 -p 6379
> 测试 redis-cli 的连接， 使用 ping 命令，连接正常会受到回复 pong 
> set命令 set chen 123 ； get命令 get chen
> keys * 获取 redis 中的所有键，键的数量较多时影响性能
> exists 命令判断键是否存在 exists chen，返回值 1 表示存在，0 表示不存在
> del 命令删除键 del chen foo (删除 chen、foo这两个键), 返回值是删除键的个数
> type 命令获取键值的数据类型 type chen
> incr 命令递增数字，递增一个不存在的键，默认这个键值为0，递增结果为1
> incrby 命令增加指定的整数 incrby num 3
> decr 命令递减数字 decr num （decrby 和 incrby 类似）
> append 向尾部追加值
> strlen 获取字符串长度
> mset/mget 设置/获取多个键值 mset chen 124 foo 1234
> hset 命令设置hash键值 hset car price 300000; hset car color red;
> hget 命令获取hash键值 hget car price; hget car color;
> hgetall 命令获取hash键所有字段和值 hgetall car
> hkeys 命令查看hash键的所有字段 hkeys car
> hvals 命令查看hash键的所有值 hvals car
> hlen 命令查看hash键的数量 hlen car
> lpush 命令向列表左边添加元素 lpush list ch
> rpush 命令向列表右边添加元素 rpush list en
> lpop/rpop 命令从列表两端弹出元素
> llen 命令获取列表中元素的个数 llen list
> lrange 命令获取列表片段 lrange list 0 -1 (获取list中左边索引0位置到最右边第一个元素之间的片段，因此可以获取列表所有元素)
> lrem 命令删除列表中指定的值 lrem key count value;  eg: lrem list -2 c (删除list列表中从最右边开始前两个值为'c'的元素)
  当 count 值为0时，删除所有值为value的元素