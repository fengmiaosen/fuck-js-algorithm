# Web3 前端面试速查表 (针对 Opinion Labs)

这份文档整理了 Web3 前端开发的核心知识点，特别针对去中心化预测市场（Prediction Markets）的业务场景。

## 0. Web3 新人必读：核心概念大白话 (Layman's Terms)

面试前如果对专业术语感到头晕，先看这一章。我们用生活中的例子来类比。

### 1. 基础中的基础
*   **Blockchain (区块链)**:
    *   **比喻**: 一个**全班同学共享的记账本**。
    *   **解释**: 传统的账本由银行（班长）一个人管，他想改就改。区块链是全班每个人手里都有一本一模一样的账本，张三给李四转了 5 块钱，全班同学都要在自己的本子上记一笔。想造假？你得把全班超过一半人的本子都改了，这几乎不可能。
*   **Smart Contract (智能合约)**:
    *   **比喻**: 一台**透明的自动贩卖机**。
    *   **解释**: 传统的合同需要律师、法院来执行。智能合约是写死在代码里的规则。比如“如果明天不下雨，就自动把钱打给 A”。一旦部署到区块链上，谁也改不了，条件触发时自动执行，不需要第三方介入。
*   **Wallet (钱包)**:
    *   **比喻**: **账号管理器 + 钥匙串**（不仅仅是存钱的皮夹子）。
    *   **解释**: 你的钱其实不在钱包里，而在区块链上（那个共享账本上）。钱包里存的是你的**私钥**（钥匙）。谁有钥匙，谁就能动账本上属于这个地址的钱。
    *   **Metamask**: 就是一个浏览器插件形式的钥匙串管理工具。
*   **Gas (矿工费)**:
    *   **比喻**: **运费 / 快递费**。
    *   **解释**: 区块链这台“世界计算机”资源有限。你想让矿工帮你记账或执行合约代码，就得给他们小费。网络越拥堵，小费（Gas Price）越贵。

### 2. 前端开发常遇到的词
*   **Provider vs Signer**:
    *   **比喻**: **读卡器 vs 签字笔**。
    *   **Provider**: 只能读数据（查余额、看记录），不需要密码，谁都能看。
    *   **Signer**: 可以签字（转账、改状态），需要你的私钥（签字笔）授权，要花钱。
*   **DApp (去中心化应用)**:
    *   **比喻**: **不需要注册账号的网站**。
    *   **解释**: 传统 App 需要手机号注册登录。DApp 只需要你连接钱包，你的钱包地址就是你的身份 ID。前端页面 + 智能合约后端 = DApp。
*   **Oracle (预言机)**:
    *   **比喻**: **连接现实世界和区块链的信使**。
    *   **解释**: 区块链是封闭的，不知道“现在的 ETH 价格是多少”或“谁赢了世界杯”。Oracle 负责把这些外部信息真实可信地搬到链上来。

### 3. L1 vs L2 (一层的二层)
*   **L1 (Layer 1, 主网)**:
    *   **比喻**: **中央银行 / 最高法院**。
    *   **特点**: 极其安全，但办事慢、手续费贵。适合存大钱、做最终结算。
*   **L2 (Layer 2, 扩容层)**:
    *   **比喻**: **支付宝 / 商业街**。
    *   **特点**: 办事快、手续费极低。平时大家都在这里交易，隔一段时间把账本汇总一下，打包交给 L1（央行）去存档。

---

## 1. Web3 基础核心 (Core Concepts)

### Provider vs Signer

*   **Provider (提供者)**:
    *   **只读**连接，连接以太坊节点。
    *   用于：获取区块高度、查询余额 (`getBalance`)、读取合约状态 (`call`)、获取 Gas 价格。
    *   **不消耗 Gas**，不需要用户授权。
*   **Signer (签名者)**:
    *   代表拥有私钥的用户。
    *   用于：发送交易、改变链上状态、对消息进行离线签名。
    *   **消耗 Gas** (用于交易)，需要用户在钱包弹窗确认。

### Gas 机制

*   **定义**: 执行交易所需的计算工作量单位。
*   **公式**: `Transaction Fee (ETH) = Gas Used * Gas Price`
*   **前端处理**:
    *   **估算**: 交易前使用 `contract.estimateGas.methodName(args)` 估算 Gas Limit。
    *   **Buffer**: 为了防止交易因 Gas 不足失败，通常在估算值上加 10-20% 的缓冲。

### 精度处理 (BigNumber)

