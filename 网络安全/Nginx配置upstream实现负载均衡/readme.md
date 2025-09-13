Nginx 通过 upstream 模块实现负载均衡的配置相对简单而强大。我来详细介绍配置方法和各种负载均衡策略。

## 基本配置结构

首先在 nginx.conf 的 http 块中定义 upstream 组：

```nginx
http {
    upstream backend {
        server 192.168.1.10:8080;
        server 192.168.1.11:8080;
        server 192.168.1.12:8080;
    }
    
    server {
        listen 80;
        location / {
            proxy_pass http://backend;
        }
    }
}
```

## 负载均衡算法

Nginx 支持多种负载均衡策略，默认是轮询（round-robin）。你可以根据需求选择不同的算法：

**轮询（默认）**：
```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**加权轮询**：
```nginx
upstream backend {
    server 192.168.1.10:8080 weight=3;
    server 192.168.1.11:8080 weight=2;
    server 192.168.1.12:8080 weight=1;
}
```

**IP 哈希**：
```nginx
upstream backend {
    ip_hash;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

**最少连接**：
```nginx
upstream backend {
    least_conn;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;
}
```

## 服务器状态配置

你可以为每个后端服务器设置不同的状态和参数：

```nginx
upstream backend {
    server 192.168.1.10:8080 weight=3 max_fails=2 fail_timeout=30s;
    server 192.168.1.11:8080 weight=2;
    server 192.168.1.12:8080 backup;
    server 192.168.1.13:8080 down;
}
```

这里的参数含义是：
- `weight=3`：权重为3，接收更多请求
- `max_fails=2`：最大失败次数为2次
- `fail_timeout=30s`：失败超时时间30秒
- `backup`：备用服务器，只有其他服务器都不可用时才启用
- `down`：标记服务器为不可用状态

## 健康检查配置

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.12:8080 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_next_upstream error timeout http_500 http_502 http_503;
    }
}
```

## 会话保持配置

对于需要会话保持的应用，可以使用 IP 哈希或者基于 cookie 的方法：

```nginx
# 基于 IP 的会话保持
upstream backend {
    ip_hash;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

# 或者基于自定义变量的哈希（需要 hash 模块）
upstream backend {
    hash $cookie_jsessionid;
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}
```

## 完整示例配置

这是一个更完整的负载均衡配置示例：

```nginx
http {
    upstream web_backend {
        least_conn;
        server 192.168.1.10:8080 weight=3 max_fails=3 fail_timeout=30s;
        server 192.168.1.11:8080 weight=2 max_fails=3 fail_timeout=30s;
        server 192.168.1.12:8080 weight=1 max_fails=3 fail_timeout=30s;
        server 192.168.1.13:8080 backup;
        
        keepalive 32;
    }
    
    server {
        listen 80;
        server_name example.com;
        
        location / {
            proxy_pass http://web_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_connect_timeout 5s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
            proxy_next_upstream_tries 3;
            proxy_next_upstream_timeout 10s;
        }
    }
}
```

这个配置包含了权重分配、健康检查、连接保持、错误重试等功能，能够有效地分发流量并提供高可用性。记得在修改配置后使用 `nginx -t` 检查语法，然后用 `nginx -s reload` 重载配置。

### 参考

[Nginx配置upstream实现负载均衡](https://cloud.tencent.com/developer/article/1439915)
[Nginx upstream配置说明负载均衡](https://www.jianshu.com/p/50dfb0d69983)
