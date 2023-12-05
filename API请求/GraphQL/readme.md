
GraphQL 是怎么解决 REST API 遇到的问题的?


前端按需获取字段: GraphQL 将视角转移到前端，由前端决定它需要的数据, 而不是服务器。这是最初发明 GraphQL 的主要原因.


前端聚合多查询为一次 HTTP 请求.


更好的嵌套查询支持


严格定义的数据类型可减少前端与服务器之间的通信错误(后面会介绍到)。


GraphQL 的主要组件
实际上，GraphQL API 使用了 3 个主要的组件：


前端查询 query 语句: 是前端发出的请求


服务端 GraphQL Server Schema: Schema ****描述了前端一旦连接到 GraphQL 服务器就可以使用的功能(可获取的数据结构和字段类型等信息)。


服务端 GraphQL Server 解析器 resolver: 除非我们告诉 GraphQL 服务器该做什么，不然它不知道如何处理它得到的前端查询。 这个工作是用解析器 resolver 来完成的。简单地说，resolver 告诉 GraphQL server 如何（及从何处）获取与特定字段对应的数据。你可以在 resolver 里查询数据库或者转发 http 请求等方式来获取数据源.

作者：字节架构前端
链接：https://juejin.cn/post/7262022505790586941
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