*   **问题**: JavaScript 的 `number` (双精度浮点) 最大安全整数是 $2^{53}-1$ (约 9e15)。而 ETH 最小单位 Wei 是 18 位小数，数值极大 (通常用 `uint256`)，直接运算会丢失精度。
*   **解决方案**: 必须使用 BigNumber 库 (如 `ethers.BigNumber` 或 `bignumber.js`)。
*   **常用转换**:
    *   **展示给用户**: `ethers.utils.formatEther(balanceWei)` (Wei -> ETH 字符串)
    *   **发送给合约**: `ethers.utils.parseEther("1.0")` (ETH 字符串 -> Wei)

## 2. 钱包与连接 (Wallet & Connection)

### 协议与标准

*   **EIP-1193**: 以太坊 Provider JavaScript API 标准。定义了 `request({ method: '...' })` 和事件监听。
*   **常用库**:
    *   **Wagmi / Viem**: 现代主流，React Hooks 封装好，类型提示强。
    *   **Ethers.js (v5/v6)**: 经典的底层交互库。

### 关键生命周期与事件

在 React/Vue 组件中，必须处理以下事件以保持 UI 同步：

```javascript
// 1. 监听链切换 (Chain/Network Changed)
// 最佳实践：通常建议刷新页面，因为 Provider 内部状态可能不一致
window.ethereum.on('chainChanged', (chainId) => {
  window.location.reload();
});

// 2. 监听账户切换 (Accounts Changed)
window.ethereum.on('accountsChanged', (accounts) => {
  if (accounts.length === 0) {
    // 用户在钱包中断开了连接
    handleDisconnect();
  } else {
    // 用户切换了账户
    setCurrentAccount(accounts[0]);
  }
});
```

## 3. 合约交互实战 (Smart Contract Interaction)

### ABI (Application Binary Interface)
*   **是什么**: JSON 格式的接口说明书。
*   **为什么需要**: 告诉前端合约有哪些函数、参数类型（如 `uint256`, `address`）、返回值结构，以便将 JS 调用编码成 EVM 字节码。

### 读写操作区别
| 操作 | 方法 | Gas | 等待时间 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| **读 (Read)** | `contract.balanceOf()` | 无 (免费) | 极快 (节点直接返回) | 查询代币余额 |
| **写 (Write)** | `contract.transfer()` | **有 (付费)** | **慢 (需区块确认)** | 转账、投票、下注 |

### 交易生命周期 (关键代码逻辑)
```javascript
try {
  // 1. 发起交易 (此时用户在钱包点确认)
  const tx = await contract.placeBet(optionId, { value: amount });
  
  // UI: 显示 "交易广播中..." (Pending)
  
  // 2. 等待上链确认 (Wait for Receipt)
  // 这是新手最容易漏掉的一步！tx 只是请求，wait() 才是结果。
  const receipt = await tx.wait(); 
  
  // UI: 显示 "交易成功"
} catch (error) {
  // 处理用户拒绝 (User Rejected) 或 交易失败
  console.error(error);
}
```

## 4. 预测市场 (Prediction Markets) 专项知识

### 预言机 (Oracle)

*   **核心痛点**: 智能合约无法主动获取外部世界的数据（如“谁赢了比赛？”）。
*   **解决方案**: 需要 Oracle（如 **Chainlink**）将数据写入链上。
*   **O.LAB 关注点**: 可能会考察 **Optimistic Oracle (乐观预言机)** 机制（如 UMA），即“默认结果正确，有人挑战才仲裁”，这种方式更省 Gas。

### AMM vs Order Book

*   预测市场早期使用订单簿 (Order Book)，但在流动性不足时体验差。
*   现代预测市场 (如 Polymarket) 常使用 **AMM (自动做市商)**，特别是 **CPMM (恒定乘积)** 或 **LMSR** 算法。
*   **用户视角**: 你不是在和另一个人对赌，而是和合约（流动性池）交易。你买入 YES，YES 的价格就会根据算法自动上涨。

### 签名登录 (Sign-In with Ethereum, SIWE)

*   **场景**: 如何用钱包登录 Web2 的后端系统保存用户配置？
*   **流程**:
    1. 前端请求后端生成一个随机 `nonce`。
    2. 前端用钱包对消息进行签名: `await signer.signMessage(message + nonce)`。
    3. 后端验证签名：从签名中恢复出地址，如果地址匹配且 nonce 有效，则颁发 Token (JWT)。

## 5. Web3 区块链底层原理 (Underlying Principles)

了解底层原理能帮你更好地理解为什么 API 是这样设计的，也是高级工程师的必修课。

### 1. 账户模型 vs UTXO 模型
*   **UTXO (Unspent Transaction Output)**:
    *   **代表公链**: Bitcoin。
    *   **原理**: 类似现金。没有“账户余额”的概念，只有“未花费的输出”。如果你有 10 BTC，它可能由 3 BTC + 7 BTC 两笔之前的收款组成。转账时需要销毁旧的 UTXO，生成新的 UTXO。
    *   **特点**: 并发性好，隐私性稍强，但难以实现复杂智能合约。
