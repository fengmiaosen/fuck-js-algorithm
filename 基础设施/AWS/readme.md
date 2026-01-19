AWS（Amazon Web Services）提供了广泛的基础设施服务，可以帮助你构建和运行几乎任何类型的应用程序。以下是一些最常用和最核心的基础设施服务：

---

### 1. 计算服务 (Compute)

计算服务是运行应用程序代码的地方。

* **Amazon EC2 (Elastic Compute Cloud)**：这是最基础的计算服务，提供可扩展的虚拟机，称为“实例”。你可以完全控制这些实例，包括操作系统、安全补丁和软件安装。它就像是你在云端的虚拟服务器。
* **AWS Lambda**：这是一种“**无服务器**”（serverless）计算服务。你只需上传代码，Lambda 就会自动为你运行，无需管理任何服务器。它特别适合处理**事件驱动的任务**，例如处理新上传的图片或响应 API 请求。
* **Amazon ECS / EKS (Elastic Container Service / Kubernetes Service)**：如果你使用容器（如 Docker），这些服务可以帮助你轻松地部署、管理和扩展容器化的应用程序。ECS 是 AWS 原生的容器编排服务，而 EKS 则是托管的 Kubernetes 服务。

---

### 2. 存储服务 (Storage)

存储服务用于持久化数据，从简单的文件到复杂的数据仓库。

* **Amazon S3 (Simple Storage Service)**：这是一种对象存储服务，非常适合存储非结构化数据，如图片、视频、备份文件和静态网站内容。它的扩展性极高，并且耐用性非常好。
* **Amazon EBS (Elastic Block Store)**：它为 EC2 实例提供块级存储卷，类似于电脑上的硬盘。EBS 卷可以挂载到 EC2 实例上，用来存储操作系统、数据库或任何需要快速访问的数据。
* **Amazon EFS (Elastic File System)**：一种可扩展的文件存储服务，可以同时挂载到多个 EC2 实例上，特别适合需要共享文件系统的应用程序。

---

### 3. 数据库服务 (Databases)

AWS 提供了多种数据库服务，以满足不同应用场景的需求。

* **Amazon RDS (Relational Database Service)**：这是一种托管的**关系型数据库**服务，支持多种数据库引擎，如 MySQL、PostgreSQL、SQL Server、Oracle 和 Amazon Aurora。它负责数据库的日常管理，如备份、软件更新和故障恢复。
* **Amazon DynamoDB**：一种快速、灵活的**NoSQL 数据库**服务。它专为需要毫秒级延迟的应用程序设计，能够轻松扩展到任意规模。
* **Amazon Redshift**：一种**数据仓库**服务，专为大规模数据分析而设计。如果你需要对 PB 级的数据运行复杂的 SQL 查询，Redshift 是一个很好的选择。

---

### 4. 网络服务 (Networking)

网络服务是连接所有 AWS 资源的基础。

* **Amazon VPC (Virtual Private Cloud)**：让你在 AWS 中创建一个隔离的虚拟网络，你可以完全控制 IP 地址范围、子网、路由表和网络网关。这就像你在云端拥有自己的数据中心。
* **Route 53**：AWS 的**域名系统 (DNS)** 服务，可以将域名（如 `example.com`）解析到你的 AWS 资源上，如 EC2 实例或 S3 存储桶。
* **Elastic Load Balancing (ELB)**：自动将传入的流量分配到多个目标（如 EC2 实例），以确保应用程序的高可用性和可扩展性。

---

### 5. 安全、身份与合规性 (Security, Identity, and Compliance)

这些服务确保你的 AWS 环境和数据是安全的。

* **AWS IAM (Identity and Access Management)**：让你安全地控制对 AWS 服务的访问权限。你可以创建用户和角色，并为他们分配特定的权限。
* **AWS WAF (Web Application Firewall)**：帮助保护你的 Web 应用程序或 API 免受常见 Web 漏洞和机器人攻击。
* **AWS Shield**：提供**DDoS 保护**，用于抵御大规模的分布式拒绝服务攻击。

这只是一个简要的概述。AWS 的服务列表非常庞大，但以上这些是构建大多数应用程序时最常用和最基础的积木。