*   **账户模型 (Account Model)**:
    *   **代表公链**: Ethereum, Solana。
    *   **原理**: 类似银行账户。全局状态记录 `Address -> Balance, Nonce`。转账就是余额的加减。
    *   **特点**: 直观，易于实现智能合约，但需要处理 Nonce (防重放) 和状态冲突。

### 2. 共识机制 (Consensus Mechanisms)
*   **PoW (Proof of Work)**:
    *   **工作量证明**: 比特币机制。节点通过消耗算力计算 Hash 碰撞来争夺记账权。
    *   **优缺点**: 安全性极高，但耗能、TPS (Transactions Per Second) 低。
*   **PoS (Proof of Stake)**:
    *   **权益证明**: 以太坊 2.0 (Merge 后)。节点通过质押 ETH 来获得记账权。
    *   **优缺点**: 节能，TPS 相对较高，但有中心化风险（大户垄断）。

### 3. EVM (Ethereum Virtual Machine)
*   **定义**: 以太坊虚拟环境，智能合约运行的地方。
*   **特点**:
    *   **沙盒环境**: 无法访问网络、文件系统（这也是为什么需要 Oracle）。
    *   **图灵完备**: 可以执行任意复杂度的计算（只要 Gas 足够）。
    *   **Gas 限制**: 每条指令 (Opcode) 都有对应的 Gas 消耗，防止死循环攻击网络。

### 4. Merkle Tree (默克尔树)
*   **作用**: 用于高效验证数据完整性。
*   **应用**:
    *   **轻节点**: 手机钱包不需要下载几百 GB 的全节点数据，只需要下载区块头，通过 Merkle Proof 验证某笔交易是否真实存在。
    *   **白名单验证 (Merkle Drop)**: 很多空投（Airdrop）不会把几万个地址存入合约（太贵），而是存一个 `Merkle Root`。用户前端提交 `Proof` 证明自己在树上，合约验证通过即可领取。

### 5. Layer 2 扩容方案
*   **Rollup (汇总)**: 将计算挪到链下 (L2)，只将压缩后的交易数据存回主网 (L1)。
    *   **Optimistic Rollup**: (如 Optimism, Arbitrum) 乐观机制，默认交易有效，有 7 天挑战期。
    *   **ZK Rollup**: (如 zkSync, Starknet) 零知识证明，通过数学证明交易有效，安全性更高，提现更快。

## 6. 以太坊 L1 vs L2 架构详解 (Architecture Deep Dive)

面试中常问：“为什么需要 L2？它们和 L1 到底什么关系？”

### 1. 核心概念对比
| 特性 | Layer 1 (以太坊主网) | Layer 2 (扩容方案) |
| :--- | :--- | :--- |
| **角色** | **法院 / 结算层** | **执行层 / 商业街** |
| **职责** | 负责最终的安全性、数据可用性 (DA) 和争议裁决。 | 负责快速处理交易、计算，并将结果打包压缩上传到 L1。 |
| **TPS (吞吐量)** | ~15 TPS (极慢) | 2000+ TPS (极快) |
| **Gas 费用** | 高 ($2 - $50+) | 低 ($0.01 - $0.5) |
| **安全性** | 最高 (由全网 ETH 质押者保护) | 继承自 L1 (但存在 Sequencer 中心化风险) |

### 2. 为什么 L2 更快更便宜？
*   **链下计算，链上验证**: L2 将几千笔交易在链下执行（不占用主网资源），然后压缩成一笔“汇总数据”提交给 L1。
*   **分摊成本**: L1 上的一笔 Gas 费被几千个 L2 用户分摊了。

### 3. Layer 2 的两大流派
#### Optimistic Rollup (乐观汇总)
*   **原理**: “先上车后补票”。**假设所有交易都是诚实的**，直接打包上传。
*   **挑战期**: 有 7 天的“挑战窗口期”。如果有人发现作恶（Fraud Proof），可以提交证据挑战，成功则回滚并惩罚作恶者。
*   **缺点**: 从 L2 提现回 L1 需要等待 7 天（除非用第三方跨链桥）。
*   **代表产品**:
    *   **Arbitrum (One)**: 目前 TVL 最大的 L2。
    *   **Optimism (OP)**: 提出了 OP Stack，很多链基于此构建（如 Base）。
    *   **Base**: Coinbase 推出的 L2，没有发币。

#### ZK Rollup (零知识汇总)
*   **原理**: “持证上岗”。每次打包上传时，都附带一个**零知识证明 (Zero-Knowledge Proof)**，通过数学直接证明这批交易是合法的。
*   **优点**: 安全性更高，**提现不需要等待 7 天**（只需几十分钟生成证明）。
*   **缺点**: 生成证明计算量大，目前技术复杂度高，EVM 兼容性稍差（正在解决）。
*   **代表产品**:
    *   **zkSync**: 老牌 ZK 方案。
    *   **Starknet**: 使用 Cairo 语言，性能极高。
    *   **Scroll / Linea**: 致力于 zkEVM，兼容性好。

### 4. 常见业务/协议分布
面试官可能会问：“Uniswap 是 L1 还是 L2 的？”

*   **Layer 1 (L1) 业务**:
    *   **资产发行**: ETH 原生代币，大部分蓝筹 NFT (CryptoPunks, BAYC)。
    *   **底层结算**: **MakerDAO** (DAI 的抵押品主要在 L1)，**Aave** (主池在 L1)。
    *   **高价值/低频操作**: 只有大额资金存管才倾向于留在 L1。
*   **Layer 2 (L2) 业务**:
    *   **高频交易 (DEX)**: **GMX** (衍生品/合约交易，需要极快速度和低费)，**dYdX** (早期在 L2，现在转为 App Chain)。
    *   **GameFi / SocialFi**: **Farcaster** (去中心化社交，在 Optimism)，链游通常都在 L2。
    *   **多链部署**: **Uniswap, Aave, Curve** 现在的策略是“全链部署”，在 L1, Arb, OP, Base 上都有合约，但 L2 的交易量正在超越 L1。

## 7. Opinion Labs 深度调研 (Target Company Analysis)

根据最新研报 (ChainCatcher)，以下是该公司及其产品的核心技术细节，面试必看。

### 1. 核心架构与技术栈
*   **多链部署策略 (Multi-chain Strategy)**:
    *   **BNB Chain / opBNB (当前主力)**:
        *   **背景**: Opinion Labs 是 **Binance Labs MVB 第 7 季** (Most Valuable Builder) 的孵化项目。
        *   **AlphaOrBeta**: 他们的首款产品主要部署在 BNB Chain 和 opBNB (L2) 上，利用低 Gas 费吸引了大量社交用户。
        *   **面试话术**: "我知道你们是 Binance Labs 孵化的项目，早期在 BNB Chain 生态积累了大量用户，特别是利用 opBNB 的低成本优势做 SocialFi。"
    *   **Monad (未来/高性能)**:
        *   **什么是 Monad**: 一条**高性能 Layer 1 公链**，主打 **并行执行 (Parallel Execution)**。
        *   **为什么 O.LAB 选它**: 预测市场需要极高的频次和极低的延迟。Monad 的 TPS 可达 10,000+，能提供接近中心化交易所 (CEX) 的丝滑体验。
        *   **加分点**: 提到 Monad 说明你关注最新的技术叙事，理解他们从 SocialFi (BNB) 向专业交易 (Monad) 扩展的战略。
*   **基础设施**:
    *   **Opinion Protocol**: 核心协议，特点是**无需许可 (Permissionless)**。任何人都可以在上面创建市场。
    *   **Consensus Oracle (共识预言机)**:
        *   **机制**: 他们使用自己构建的“共识预言机”，而不是单纯依赖 Chainlink。
        *   **原理**: 依靠参与者的共识将结果上链，并使用加密经济激励（Incentives）来确保记录准确。
        *   **面试题预测**: "如果 Consensus Oracle 的节点作恶（比如把输判成赢）怎么办？"（答案通常涉及：质押惩罚/Slashing、博弈论设计）。

### 2. 产品矩阵
*   **AlphaOrBeta**: 早期推出的产品，侧重 **SocialFi + Prediction**。用户通过投票表达观点，更轻量级。
*   **O.LAB**: 专业的去中心化预测市场设施，支持 **ERC-20** 代币直接交易，深度更深。

### 3. 解决的核心问题
1.  **创建门槛**: 传统预测市场创建流程复杂，O.LAB 致力于降低门槛，实现 UGC (User Generated Content) 式的市场创建。
2.  **信息发现**: 通过“真金白银”的下注 (Skin in the game) 来过滤噪音。比起单纯的“民调”，预测市场的价格更能反映真实概率。

## 8. 面试准备建议

1.  **复习 Ethers.js / Wagmi 文档**。
2.  **体验产品**: 去 Polymarket 玩一下，理解什么是 "Shares" (份额) 和 "Outcome Token" (结果代币)。
3.  **准备一个 Demo**: 如果能在面试中展示一个简单的 DApp (连接钱包 + 读取余额)，会非常有说服力。
